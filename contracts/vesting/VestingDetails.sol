// SPDX-License-Identifier: MIT
pragma solidity 0.7.4;

import "./VestingStorage.sol";

contract VestingDetails is VestingStorage, Ownable {

  function isPaused(uint256 id) public view returns (bool) {
    return investors[id].paused;
  }

  function getCliff(uint256 id) public view returns (uint256) {
    return investors[id].cliff;
  }

}