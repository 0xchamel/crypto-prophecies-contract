// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

/**
 * @dev Interface of the Orb contract.
 */
interface IOrb {
    /**
     * @dev Returns the amount of tokens of token type `id` owned by `account`.
     *
     * Requirements:
     *
     * - `account` cannot be the zero address.
     */
    function balanceOf(address account, uint256 id) external view returns (uint256);

    /**
     * @dev Returns the orb data.
     */
    function orbs(uint256 orbId) external view returns (uint8, uint8, uint16);

    /**
     * @dev Returns the rarity probabilities.
     */
    function rarities(uint8 rarity) external view returns (uint16, uint16, uint16, uint16, uint16);

    /**
     * @dev Burns orb item.
     */
    function burn(address account, uint256 id, uint256 amount) external;
}
