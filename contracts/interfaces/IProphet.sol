// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface INFT {
    function burn(uint256) external;

    function ownerOf(uint256) external view returns (address);
}

interface IProphet is INFT {
    function mint(
        address,
        uint16,
        uint16,
        uint16,
        uint16
    ) external returns (uint256);

    function prophets(uint256)
        external
        view
        returns (
            uint16,
            uint16,
            uint16,
            uint16,
            uint256,
            uint256
        );
}
