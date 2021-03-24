// SPDX-License-Identifier: MIT
pragma solidity 0.7.4;

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
    //Keep track of prophet per name per race
    mapping(string => mapping(string => Counters.Counter)) private _prophetNameCounter;

    //Keep track of races
    mapping(string => uint256) private _prophetRace;
    //Keep track of names
    mapping(string => mapping(string => uint256)) private _prophetName;
    
    constructor() ERC1155("https://api.cryptoprophecies.com/prophet/{id}.json") {
        _createInitialProphetTypes();
        _createInitialProphetNames();
    }

    function _createInitialProphetTypes() internal {
        _createInitialProphetRaces();
    }

    function _createInitialProphetRaces() internal { //generation
        _prophetRace["Satoshian"] = 0;
        _prophetRace["Linkie"] = 1;
        _prophetRace["Liteconian"] = 2;
    }

    function _createInitialProphetNames() internal { //TODO import on generation creation not on contract creation
        _prophetName["Satoshian"]["Satoshian Name 1"] = 0;
        _prophetName["Satoshian"]["Satoshian Name 2"] = 1;
        _prophetName["Satoshian"]["Satoshian Name 3"] = 2;
        _prophetName["Linkie"]["Linkie Name 1"] = 0;
        _prophetName["Linkie"]["Linkie Name 2"] = 1;
        _prophetName["Linkie"]["Linkie Name 3"] = 2;
        _prophetName["Liteconian"]["Liteconian Name 1"] = 0;
        _prophetName["Liteconian"]["Liteconian Name 2"] = 1;
        _prophetName["Liteconian"]["Liteconian Name 3"] = 2;
    }

    function _createProphets(string memory race, string memory name, uint256 amount) internal {
        //_mint(msg.sender, prophetRace["Linkie"], 10**18, "");
        //_mint(msg.sender, _prophetRace["Satoshian"], 1, "");
        _mint(msg.sender, _prophetRace[race], amount, "");
        _increaseProphetCounter(race, name);
    }

    function _increaseProphetCounter(string memory race, string memory name) internal {
        Counters.increment(_prophetRaceCounter[race]);
        Counters.increment(_prophetNameCounter[race][name]);
    }

}