// SPDX-License-Identifier: MIT
pragma solidity 0.7.0;

import "@openzeppelin/contracts/token/ERC20/ERC20Capped.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CPT is ERC20Capped {

    constructor(uint256 cap_)
        public
        ERC20("Crypto Prophecies Token", "CPT")
        ERC20Capped(cap_)
        {
        _mint(msg.sender, cap_);
    }

}