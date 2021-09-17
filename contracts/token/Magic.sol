// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Magic is ERC20Burnable, Ownable {
    constructor(uint256 _cap)
        public
        ERC20("Magic Token", "MT")
    {
        _mint(msg.sender, _cap);
    }
}
