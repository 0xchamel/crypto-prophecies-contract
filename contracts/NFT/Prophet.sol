// SPDX-License-Identifier: MIT
pragma solidity 0.7.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/presets/ERC1155PresetMinterPauser.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title Crypto prophecies Prophet NFTs
 * @notice NFTs that will be held by users
 */
contract Prophet is ERC1155 {
    
    //Keep track of prophet per race
    mapping(string => Counters.Counter) private _prophetRaceCounter;

    //Keep track of races
    mapping(string => uint256) private _prophetRace;
    
    constructor() ERC1155("https://app.cryptoprophecies.com/api/prophet/{id}.json") {
        _createInitialProphetTypes();
    }

    function _createInitialProphetTypes() internal {
        _prophetRace["Satoshian"] = 0;
        _prophetRace["Linkie"] = 1;
        _prophetRace["Liteconian"] = 2;
    }

    function _createProphet(string memory race) internal {
        //_mint(msg.sender, prophetRace["Linkie"], 10**18, "");
        _mint(msg.sender, _prophetRace["Satoshian"], 1, "");
        _increaseRaceCounter(race);
    }

    function _increaseRaceCounter(string memory race) internal {
        Counters.increment(_prophetRaceCounter[race]);
    }

}