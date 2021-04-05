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
contract Prophet is ERC1155, Ownable {

    //Keep track of prophetrs
    Counters.Counter public prophetCounter;
    //Keep track of generation
    mapping(uint8 => Counters.Counter) public prophetGenerationCounter;
    //Keep track of prophet per race
    mapping(uint8 => Counters.Counter) public prophetRaceCounter;
    //Keep track of prophet per name per race
    mapping(uint8 => Counters.Counter) public prophetCharacterCounter;
    //Keep track of rarities
    mapping(uint8 => Counters.Counter) public prophetRarityCounter;
    //Keep track of rarities per race
    mapping(uint8 => mapping(uint8 => Counters.Counter)) private prophetRarityPerRaceCounter;

    //Keep track of races
    mapping(uint8 => string) private _prophetRace;
    //Keep track of names
    mapping(string => mapping(uint8 => string)) private _prophetCharacter;
    //Keep track of rarities
    mapping(uint8 => string) private _prophetRarities;
    
    constructor() ERC1155("https://api.cryptoprophecies.com/prophet/{id}.json") {
        //gen > rarity > race > character
        _createInitialProphetTypes();
    }

    function _createInitialProphetTypes() internal {
        _createInitialProphetRaces();
        _createInitialProphetNames();
        _createInitialProphetRarities();
    }

    function _createInitialProphetRaces() internal {
        _prophetRace[0] = "Satoshian";
        _prophetRace[1] = "Linkie";
        _prophetRace[2] = "Liteconian";
    }

    function _createInitialProphetNames() internal { //TODO import on generation creation not on contract creation
        _prophetCharacter["Satoshian"][0] = "Satoshian Name 1";
        _prophetCharacter["Satoshian"][1] = "Satoshian Name 2";
        _prophetCharacter["Satoshian"][2] = "Satoshian Name 3";
        _prophetCharacter["Linkie"][0] = "Linkie Name 1";
        _prophetCharacter["Linkie"][1] = "Linkie Name 1";
        _prophetCharacter["Linkie"][2] = "Linkie Name 2";
        _prophetCharacter["Liteconian"][0] = "Liteconian Name 1";
        _prophetCharacter["Liteconian"][2] = "Liteconian Name 2";
        _prophetCharacter["Liteconian"][3] = "Liteconian Name 3";
    }

    function _createInitialProphetRarities() internal {
        _prophetRarities[0] = "Common";
        _prophetRarities[1] = "Uncommon";
        _prophetRarities[2] = "Rare";
        _prophetRarities[3] = "Epic";
        _prophetRarities[4] = "Legendary";
        _prophetRarities[5] = "Founder";
    }

    function _createProphet(uint8 generation, uint8 rarity, uint8 race, uint8 character) public onlyOwner { //todo maybe only from THIS contract from the orb
        uint256 maxNumberOfIDs = 29; //2^29
        uint256 base = (maxNumberOfIDs*5) + (8*4);
        uint256 id = 1;

        id = (id << 8) + generation;
        id = (id << 8) + rarity;
        id = (id << 8) + race;
        id = (id << 8) + character;
        id = (id << maxNumberOfIDs) + Counters.current(prophetCounter) + 1;
        id = (id << maxNumberOfIDs) + Counters.current(prophetGenerationCounter[generation]) + 1;
        id = (id << maxNumberOfIDs) + Counters.current(prophetRarityCounter[rarity]) + 1;
        id = (id << maxNumberOfIDs) + Counters.current(prophetRaceCounter[race]) + 1;
        id = (id << maxNumberOfIDs) + Counters.current(prophetCharacterCounter[character]) + 1;
        
        _mint(msg.sender, id, 1, "");
        _increaseProphetCounter(uint8(generation), uint8(rarity), uint8(race), uint8(character));
    }

    function _increaseProphetCounter(uint8 generation, uint8 rarity, uint8 race, uint8 character) internal {
        Counters.increment(prophetCounter);
        Counters.increment(prophetGenerationCounter[generation]);
        Counters.increment(prophetRaceCounter[race]);
        Counters.increment(prophetCharacterCounter[character]);
        Counters.increment(prophetRarityCounter[rarity]);
        Counters.increment(prophetRarityPerRaceCounter[race][rarity]);
        // todo add more
    }

}