// SPDX-License-Identifier: MIT
pragma solidity 0.7.4;

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
    
    function startGame(uint256 _id, address[] memory players, uint256 _amount) public onlyOwner {
        for (uint256 playerID = 0; playerID < players.length; ++playerID) {
            deposits[players[playerID]] = deposits[players[playerID]].sub(_amount);
            gameDeposits[_id] = gameDeposits[_id].add(_amount);
        }
    }

    function endGame(uint256 _id, address winner) public onlyOwner {
        tcp.safeTransfer(address(msg.sender), gameDeposits[_id]); //Subtract fee and send somewhere else
        gameDeposits[_id] = 0;
    }
}