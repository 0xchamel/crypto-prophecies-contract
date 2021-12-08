// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../libraries/SafeERC20.sol";

contract LeaderboardPrize is Ownable {
    using SafeERC20 for IERC20;

    event PrizeClaimed(uint256 indexed competitionId, address indexed winner, uint256 prize);

    uint256 public numCompetitions;
    mapping(uint256 => address[]) public competitionWinners;
    mapping(uint256 => uint256[]) public competitionPrizes;
    mapping(uint256 => mapping(address => bool)) public prizeClaimed;
    mapping(address => uint256) private _competitionIds;

    address public treasury;
    IERC20 public tcp;

    constructor(address _treasury, IERC20 _tcp) {
        require(_treasury != address(0));
        require(address(_tcp) != address(0));
        treasury = _treasury;
        tcp = _tcp;
    }

    function finalizeCompetition(address[] memory winners, uint256[] memory prizes)
        public
        onlyOwner
    {
        require(winners.length == prizes.length && winners.length > 0, "invalid data");

        uint256 competitionId = numCompetitions++;
        for (uint256 i = 0; i < winners.length; i++) {
            require(_competitionIds[winners[i]] != numCompetitions, "duplicate winner");
            _competitionIds[winners[i]] = numCompetitions;

            competitionWinners[competitionId].push(winners[i]);
            competitionPrizes[competitionId].push(prizes[i]);
        }
    }

    function getCompetitionInfo(uint256 competitionId) public view returns (address[] memory, uint256[] memory) {
        require(competitionId < numCompetitions, "invalid competition id");

        return (competitionWinners[competitionId], competitionPrizes[competitionId]);
    }

    function claimPrize(uint256 competitionId) public {
        require(competitionId < numCompetitions, "invalid competition id");
        require(!prizeClaimed[competitionId][msg.sender], "already claimed");

        bool isWinner;
        uint256 prize;
        for (uint i = 0; i < competitionWinners[competitionId].length; i++) {
            if (competitionWinners[competitionId][i] == msg.sender) {
                isWinner = true;
                prize = competitionPrizes[competitionId][i];
                break;
            }
        }
        require(isWinner, "not winner");

        tcp.safeTransferFrom(treasury, msg.sender, prize);
        emit PrizeClaimed(competitionId, msg.sender, prize);

        prizeClaimed[competitionId][msg.sender] = true;
    }

    function updateTreasury(address _treasury) public onlyOwner {
        require(_treasury != address(0));
        treasury = _treasury;
    }

    function updateTCP(IERC20 _tcp) public onlyOwner {
        require(address(_tcp) != address(0));
        tcp = _tcp;
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
