// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/Address.sol";

import "../libraries/ECDSA.sol";

contract HotWallet is Ownable {
    using Address for address;
    using SafeERC20 for IERC20;
    using ECDSA for bytes32;

    struct WalletInfo {
        uint256 burned;
        uint256 staked;
        uint256 timestamp;
    }

    // bTCP token contract address
    IERC20 public bTCP;

    // Total Burned
    uint256 public totalBurned;

    // Total Staked
    uint256 public totalStaked;

    // Burn address
    address public constant BURN_ADDRESS = 0x000000000000000000000000000000000000dEaD;

    // wallets information for users
    mapping(address => WalletInfo) private _wallets;

    // events
    event AdminTokenRecovery(address tokenRecovered, uint256 amount);

    constructor(IERC20 _bTCP) {
        require(address(_bTCP) != address(0), "Invalid bTCP token address");

        bTCP = _bTCP;
    }

    /**
     * @notice It allows users to burn or deposit into hot wallets
     * @param _amount: the amount user's trying to deposit
     * @param _isBurn: bool value for choosing burn or stake options
     * @dev This function is only callable by admin.
     */
    function deposit(
        uint256 _amount,
        bool _isBurn,
        uint256 _nonce,
        bytes memory _sig
    ) external {
        require(_amount != 0, "Token amount must be bigger than zero");
        bytes32 sigHash = keccak256(
            abi.encodePacked(_nonce, address(this), msg.sender);
        );

        bytes32 ethSignedHash = sigHash.toEthSignedMessageHash();
        address signer = ethSignedHash.recover(_sig);
        require(signer == msg.sender, "Invalid sig");

        WalletInfo storage wallet = _wallets[msg.sender];

        if (_isBurn) {
            bTCP.safeTransferFrom(msg.sender, BURN_ADDRESS, _amount);
            wallet.burned += _amount;
            totalBurned += _amount;
        } else {
            bTCP.safeTransferFrom(msg.sender, address(this), _amount);
            wallet.staked += _amount;
            totalStaked += _amount;
        }

        wallet.timestamp = block.timestamp;
    }

    /**
     * @notice It allows the admin to withdraw bTCP tokens in emergency case
     * @param _to: the address for sending whole bTCP in the contract
     * @dev This function is only callable by admin.
     */
    function emergencyWithdraw(address _to) external onlyOwner {
        uint256 amountToSend = bTCP.balanceOf(address(this));
        bTCP.safeTransfer(_to, amountToSend);
    }

    /**
     * @notice It allows the admin to recover wrong tokens sent to the contract
     * @param _token: the address of the token to withdraw
     * @param _amount: the number of tokens to withdraw
     * @dev This function is only callable by admin.
     */
    function recoverWrongTokens(address _token, uint256 _amount) external onlyOwner {
        require(_token != address(bTCP), "Cannot be bTCP token");

        IERC20(_token).transfer(address(msg.sender), _amount);

        emit AdminTokenRecovery(_token, _amount);
    }
}
