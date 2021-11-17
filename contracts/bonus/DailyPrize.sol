// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../libraries/SafeERC20.sol";

contract DailyPrize is Ownable, VRFConsumerBase {
    using SafeERC20 for IERC20;

    event DrawRequested(bytes32 requestID, uint256 indexed day, uint256 prize);
    event ResultDrawn(uint256 indexed day);
    event PrizeClaimed(
        uint256 indexed day,
        uint8 indexed place,
        address indexed player,
        uint256 prize
    );
    event TicketsAdded(
        uint256 indexed day,
        address indexed player,
        uint256 tickets,
        uint256 timestamp
    );
    event PrizeAdded(uint256 indexed day, uint256 amount, uint256 timestamp);
    event RandomFulfilled(uint256 indexed day, uint256 randomness);

    struct DailyTicketInfo {
        uint256 prize;
        uint256 totalTickets;
        address[] players;
        uint256[] sum;
    }

    mapping(uint256 => address[]) public dailyWinners;
    mapping(bytes32 => uint256) public drawRequests;
    mapping(uint256 => DailyTicketInfo) public dailyTickets;
    mapping(uint256 => mapping(uint8 => bool)) public prizeClaimed;
    mapping(uint256 => bool) private _drawn;
    mapping(uint256 => uint256) private _rand;
    mapping(uint256 => bool) private _randFulfilled;
    mapping(uint256 => mapping(uint256 => bool)) private _winnerSelected;

    address public treasury;
    IERC20 public tcp;
    address public game;

    // VRF
    bytes32 internal vrfKeyHash;
    uint256 internal vrfFee;

    uint256 private constant SECONDS_PER_DAY = 60 * 60 * 24;
    uint8[25] private POOL_PERCENT = [
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

    modifier onlyGameContract() {
        require(msg.sender == game, "not game contract");
        _;
    }

    constructor(
        address _treasury,
        IERC20 _tcp,
        address _vrfCoordinator,
        address _link,
        bytes32 _vrfKeyHash,
        uint256 _vrfFee
    )
        VRFConsumerBase(
            _vrfCoordinator, // VRF Coordinator
            _link // LINK Token
        )
    {
        require(_treasury != address(0));
        require(address(_tcp) != address(0));
        treasury = _treasury;
        tcp = _tcp;
        vrfKeyHash = _vrfKeyHash;
        vrfFee = _vrfFee;
    }

    function winnings(uint256 _day) public view returns (address[] memory, uint256[] memory) {
        DailyTicketInfo storage info = dailyTickets[_day];
        uint256[] memory prizes = new uint256[](dailyWinners[_day].length);
        for (uint256 i; i < dailyWinners[_day].length; i++) {
            prizes[i] = (info.prize * POOL_PERCENT[i]) / 100;
        }
        return (dailyWinners[_day], prizes);
    }

    function claimPrize(uint256 _day, uint8 _place) public {
        require(!prizeClaimed[_day][_place], "already claimed");
        require(_place < dailyWinners[_day].length, "invalid place");
        address winner = dailyWinners[_day][_place];
        require(msg.sender == winner, "can't claim other's prize");

        prizeClaimed[_day][_place] = true;

        DailyTicketInfo storage info = dailyTickets[_day];
        uint256 prize = (info.prize * POOL_PERCENT[_place]) / 100;

        tcp.safeTransferFrom(treasury, msg.sender, prize);
        emit PrizeClaimed(_day, _place, msg.sender, prize);
    }

    function addTickets(address _player, uint256 _tickets) external onlyGameContract {
        require(_tickets > 0, "tickets must be > 0");

        uint256 day = block.timestamp / SECONDS_PER_DAY;
        require(!_drawn[day], "already drawn");

        DailyTicketInfo storage info = dailyTickets[day];
        info.players.push(_player);
        uint256 length = info.sum.length;
        if (length == 0) {
            info.sum.push(_tickets);
        } else {
            info.sum.push(info.sum[length - 1] + _tickets);
        }
        info.totalTickets += _tickets;

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

    function drawWinners(uint256 _day) public onlyOwner {
        require(_randFulfilled[_day], "randomness not fulfilled");
        require(dailyWinners[_day].length == 0, "already drawn");

        uint256 randomness = _rand[_day];
        DailyTicketInfo storage info = dailyTickets[_day];

        uint8 i;
        uint256 left;
        uint256 right;
        uint256 mid;

        for (i = 0; i < 25; i++) {
            uint256 rand;
            mid = 0;
            while (true) {
                rand = uint256(keccak256(abi.encodePacked(randomness, i, mid))) % info.totalTickets;
                if (!_winnerSelected[_day][rand]) {
                    _winnerSelected[_day][rand] = true;
                    break;
                }
                mid++;
            }

            left = 0;
            right = info.players.length - 1;
            while (left < right) {
                mid = (left + right) / 2;
                if (rand >= info.sum[mid]) {
                    left = mid + 1;
                } else if (rand < info.sum[mid]) {
                    right = mid;
                }
            }

            address winner = info.players[left];
            dailyWinners[_day].push(winner);
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
    function fulfillRandomness(bytes32 requestID, uint256 randomness) internal override {
        uint256 day = drawRequests[requestID];
        _rand[day] = randomness;
        _randFulfilled[day] = true;

        emit RandomFulfilled(day, randomness);
    }

    function updateTreasury(address _treasury) public onlyOwner {
        require(_treasury != address(0));
        treasury = _treasury;
    }

    function updateTCP(IERC20 _tcp) public onlyOwner {
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

    function withdrawTokens(IERC20 erc20) external onlyOwner {
        uint256 balance = erc20.balanceOf(address(this));
        erc20.transfer(msg.sender, balance);
    }
}
