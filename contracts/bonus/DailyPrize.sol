// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "../libraries/VRFConsumerBaseUpgradeable.sol";

contract DailyPrize is OwnableUpgradeable, VRFConsumerBaseUpgradeable {
    using SafeERC20Upgradeable for IERC20Upgradeable;

    event DrawRequested(bytes32 requestID, uint256 indexed day, uint256 prize);
    event ResultDrawn(uint256 indexed day);
    event PrizeClaimed(
        uint256 indexed day,
        address indexed player,
        uint256 prize
    );
    event TicketsAdded(uint256 indexed day, address indexed player, uint256 tickets, uint256 timestamp);
    event PrizeAdded(uint256 indexed day, uint256 amount, uint256 timestamp);
    event RandomFulfilled(uint256 indexed day, uint256 randomness);

    struct DailyTicketInfo {
        uint256 prize;
        address[] players;
        mapping(address => uint256) tickets;
    }

    mapping(uint256 => mapping(address => uint256)) public dailyPrizes;
    mapping(uint256 => address[]) public dailyWinners;
    mapping(bytes32 => uint256) public drawRequests;
    mapping(uint256 => DailyTicketInfo) public dailyTickets;
    mapping(uint256 => bool) private _drawn;
    mapping(uint256 => uint256) private _rand;
    mapping(uint256 => bool) private _randFulfilled;

    address public treasury;
    IERC20Upgradeable public tcp;
    address public game;

    // VRF
    bytes32 internal vrfKeyHash;
    uint256 internal vrfFee;

    uint256 private constant SECONDS_PER_DAY = 60 * 60 * 24;
    uint8[25] private POOL_PERCENT;

    modifier onlyGameContract() {
        require(msg.sender == game, "not game contract");
        _;
    }

    function initialize(
        address _treasury,
        IERC20Upgradeable _tcp,
        address _vrfCoordinator,
        address _link,
        bytes32 _vrfKeyHash,
        uint256 _vrfFee
    ) public
    initializer
    {
        require(_treasury != address(0));
        require(address(_tcp) != address(0));
        treasury = _treasury;
        tcp = _tcp;
        vrfKeyHash = _vrfKeyHash;
        vrfFee = _vrfFee;
        POOL_PERCENT = [
        15,
        10,
        7,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        3,
        3,
        3,
        3,
        3,
        3,
        3,
        3,
        3,
        1,
        1,
        1,
        1,
        1,
        1
    ];

        __VRFConsumerBaseUpgradeable_init(
            _vrfCoordinator, // VRF Coordinator
            _link // LINK Token
        );
        __Ownable_init();
    }

    function winnings(uint256 _day) public view returns (address[] memory, uint256[] memory) {
        DailyTicketInfo storage info = dailyTickets[_day];
        uint256[] memory prizes = new uint256[](dailyWinners[_day].length);
        for (uint256 i; i < dailyWinners[_day].length; i++) {
            prizes[i] = dailyPrizes[_day][dailyWinners[_day][i]] * info.prize / 100;
        }
        return (dailyWinners[_day], prizes);
    }

    function claimPrize(uint256 _day) public {
        DailyTicketInfo storage info = dailyTickets[_day];
        uint256 prize = dailyPrizes[_day][msg.sender] * info.prize / 100;
        require(prize > 0, "no prize!");

        dailyPrizes[_day][msg.sender] = 0;

        tcp.safeTransferFrom(treasury, msg.sender, prize);
        emit PrizeClaimed(_day, msg.sender, prize);
    }

    function addTickets(
        address _player,
        uint256 _tickets
    ) external onlyGameContract {
        require(_tickets > 0, "tickets must be > 0");

        uint256 day = block.timestamp / SECONDS_PER_DAY;
        require(!_drawn[day], "already drawn");

        DailyTicketInfo storage info = dailyTickets[day];
        if (info.tickets[_player] == 0) {
            info.players.push(_player);
        }
        info.tickets[_player] += _tickets;

        emit TicketsAdded(day, _player, _tickets, block.timestamp);
    }

    function addPrize(uint256 _prize) external onlyGameContract {
        uint256 day = block.timestamp / SECONDS_PER_DAY;
        require(!_drawn[day], "already drawn");

        DailyTicketInfo storage info = dailyTickets[day];
        info.prize += _prize;

        emit PrizeAdded(day, _prize, block.timestamp);
    }

    function topupTreasury(uint256 _day, uint256 _amount) external onlyOwner {
        require(!_drawn[_day], "already drawn");
        DailyTicketInfo storage info = dailyTickets[_day];
        info.prize += _amount;

        tcp.safeTransferFrom(msg.sender, treasury, _amount);
        emit PrizeAdded(_day, _amount, block.timestamp);
    }

    function draw(uint256 _day) public onlyOwner {
        require((_day + 1) * SECONDS_PER_DAY < block.timestamp, "invalid day");
        require(!_drawn[_day], "draw already requested");
        _drawn[_day] = true;

        bytes32 requestID = getRandomNumber();
        drawRequests[requestID] = _day;

        emit DrawRequested(requestID, _day, dailyTickets[_day].prize);
    }

    function drawWinners(uint256 _day, address[] memory _winners) public onlyOwner {
        require(_randFulfilled[_day], "randomness not fulfilled");
        require(_winners.length > 0 && _winners.length <= 25, "invalid input data");
        require(dailyPrizes[_day][_winners[0]] == 0, "already drawn");

        for (uint256 i = 0; i < 25; i++) {
            address winner = _winners[i];
            if (dailyPrizes[_day][winner] == 0) {
                dailyWinners[_day].push(winner);
            }
            dailyPrizes[_day][winner] += POOL_PERCENT[i];
        }

        emit ResultDrawn(_day);
    }

    /**
     * Requests randomness from a user-provided seed
     */
    function getRandomNumber() internal returns (bytes32 requestID) {
        require(LINK.balanceOf(address(this)) >= vrfFee, "Not enough LINK");
        return requestRandomness(vrfKeyHash, vrfFee);
    }

    /**
     * Callback function used by VRF Coordinator
     */
    function fulfillRandomness(bytes32 requestID, uint256 randomness)
        internal
        override
    {
        uint256 day = drawRequests[requestID];
        _rand[day] = randomness;
        _randFulfilled[day] = true;

        emit RandomFulfilled(day, randomness);
    }

    function updateTreasury(address _treasury) public onlyOwner {
        require(_treasury != address(0));
        treasury = _treasury;
    }

    function updateTCP(IERC20Upgradeable _tcp) public onlyOwner {
        require(address(_tcp) != address(0));
        tcp = _tcp;
    }

    function updateGame(address _game) public onlyOwner {
        game = _game;
    }

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        payable(msg.sender).transfer(balance);
    }

    function withdrawTokens(IERC20Upgradeable erc20) external onlyOwner {
        uint256 balance = erc20.balanceOf(address(this));
        erc20.transfer(msg.sender, balance);
    }
}
