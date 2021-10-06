// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BTCP is ERC20Burnable, Ownable {
    mapping(address => bool) private _allowSpend;

    constructor(address _to, uint256 _cap)
        public
        ERC20("The Crypto Prophecies", "BTCP")
    {
        _allowSpend[msg.sender] = true;
        _mint(_to, _cap);
    }

    function allowSpend(address _addr) public onlyOwner {
        _allowSpend[_addr] = true;
    }

    function disallowSpend(address _addr) public onlyOwner {
        _allowSpend[_addr] = false;
    }

    function _beforeTokenTransfer(
        address from,
        address,
        uint256
    ) internal override {
        require(_allowSpend[msg.sender], "spender not allowed");
    }
}
