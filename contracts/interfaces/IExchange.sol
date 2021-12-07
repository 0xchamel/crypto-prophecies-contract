// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

interface IExchange {
    // swap function from bTCP to TCP
    function swap(uint256 _bTCPAmount) external;
}
