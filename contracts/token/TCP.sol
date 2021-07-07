// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TCP is ERC20Capped, Ownable {
    uint256 toMint;

    constructor(uint256 cap_)
        public
        ERC20("The Crypto Prophecies", "TCP")
        ERC20Capped(cap_)
    {
        toMint = cap_;
    }

    function mint() public onlyOwner {
        _mint(msg.sender, toMint);
    }
}
