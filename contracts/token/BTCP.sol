// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BTCP is ERC20Burnable, Ownable {
    event AllowSpend(address addr);
    event DisallowSpend(address addr);
    event MinterAdded(address minter);
    event MinterRemoved(address minter);

    mapping(address => bool) private _allowSpend;
    mapping(address => bool) private _isMinter;
    bool private _isMinting;

    modifier onlyMinter() {
        require(_isMinter[msg.sender], "only minters can call this function");
        _;
    }

    modifier minting() {
        _isMinting = true;
        _;
        _isMinting = false;
    }

    constructor(address _to, uint256 _cap)
        public
        ERC20("The Crypto Prophecies", "bTCP")
    {
        _allowSpend[msg.sender] = true;
        _isMinter[msg.sender] = true;

        _mint(_to, _cap);
    }

    function mint(address _to, uint256 _amount) public onlyMinter minting {
        _mint(_to, _amount);
    }

    function addMinter(address _addr) public onlyOwner {
        require(!_isMinter[_addr], "user is already minter");
        _isMinter[_addr] = true;

        emit MinterAdded(_addr);
    }

    function removeMinter(address _addr) public onlyOwner {
        require(_isMinter[_addr], "user is not minter");
        _isMinter[_addr] = false;

        emit MinterRemoved(_addr);
    }

    function allowSpend(address _addr) public onlyOwner {
        _allowSpend[_addr] = true;

        emit AllowSpend(_addr);
    }

    function disallowSpend(address _addr) public onlyOwner {
        _allowSpend[_addr] = false;

        emit DisallowSpend(_addr);
    }

    function _beforeTokenTransfer(
        address,
        address,
        uint256
    ) internal override {
        require(_isMinting || _allowSpend[msg.sender], "spender not allowed");
    }
}
