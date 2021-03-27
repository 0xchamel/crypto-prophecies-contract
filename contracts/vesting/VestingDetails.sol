// SPDX-License-Identifier: MIT
pragma solidity 0.7.4;
pragma experimental ABIEncoderV2;

import "./VestingStorage.sol";

contract VestingDetails is VestingStorage, Ownable {

  function getInvestorID(address _address) public view returns (uint256) {
    return investorIds[_address];
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

  function getMonthsPassed(uint256 id) public view returns (uint256) {
    return ((block.timestamp - (getStart(id)+getCliff(id))) / month);
  }

  function getMonthlyVesting(uint256 id) public view returns (uint256) {
    return getTotalAmount(id) / getNumberOfMonths(id);
  }

  function isFinishedVesting(uint256 id) public view returns (bool) {
    return (getTotalClaimed(id) - getInitialUnlock(id)) >= getTotalClaimed(id);
  }

  function vestedAmount(uint256 id) public view returns (uint256) {
    uint256 amount;
    if (block.timestamp < getStart(id) + getCliff(id)) { //vesting has not started
      amount = 0;
    } else {
      amount += getInitialUnlock(id);
      amount += getMonthsPassed(id) * getMonthlyVesting(id);
      amount = amount - getTotalClaimed(id); //adjust by how much has already been claimed
      if (amount + getTotalClaimed(id) - getInitialUnlock(id) > getTotalAmount(id)) { //cannot claim more than total
        amount = getTotalAmount(id) - (getTotalClaimed(id) - getInitialUnlock(id));
      }
    }
    return amount;
  }

  function claimAmount(uint256 id, uint256 amount) internal {
    investors[id].totalClaimed = investors[id].totalClaimed + amount;
  }
}