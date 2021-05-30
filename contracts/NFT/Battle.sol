// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "hardhat/console.sol";
//import "../token/TCP.sol";
import "../libraries/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Crypto prophecies Battle contract
 * @notice Battle contract to dictate winners and allow battles
 */
contract Battle is Ownable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    //TCP token
    IERC20 tcp;
    
    //Keep track of deposits
    mapping(address => uint256) public deposits;

    //Keep track of games
    mapping(uint256 => uint256) public gameDeposits;

    constructor(
        IERC20 _tcp
    ) public {
        tcp = _tcp;
    }
    
    function deposit(uint256 _amount) public {
        tcp.safeTransferFrom(address(msg.sender), address(this), _amount);
        deposits[address(msg.sender)] = deposits[address(msg.sender)].add(_amount);
    }
    
    function withdraw(address player) public onlyOwner  {
        require(deposits[player] > 0, "No deposits made");
        tcp.safeTransfer(address(player), deposits[player]); //Subtract fee and send somewhere else
        deposits[player] = 0;
    }
    
    function startGame(uint256 _id, address[] memory players, uint256 _amount) public onlyOwner { //Check if user has enough deposited
        for (uint256 playerID = 0; playerID < players.length; ++playerID) {
            require(deposits[players[playerID]] >= _amount, "Some player(s) do not have enough funds");
            deposits[players[playerID]] = deposits[players[playerID]].sub(_amount);
            gameDeposits[_id] = gameDeposits[_id].add(_amount);
        }
    }

    function endGame(uint256 _id, address winner) public onlyOwner {
        tcp.safeTransfer(address(winner), gameDeposits[_id]); //Subtract fee and send somewhere else
        gameDeposits[_id] = 0;
    }
}