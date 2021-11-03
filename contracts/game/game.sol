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

interface IMPOT {
    function mint(address _to, uint256 _amount) external;
}

contract CryptoPropheciesGame is ReentrancyGuard, Ownable {
    using Address for address;
    using SafeERC20 for IERC20;

    struct Battle {
        address player1;
        address player2;
        address winner;
        uint256 TCPAmount;
        uint256 startTimestamp;
        uint256 player1ProphetId;
        uint256 player2ProphetId;
    }

    mapping(uint256 => Battle) public battles;
    mapping(address => bool) public GCs;
    mapping(uint16 => uint16[2]) public multipliers;

    // Magic token
    IMPOT public MPOT;

    // Prophet contract address
    address public prophetAddr;

    //TCP token address
    address public TCP;

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
        uint256 player2ProphetTier
    );

    event DailyPrizeTicketAdded(address indexed account, uint256 amount, uint256 timestamp);

    constructor(
        address _MPOT,
        address _TCP,
        address _kfBurnAddr,
        address _kfDailyPrizeAddr,
        address _kfCustodyAddr,
        address _ctDailyPrize
    ) {
        require(_kfBurnAddr != address(0), "kfBurnAddr not set");
        require(_kfCustodyAddr != address(0), "kfCustodyAddr not set");
        require(_kfDailyPrizeAddr != address(0), "kfDailyPrizeAddress not set");
        require(_ctDailyPrize != address(0), "ctDailyPrize not set");

        MPOT = IMPOT(_MPOT);
        TCP = _TCP;
        kfBurnAddr = _kfBurnAddr;
        kfCustodyAddr = _kfCustodyAddr;
        kfDailyPrizeAddr = _kfDailyPrizeAddr;
        ctDailyPrize = _ctDailyPrize;
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
        uint256 _wagerAmount
    ) external nonReentrant onlyGC {
        require(_player1 != address(0), "Invalid player1 address");
        require(_player2 != address(0), "Invalid player2 address");
        require(_player1 != _player2, "Players addresses are the same");
        require(INFT(prophetAddr).ownerOf(_player1ProphetId) == _player1, "Player1 not owning nft item");
        require(INFT(prophetAddr).ownerOf(_player2ProphetId) == _player2, "Player2 not owning nft item");

        _sendWager(_player1, _wagerAmount);
        _sendWager(_player2, _wagerAmount);

        battles[battleId] = Battle(_player1, _player2, address(1), 2 * _wagerAmount, block.timestamp, _player1ProphetId, _player2ProphetId);

        (, uint16 player1Rarity, , , , ) = IProphet(prophetAddr).prophets(_player1ProphetId);
        (, uint16 player2Rarity, , , , ) = IProphet(prophetAddr).prophets(_player2ProphetId);

        emit BattleCreated(
            battleId,
            _player1,
            _player2,
            _wagerAmount,
            block.timestamp,
            _player1ProphetId,
            _player2ProphetId,
            player1Rarity,
            player2Rarity
        );
        battleId++;
    }

    function endBattle(uint256 _battleId, address _winner) external nonReentrant onlyGC {
        Battle storage battle = battles[_battleId];

        require(battle.winner == address(1), "Battle already ended");
        require(battle.player1 != address(0), "Battle not found");
        require(battle.player1 == _winner || battle.player2 == _winner || _winner == address(0), "Invalid winner address");
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

    function updateProphetContractAddress(address _account) external onlyOwner {
        require(_account != address(0), "Invalid address");
        prophetAddr = _account;
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

    function _sendWager(address _sender, uint256 _amount) internal {
        uint256 TCPBal = IERC20(TCP).balanceOf(_sender);
        require(TCPBal >= _amount, "Not enough token amount");

        IERC20(TCP).safeTransferFrom(_sender, address(this), _amount);
    }

    function _transferFundsToWinner(uint256 _battleId) internal {
        Battle memory battle = battles[_battleId];

        // transfer kingdom fee

        uint256 kingdomFee = (battle.TCPAmount * 3) / 100;

        // 50% kingdom fee to burn address
        IERC20(TCP).safeTransfer(kfBurnAddr, kingdomFee / 2);
        // 40% kingdom fee to daily prize address
        IERC20(TCP).safeTransfer(kfDailyPrizeAddr, (kingdomFee / 10) * 4);
        // 10% kingdom fee to team custody
        IERC20(TCP).safeTransfer(kfCustodyAddr, kingdomFee - kingdomFee / 2 - (kingdomFee / 10) * 4);
        // call dailyPrize contract method
        IDailyPrize(ctDailyPrize).addPrize((kingdomFee / 10) * 4);

        emit KingdomFeeDeducted(kingdomFee);

        // transfer remaining to winner
        if (battle.winner == address(0)) {
            IERC20(TCP).safeTransfer(battle.player1, (battle.TCPAmount - kingdomFee) / 2);
            IERC20(TCP).safeTransfer(battle.player2, (battle.TCPAmount - kingdomFee) / 2);
        } else {
            IERC20(TCP).safeTransfer(battle.winner, battle.TCPAmount - kingdomFee);
        }

        // emit events for daily prize tickets
        (, uint16 player1Rarity, , , , ) = IProphet(prophetAddr).prophets(battle.player1ProphetId);
        (, uint16 player2Rarity, , , , ) = IProphet(prophetAddr).prophets(battle.player2ProphetId);

        uint256 ticketAmount = battle.TCPAmount / 2 / 1e18;

        if (battle.winner == battle.player1) {
            if (ticketAmount * multipliers[player1Rarity][0] != 0) {
                IDailyPrize(ctDailyPrize).addTickets(battle.player1, ticketAmount * multipliers[player1Rarity][0]);
                emit DailyPrizeTicketAdded(battle.player1, ticketAmount * multipliers[player1Rarity][0], block.timestamp);
            }

            if (ticketAmount * multipliers[player2Rarity][1] != 0) {
                IDailyPrize(ctDailyPrize).addTickets(battle.player2, ticketAmount * multipliers[player2Rarity][1]);
                emit DailyPrizeTicketAdded(battle.player2, ticketAmount * multipliers[player2Rarity][1], block.timestamp);
            }
        }

        if (battle.winner == battle.player2) {
            if (ticketAmount * multipliers[player2Rarity][0] != 0) {
                IDailyPrize(ctDailyPrize).addTickets(battle.player2, ticketAmount * multipliers[player2Rarity][0]);
                emit DailyPrizeTicketAdded(battle.player2, ticketAmount * multipliers[player2Rarity][0], block.timestamp);
            }

            if (ticketAmount * multipliers[player1Rarity][1] != 0) {
                IDailyPrize(ctDailyPrize).addTickets(battle.player1, ticketAmount * multipliers[player1Rarity][1]);
                emit DailyPrizeTicketAdded(battle.player1, ticketAmount * multipliers[player1Rarity][1], block.timestamp);
            }
        }

        if (battle.winner == address(0)) {
            IDailyPrize(ctDailyPrize).addTickets(battle.player1, ticketAmount * multipliers[player1Rarity][0]);
            IDailyPrize(ctDailyPrize).addTickets(battle.player2, ticketAmount * multipliers[player2Rarity][0]);
            emit DailyPrizeTicketAdded(battle.player1, ticketAmount * multipliers[player1Rarity][0], block.timestamp);
            emit DailyPrizeTicketAdded(battle.player2, ticketAmount * multipliers[player2Rarity][0], block.timestamp);
        }

        emit WinBattleFunds(battle.winner, battle.TCPAmount - kingdomFee);
    }
}
