// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

interface IBTCPToken is IERC20 {
    function burn(uint256 amount) external;

    function burnFrom(address account, uint256 amount) external;
}

contract Exchange is Ownable, ReentrancyGuard {
    using Address for address;
    using SafeERC20 for IERC20;

    // bTCP token contract handler
    IBTCPToken public bTCP;

    // TCP token contract handler
    IERC20 public TCP;

    // Pausable variable
    bool public isPaused;

    // TCP Holder wallet
    address public holderAddress;

    // bTCP token burn address
    address public BURN_ADDRESS = 0x000000000000000000000000000000000000dEaD;

    modifier whenNotPaused() {
        require(!isPaused, "already paused");
        _;
    }

    event bTCPBurned(address indexed account, uint256 amount);

    constructor(address _bTCP, address _TCP) {
        require(_bTCP != address(0), "Invalid token address");
        require(_TCP != address(0), "Invalid token address");
        require(_TCP != _bTCP, "Wrong token addresses");

        TCP = IERC20(_TCP);
        bTCP = IBTCPToken(_bTCP);
    }

    function swap(uint256 _bTCPAmount) external nonReentrant whenNotPaused {
        require(_bTCPAmount != 0, "bTCP amount must be bigger than zero");
        require(
            TCP.balanceOf(holderAddress) >= _bTCPAmount,
            "Not enough TCP token in holder address"
        );
        require(
            bTCP.balanceOf(msg.sender) >= _bTCPAmount,
            "Not enough bTCP token in user's wallet"
        );

        IBTCPToken(bTCP).burnFrom(msg.sender, _bTCPAmount);
        IERC20(TCP).safeTransferFrom(holderAddress, msg.sender, _bTCPAmount);

        emit bTCPBurned(msg.sender, _bTCPAmount);
    }

    ///////////
    // Admin //
    ///////////

    function toggleIsPaused() external onlyOwner {
        isPaused = !isPaused;
    }

    function updateHolderAddress(address _account) external onlyOwner {
        require(_account != address(0), "Invalid address");
        holderAddress = _account;
    }

    function reclaimERC20(address _tokenContract) external onlyOwner {
        require(_tokenContract != address(TCP), "Invalid address");
        require(_tokenContract != address(bTCP), "Invalid address");
        IERC20 token = IERC20(_tokenContract);
        uint256 balance = token.balanceOf(address(this));

        token.safeTransfer(_msgSender(), balance);
    }
}
