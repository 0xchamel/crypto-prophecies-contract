// SPDX-License-Identifier: MIT
pragma solidity 0.7.4;
pragma experimental ABIEncoderV2;

import "./VestingDetails.sol";

contract TokenVesting is VestingDetails {
  using SafeMath for uint256;

  constructor(
    VestingInfo[] memory _investors,
    address _token
  ) 
  public
  {
    for (uint i=0; i<_investors.length; i++) {
        investors[i] = _investors[i];
    }
    token = ERC20(_token);
  }

  function pauseVesting(uint256 id) public {
    investors[id].paused = true;
  }
}