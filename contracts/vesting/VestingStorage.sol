// SPDX-License-Identifier: MIT
pragma solidity 0.7.4;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract VestingStorage {

  event Released(uint256 amount, address beneficiary);
  event Revoked(address beneficiary);

  struct VestingInfo {
      address beneficiary;
      uint256 cliff;
      uint256 start;
      uint256 totalAmount; //after initial unlock
      uint256 totalClaimed;
      uint256 initialUnlock;
      uint256 numberOfMonths;
      bool paused;
  }
  
  VestingInfo[] public investors;

  uint256 public released;

  ERC20 public token;

  uint256 month = 30*24*60*60; // 30 days in seconds

}