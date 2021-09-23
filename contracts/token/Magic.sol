// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Magic is ERC20Burnable, Ownable {
    using SafeERC20 for ERC20;

    event SetMinter(address indexed, bool);

    mapping(address => bool) private _minters;

    modifier onlyMinter() {
        require(_minters[_msgSender()], "msg.sender should be minter");
        _;
    }

    constructor(address _addr, uint256 _cap)
        public
        ERC20("Magic Token", "MT")
    {
        _mint(_addr, _cap);
        _minters[_addr] = true;
    }

    function setMinter(address _user, bool _isMinter) public onlyOwner {
        _minters[_user] = _isMinter;
        emit SetMinter(_user, _isMinter);
    }

    function mint(address _to, uint256 _amount) public onlyMinter {
        _mint(_to, _amount);
    }
}
