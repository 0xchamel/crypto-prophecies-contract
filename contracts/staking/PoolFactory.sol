// SPDX-License-Identifier: MIT

pragma solidity 0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "./Pool.sol";
import "./../libraries/IERC20.sol";

contract PoolFactory is Ownable {
    event NewPoolContract(address indexed pool);

    constructor() public {
        //
    }

    /*
     * @notice Deploy the pool
     * @param _stakedToken: staked token address
     * @param _rewardToken: reward token address
     * @param _rewardPerBlock: reward per block (in rewardToken)
     * @param _startBlock: start block
     * @param _endBlock: end block
     * @param _admin: admin address with ownership
     * @return address of new pool contract
     */
    function deployPool(
        IERC20 _stakedToken,
        IERC20 _rewardToken,
        address _rewardHolder,
        uint256 _rewardPerBlock,
        uint256 _startBlock,
        uint256 _bonusEndBlock,
        address _admin
    ) external onlyOwner {
        require(_stakedToken.totalSupply() >= 0);
        require(_rewardToken.totalSupply() >= 0);
        require(_stakedToken != _rewardToken, "Tokens must be be different");
        require(
            _bonusEndBlock > _startBlock,
            "BonusEndBlock number must be bigger than StartBlock number"
        );

        bytes memory bytecode = type(PoolInitializable).creationCode;
        bytes32 salt = keccak256(
            abi.encodePacked(_stakedToken, _rewardToken, _startBlock)
        );
        address poolAddress;

        assembly {
            poolAddress := create2(0, add(bytecode, 32), mload(bytecode), salt)
        }

        PoolInitializable(poolAddress).initialize(
            _stakedToken,
            _rewardToken,
            _rewardHolder,
            _rewardPerBlock,
            _startBlock,
            _bonusEndBlock,
            _admin
        );

        emit NewPoolContract(poolAddress);
    }

    /*
     * @notice Get pool address
     * @param _stakedToken: staked token address
     * @param _rewardToken: reward token address
     * @param _startBlock: start block
     * @return address of precomputed pool contract address
     */
    function getPoolAddress(
        IERC20 _stakedToken,
        IERC20 _rewardToken,
        uint256 _startBlock
    ) public view returns (address) {
        bytes memory bytecode = type(PoolInitializable).creationCode;
        bytes32 salt = keccak256(
            abi.encodePacked(_stakedToken, _rewardToken, _startBlock)
        );

        bytes32 hash = keccak256(
            abi.encodePacked(
                bytes1(0xff),
                address(this),
                salt,
                keccak256(bytecode)
            )
        );

        return address(uint160(uint256(hash)));
    }
}
