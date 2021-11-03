// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

interface IDailyPrize {
    function addTickets(address _player, uint256 _tickets) external;

    function addPrize(uint256 _prize) external;
}
