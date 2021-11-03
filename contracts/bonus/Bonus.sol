// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../libraries/ECDSA.sol";
import "../libraries/SafeERC20.sol";

contract Bonus is Ownable {
  using ECDSA for bytes32;
  using SafeERC20 for IERC20;

  enum BonusType {
    SignupBonus,
    ReferralBonus
  }

  event BonusClaimed(
    address indexed user,
    uint256 indexed nonce,
    uint256 amount,
    BonusType bonusType
  );

  IERC20 public btcp;
  address public treasury;
  address public admin;
  mapping(uint256 => bool) public claimed;

  constructor(IERC20 _btcp, address _treasury, address _admin) {
    btcp = _btcp;
    treasury = _treasury;
    admin = _admin;
  }

  function claimBonus(uint256 _nonce, uint256 _amount, uint256 _expiration, BonusType _type, bytes memory _sig) public {
    require(_amount > 0, "no bonus to claim");
    require(_expiration >= block.timestamp, "bonus expired");

    bytes32 txHash = keccak256(abi.encodePacked(address(this), msg.sender, _nonce, _amount, _expiration, _type));
    require(!claimed[_nonce], "already claimed");

    bytes32 ethSignedHash = txHash.toEthSignedMessageHash();
    address signer = ethSignedHash.recover(_sig);
    require(signer == admin, "invalid sig");

    btcp.safeTransferFrom(treasury, msg.sender, _amount);

    claimed[_nonce] = true;

    emit BonusClaimed(msg.sender, _nonce, _amount, _type);
  }

  function updateAdmin(address _admin) public onlyOwner {
    admin = _admin;
  }

  function updateTreasury(address _treasury) public onlyOwner {
    treasury = _treasury;
  }
}
