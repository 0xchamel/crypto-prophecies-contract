// SPDX-License-Identifier: MIT
pragma solidity 0.7.4;
pragma experimental ABIEncoderV2;

import "./VestingStorage.sol";

contract VestingDetails is VestingStorage, Ownable {

  modifier onlyBeneficiary(uint256 id) {
    require(msg.sender == getBeneficiary(id), "Only the beneficiary can interact with this function");
    _;
  }

  function getInvestor(uint256 id) public view returns (VestingInfo memory) {
    return investors[id];
  }

  function getBeneficiary(uint256 id) public view returns (address) {
    return getInvestor(id).beneficiary;
  }

  function getCliff(uint256 id) public view returns (uint256) {
    return getInvestor(id).cliff;
  }

  function getStart(uint256 id) public view returns (uint256) {
    return getInvestor(id).start;
  }

  function getTotalAmount(uint256 id) public view returns (uint256) {
    return getInvestor(id).totalAmount;
  }

  function getNumberOfMonths(uint256 id) public view returns (uint256) {
    return getInvestor(id).numberOfMonths;
  }

  function getTotalClaimed(uint256 id) public view returns (uint256) {
    return getInvestor(id).totalClaimed;
  }

  function getInitialUnlock(uint256 id) public view returns (uint256) {
    return getInvestor(id).initialUnlock;
  }

  function isPaused(uint256 id) public view returns (bool) {
    return getInvestor(id).paused;
  }

  function vestedAmount(uint256 id) public view returns (uint256) {
    uint256 amount;
    amount = amount + getInitialUnlock(id);
    if (block.timestamp < getInvestor(id).cliff) { //vesting has not started
      amount = 0;
    } else {
      uint256 monthsPassed = ((block.timestamp - getInvestor(id).start) / month) - ((block.timestamp - getInvestor(id).start) % month); // get a flat month
      uint256 monthlyVesting = getTotalAmount(id) / getNumberOfMonths(id);
      amount = monthsPassed * monthlyVesting;
    }
    amount = amount - getTotalClaimed(id); //adjust by how much has already been claimed
    return amount;
  }

  function claimAmount(uint256 id, uint256 amount) internal {
    investors[id].totalClaimed = investors[id].totalClaimed + amount;
  }
}