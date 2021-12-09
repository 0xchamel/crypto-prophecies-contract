// SPDX-License-Identifier: MIT

pragma solidity 0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

import "../interfaces/IProphet.sol";
import "../interfaces/IDailyPrize.sol";
import "../interfaces/IExchange.sol";

interface IMPOT {
    function mint(address _to, uint256 _amount) external;
}

/// no reward tickets for two winners case
/// bTCP, TCP back to users when there is no winners
contract CryptoPropheciesGame is ReentrancyGuard, Ownable {
    using Address for address;
    using SafeERC20 for IERC20;

    struct Battle {
        address player1;
        address player2;
        address winner;
        uint256[2] TCPAmount;
        uint256[2] bTCPAmount;
        uint256 startTimestamp;
        uint256 player1ProphetId;
        uint256 player2ProphetId;
        bool isChallenge;
    }

    mapping(uint256 => Battle) public battles;
    mapping(address => bool) public GCs;
    mapping(uint16 => uint16[2]) public multipliers;

    // Magic token
    IMPOT public MPOT;

    // bTCP swap contract address
    IExchange public ctExchange;

    // Prophet contract address
    address public prophetAddr;

    //TCP token contract address
    address public TCP;

    //bTCP token contract address
    address public bTCP;

    //KFBurn address
    address public kfBurnAddr;

    //KFDailyPrize address
    address public kfDailyPrizeAddr;

    //KFCustody address
    address public kfCustodyAddr;

    //DailyPrize contract address;
    address public ctDailyPrize;

    //battle index
    uint256 public battleId;

    uint256 public MAX_BATTLE_DURATION = 1 days;

    event BattleEnded(uint256 indexed battleId, address indexed winner);

    event KFBurnAddressUpdated(address account);

    event KFDailyPrizeAddressUpdated(address account);

    event KFCustodyAddressUpdated(address account);

    event CTDailyPrizeUpdated(address account);

    event KingdomFeeDeducted(uint256 amount);

    event WinBattleFunds(address indexed account, uint256 amount);

    event BattleCreated(
        uint256 battleId,
        address indexed player1,
        address indexed player2,
        uint256 wagerAmount,
        uint256 timestamp,
        uint256 player1ProphetId,
        uint256 player2ProphetId,
        uint256 player1ProphetTier,
        uint256 player2ProphetTier,
        bool isChallenge
    );

    event DailyPrizeTicketAdded(address indexed account, uint256 amount, uint256 timestamp);

    constructor(
        address _MPOT,
        address _TCP,
        address _bTCP,
        address _kfBurnAddr,
        address _kfDailyPrizeAddr,
        address _kfCustodyAddr,
        address _ctDailyPrize,
        address _ctExchange
    ) {
        require(_kfBurnAddr != address(0), "kfBurnAddr not set");
        require(_kfCustodyAddr != address(0), "kfCustodyAddr not set");
        require(_kfDailyPrizeAddr != address(0), "kfDailyPrizeAddress not set");
        require(_ctDailyPrize != address(0), "ctDailyPrize not set");

        MPOT = IMPOT(_MPOT);
        TCP = _TCP;
        bTCP = _bTCP;
        kfBurnAddr = _kfBurnAddr;
        kfCustodyAddr = _kfCustodyAddr;
        kfDailyPrizeAddr = _kfDailyPrizeAddr;
        ctDailyPrize = _ctDailyPrize;
        ctExchange = IExchange(_ctExchange);

        IERC20(bTCP).approve(_ctExchange, 2**256 - 1);
    }

    modifier onlyGC() {
        require(GCs[msg.sender], "Not have GC permission");
        _;
    }

    function createBattle(
        address _player1,
        uint256 _player1ProphetId,
        address _player2,
        uint256 _player2ProphetId,
        uint256 _wagerAmount,
        uint256 _expireTime,
        bool _isChallenge
    ) external nonReentrant onlyGC {
        require(_player1 != address(0), "Invalid player1 address");
        require(_player2 != address(0), "Invalid player2 address");
        require(_player1 != _player2, "Players addresses are the same");
        require(block.timestamp < _expireTime, "Time to start battle was expired");
        require(
            INFT(prophetAddr).ownerOf(_player1ProphetId) == _player1,
            "Player1 not owning nft item"
        );
        require(
            INFT(prophetAddr).ownerOf(_player2ProphetId) == _player2,
            "Player2 not owning nft item"
        );

        // (uint256 player1TCP, uint256 player1bTCP) = _sendWager(_player1, _wagerAmount);
        // (uint256 player2TCP, uint256 player2bTCP) = _sendWager(_player2, _wagerAmount);

        _createBattle(
            _player1,
            _player2,
            _player1ProphetId,
            _player2ProphetId,
            _wagerAmount,
            _isChallenge
        );
    }

    function endBattle(uint256 _battleId, address _winner) external nonReentrant onlyGC {
        Battle storage battle = battles[_battleId];

        require(battle.winner == address(1), "Battle already ended");
        require(battle.player1 != address(0), "Battle not found");
        require(
            battle.player1 == _winner || battle.player2 == _winner || _winner == address(0),
            "Invalid winner address"
        );
        battle.winner = _winner;
        emit BattleEnded(_battleId, _winner);

        _transferFundsToWinner(_battleId);
    }

    function setGC(address _account, bool _value) external onlyOwner {
        require(_account != address(0), "Invalid address");
        GCs[_account] = _value;
    }

    function updateKFBurnAddress(address _account) external onlyOwner {
        require(_account != address(0), "Invalid address");
        kfBurnAddr = _account;
        emit KFBurnAddressUpdated(_account);
    }

    function updateKFDailyPrizeAddress(address _account) external onlyOwner {
        require(_account != address(0), "Invalid address");
        kfDailyPrizeAddr = _account;
        emit KFDailyPrizeAddressUpdated(_account);
    }

    function updateKFCustodyAddress(address _account) external onlyOwner {
        require(_account != address(0), "Invalid address");
        kfCustodyAddr = _account;
        emit KFCustodyAddressUpdated(_account);
    }

    function updateCTDailyPrize(address _contract) external onlyOwner {
        require(_contract.isContract(), "Invalid contract");
        ctDailyPrize = _contract;
        emit CTDailyPrizeUpdated(_contract);
    }

    function updateProphetContractAddress(address _contract) external onlyOwner {
        require(_contract != address(0), "Invalid address");
        prophetAddr = _contract;
    }

    function updateExchangeContractAddress(address _contract) external onlyOwner {
        require(_contract != address(0), "Invalid address");
        ctExchange = IExchange(_contract);
        IERC20(bTCP).approve(_contract, 2**256 - 1);
    }

    function updateMultipliers(
        uint16[] memory _tiers,
        uint16[] memory _winMultipliers,
        uint16[] memory _loseMultipliers
    ) external onlyOwner {
        require(_tiers.length == _winMultipliers.length && _tiers.length != 0, "Invalid length");
        require(_winMultipliers.length == _loseMultipliers.length, "Invalid length");

        for (uint16 i = 0; i < _tiers.length; i++) {
            multipliers[_tiers[i]][0] = _winMultipliers[i];
            multipliers[_tiers[i]][1] = _loseMultipliers[i];
        }
    }

    function updateMPOT(address _MPOT) external onlyOwner {
        require(_MPOT != address(0), "Invalid address");
        MPOT = IMPOT(_MPOT);
    }

    function _sendWager(address _sender, uint256 _amount) internal returns (uint256, uint256) {
        uint256 TCPBal = IERC20(TCP).balanceOf(_sender);
        uint256 bTCPBal = IERC20(bTCP).balanceOf(_sender);
        require(TCPBal + bTCPBal >= _amount, "Not enough token amount in user wallet");

        if (bTCPBal >= _amount) {
            IERC20(bTCP).safeTransferFrom(_sender, address(this), _amount);

            return (0, _amount);
        } else if (bTCPBal < _amount && bTCPBal != 0) {
            IERC20(bTCP).safeTransferFrom(_sender, address(this), bTCPBal);
            IERC20(TCP).safeTransferFrom(_sender, address(this), _amount - bTCPBal);

            return (_amount - bTCPBal, bTCPBal);
        }

        IERC20(TCP).safeTransferFrom(_sender, address(this), _amount);
        return (_amount, 0);
    }

    function _transferFundsToWinner(uint256 _battleId) internal {
        Battle memory battle = battles[_battleId];

        if (battle.winner == address(0)) {
            uint256 kingdomFeeTCP = ((battle.TCPAmount[0] + battle.TCPAmount[1]) * 3) / 100;
            uint256 kingdomFeebTCP = (((battle.bTCPAmount[0] + battle.bTCPAmount[1])) * 3) / 100;

            if (kingdomFeebTCP != 0) {
                ctExchange.swap(kingdomFeebTCP);
            }

            // deduct kingdom fee from both TCP & bTCP
            _deductKingdomFee(TCP, kingdomFeeTCP + kingdomFeebTCP);

            if (!battle.isChallenge) {
                // call dailyPrize contract method
                IDailyPrize(ctDailyPrize).addPrize(((kingdomFeeTCP + kingdomFeebTCP) / 10) * 4);
            }

            // refund weager amount to both players which deducted kingdom fee
            if (battle.TCPAmount[0] + battle.TCPAmount[1] != 0) {
                IERC20(TCP).safeTransfer(
                    battle.player1,
                    battle.TCPAmount[0] -
                        (kingdomFeeTCP * battle.TCPAmount[0]) /
                        (battle.TCPAmount[0] + battle.TCPAmount[1])
                );
                IERC20(TCP).safeTransfer(
                    battle.player2,
                    battle.TCPAmount[1] -
                        (kingdomFeeTCP -
                            (kingdomFeeTCP * battle.TCPAmount[0]) /
                            (battle.TCPAmount[0] + battle.TCPAmount[1]))
                );
            }

            if (battle.bTCPAmount[0] + battle.bTCPAmount[1] != 0) {
                IERC20(bTCP).safeTransfer(
                    battle.player1,
                    battle.bTCPAmount[0] -
                        (kingdomFeebTCP * battle.bTCPAmount[0]) /
                        (battle.bTCPAmount[0] + battle.bTCPAmount[1])
                );
                IERC20(bTCP).safeTransfer(
                    battle.player2,
                    battle.bTCPAmount[1] -
                        (kingdomFeebTCP -
                            (kingdomFeebTCP * battle.bTCPAmount[0]) /
                            (battle.bTCPAmount[0] + battle.bTCPAmount[1]))
                );
            }

            return;
        }

        if (battle.bTCPAmount[0] + battle.bTCPAmount[1] != 0 && battle.winner != address(0)) {
            // Burn bTCP token and get TCP token from Exchange contract
            ctExchange.swap(battle.bTCPAmount[0] + battle.bTCPAmount[1]);
        }

        // transfer kingdom fee
        uint256 totalTokenAmount = battle.TCPAmount[0] +
            battle.TCPAmount[1] +
            battle.bTCPAmount[0] +
            battle.bTCPAmount[1];
        uint256 kingdomFee = (totalTokenAmount * 3) / 100;

        // deduct only TCP kingdom fee
        _deductKingdomFee(TCP, kingdomFee);

        IERC20(TCP).safeTransfer(battle.winner, totalTokenAmount - kingdomFee);

        emit WinBattleFunds(battle.winner, totalTokenAmount - kingdomFee);

        if (battle.isChallenge) return;

        // call dailyPrize contract method
        IDailyPrize(ctDailyPrize).addPrize((kingdomFee / 10) * 4);

        // emit events for daily prize tickets
        (, uint16 player1Rarity, , , , ) = IProphet(prophetAddr).prophets(battle.player1ProphetId);
        (, uint16 player2Rarity, , , , ) = IProphet(prophetAddr).prophets(battle.player2ProphetId);

        uint256 ticketAmount = totalTokenAmount / 2 / 1e18;

        if (battle.winner == battle.player1) {
            if (ticketAmount * multipliers[player1Rarity][0] != 0) {
                IDailyPrize(ctDailyPrize).addTickets(
                    battle.player1,
                    ticketAmount * multipliers[player1Rarity][0]
                );
                emit DailyPrizeTicketAdded(
                    battle.player1,
                    ticketAmount * multipliers[player1Rarity][0],
                    block.timestamp
                );
            }

            if (ticketAmount * multipliers[player2Rarity][1] != 0) {
                IDailyPrize(ctDailyPrize).addTickets(
                    battle.player2,
                    ticketAmount * multipliers[player2Rarity][1]
                );
                emit DailyPrizeTicketAdded(
                    battle.player2,
                    ticketAmount * multipliers[player2Rarity][1],
                    block.timestamp
                );
            }
        }

        if (battle.winner == battle.player2) {
            if (ticketAmount * multipliers[player2Rarity][0] != 0) {
                IDailyPrize(ctDailyPrize).addTickets(
                    battle.player2,
                    ticketAmount * multipliers[player2Rarity][0]
                );
                emit DailyPrizeTicketAdded(
                    battle.player2,
                    ticketAmount * multipliers[player2Rarity][0],
                    block.timestamp
                );
            }

            if (ticketAmount * multipliers[player1Rarity][1] != 0) {
                IDailyPrize(ctDailyPrize).addTickets(
                    battle.player1,
                    ticketAmount * multipliers[player1Rarity][1]
                );
                emit DailyPrizeTicketAdded(
                    battle.player1,
                    ticketAmount * multipliers[player1Rarity][1],
                    block.timestamp
                );
            }
        }
    }

    function _deductKingdomFee(address token, uint256 kingdomFee) internal {
        // 50% kingdom fee to burn address
        IERC20(token).safeTransfer(kfBurnAddr, kingdomFee / 2);
        // 40% kingdom fee to daily prize address
        IERC20(token).safeTransfer(kfDailyPrizeAddr, (kingdomFee / 10) * 4);
        // 10% kingdom fee to team custody
        IERC20(token).safeTransfer(
            kfCustodyAddr,
            kingdomFee - kingdomFee / 2 - (kingdomFee / 10) * 4
        );

        emit KingdomFeeDeducted(kingdomFee);
    }

    function _createBattle(
        address _player1,
        address _player2,
        uint256 _player1ProphetId,
        uint256 _player2ProphetId,
        uint256 _wagerAmount,
        bool _isChallenge
    ) internal {
        (uint256 player1TCP, uint256 player1bTCP) = _sendWager(_player1, _wagerAmount);
        (uint256 player2TCP, uint256 player2bTCP) = _sendWager(_player2, _wagerAmount);

        battles[battleId] = Battle(
            _player1,
            _player2,
            address(1),
            [player1TCP, player2TCP],
            [player1bTCP, player2bTCP],
            block.timestamp,
            _player1ProphetId,
            _player2ProphetId,
            _isChallenge
        );

        (, uint16 player1Rarity, , , , ) = IProphet(prophetAddr).prophets(_player1ProphetId);
        (, uint16 player2Rarity, , , , ) = IProphet(prophetAddr).prophets(_player2ProphetId);

        _emitBattleCreatedEvent(battleId, _wagerAmount, player1Rarity, player2Rarity);

        battleId++;
    }

    function _emitBattleCreatedEvent(
        uint256 _battleId,
        uint256 _wagerAmount,
        uint256 _player1Rarity,
        uint256 _player2Rarity
    ) internal {
        Battle memory battle = battles[_battleId];

        emit BattleCreated(
            _battleId,
            battle.player1,
            battle.player2,
            _wagerAmount,
            block.timestamp,
            battle.player1ProphetId,
            battle.player2ProphetId,
            _player1Rarity,
            _player2Rarity,
            battle.isChallenge
        );
    }
}
