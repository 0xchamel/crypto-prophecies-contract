// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../libraries/SafeERC20.sol";

contract DailyPrizeBackUp is Ownable, VRFConsumerBase {
    using SafeERC20 for IERC20;

    event DrawRequested(bytes32 requestID, uint256 indexed day, uint256 prize);
    event ResultDrawn(uint256 indexed day);
    event PrizeClaimed(
        uint256 indexed day,
        address indexed player,
        uint256 prize
    );
    event TicketsAdded(uint256 indexed day, uint256 tickets, uint256 timestamp);
    event PrizeAdded(uint256 indexed day, uint256 amount, uint256 timestamp);
    event RandomFulfilled(uint256 indexed day, uint256 randomness);

    struct DailyTicketInfo {
        uint256 prize;
        uint256 totalTickets;
        address[] players;
        uint256[] sum;
        mapping(address => uint256) tickets;
    }

    mapping(uint256 => mapping(address => uint256)) public dailyPrizes;
    mapping(uint256 => address[]) public dailyWinners;
    mapping(bytes32 => uint256) public drawRequests;
    mapping(uint256 => DailyTicketInfo) public dailyTickets;
    mapping(uint256 => bool) private _drawn;
    mapping(uint256 => uint256) private _rand;

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
        info.totalTickets += _tickets;

        emit TicketsAdded(day, _tickets, block.timestamp);
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
        require(!_drawn[_day], "already drawn");

        _drawn[_day] = true;

        bytes32 requestID = getRandomNumber();
        drawRequests[requestID] = _day;

        emit DrawRequested(requestID, _day, dailyTickets[_day].prize);

        DailyTicketInfo storage info = dailyTickets[_day];
        info.sum.push(info.tickets[info.players[0]]);
        for (uint i = 1; i < info.players.length; i++) {
            info.sum.push(info.sum[i - 1] + info.tickets[info.players[i]]);
        }
    }

    function drawWinners(uint256 _day) public onlyOwner {
        uint256 randomness = _rand[_day];
        require(randomness > 0, "randomness not fulfilled");
        DailyTicketInfo storage info = dailyTickets[_day];
        mapping(address => uint256) storage dailyPrize = dailyPrizes[_day];

        uint256 i;
        uint8 totalAllocPoint;
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
            if (dailyPrize[winner] == 0) {
                dailyWinners[_day].push(winner);
            }
            dailyPrize[winner] += POOL_PERCENT[i];
            totalAllocPoint += POOL_PERCENT[i];
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
