// SPDX-License-Identifier: MIT
pragma solidity 0.7.4;

import "./VestingStorage.sol";

contract VestingDetails is VestingStorage, Ownable {

  function getBeneficiary(uint256 id) public view returns (address) {
    return investors[id].beneficiary;
  }

  function getCliff(uint256 id) public view returns (uint256) {
    return investors[id].cliff;
  }

  function getStart(uint256 id) public view returns (uint256) {
    return investors[id].start;
  }

  function getDuration(uint256 id) public view returns (uint256) {
    return investors[id].duration;
  }

  function isPaused(uint256 id) public view returns (bool) {
    return investors[id].paused;
  }

}