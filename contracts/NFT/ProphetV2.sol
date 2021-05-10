// SPDX-License-Identifier: MIT
pragma solidity 0.7.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721Burnable.sol";
import "@openzeppelin/contracts/presets/ERC1155PresetMinterPauser.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./ProphetV2Storage.sol";

/**
 * @title Crypto prophecies Prophet NFTs
 * @notice NFTs that will be held by users
 */
contract ProphetV2 is ProphetV2Storage, ERC721, ERC721Burnable, Ownable {

    modifier prophetOwner(uint256 tokenId) {
        require(ERC721.ownerOf(tokenId) == msg.sender, "ERC721: burn of token that is not own");
        _;
    }

    constructor(string memory uri) ERC721("Crypto Prophecies Prophets", "Prophet") {
        //gen > rarity > race > character
        _setBaseURI(uri);
        _createInitialProphetTypes();
    }

    function _createInitialProphetTypes() internal {
        _createInitialProphetRaces();
        _createInitialProphetNames();
        _createInitialProphetRarities();
    }

    function _createInitialProphetRaces() internal {
        addRace("Satoshian");
        addRace("Linkie");
        addRace("Liteconian");
    }

    function _createInitialProphetNames() internal { //TODO import on generation creation not on contract creation
        addName(0, "Satoshian Name 1");
        addName(0, "Satoshian Name 2");
        addName(0, "Satoshian Name 3");
        addName(1, "Linkie Name 1");
        addName(1, "Linkie Name 2");
        addName(1, "Linkie Name 3");
        addName(2, "Liteconian Name 1");
        addName(2, "Liteconian Name 2");
        addName(2, "Liteconian Name 3");
    }

    function _createInitialProphetRarities() internal {
        addRarity("Common");
        addRarity("Uncommon");
        addRarity("Rare");
        addRarity("Epic");
        addRarity("Legendary");
        addRarity("Founder");
    }

    function addRace(string memory _race) public {
        prophetRace.push(_race);
    }

    function addName(uint16 race, string memory _name) public {
        prophetCharacter[race].push(_name);
    }

    function addRarity(string memory _rarity) public {
        prophetRarities.push(_rarity);
    }

    function _createProphet(uint16 generation, uint16 rarity, uint16 race, uint16 character, address destination) public onlyOwner { //TODO only from THIS contract or from the orb
        uint256 id = Counters.current(prophetCounter) + 1;
        _mint(destination, id);
        _increaseProphetCounter(uint16(generation), uint16(rarity), uint16(race), uint16(character));
        _storeProphetData(id, uint16(generation), uint16(rarity), uint16(race), uint16(character));
    }

    function _storeProphetData(uint256 id, uint16 generation, uint16 rarity, uint16 race, uint16 character) internal {
        prophetData[id] = Prophet(generation, rarity, race, character,
            Counters.current(prophetCounter),
            Counters.current(prophetGenerationCounter[generation]),
            Counters.current(prophetRaceCounter[race]),
            Counters.current(prophetCharacterCounter[character]),
            Counters.current(prophetRarityCounter[rarity]),
            Counters.current(prophetRarityPerRaceCounter[race][rarity]));
    }

    function _increaseProphetCounter(uint16 generation, uint16 rarity, uint16 race, uint16 character) internal {
        Counters.increment(prophetCounter);
        Counters.increment(prophetGenerationCounter[generation]);
        Counters.increment(prophetRaceCounter[race]);
        Counters.increment(prophetCharacterCounter[character]);
        Counters.increment(prophetRarityCounter[rarity]);
        Counters.increment(prophetRarityPerRaceCounter[race][rarity]);
    }

    function burnProphet(uint256 tokenId) prophetOwner(tokenId) public {
        _burn(tokenId);
    }

    function burnProphets(uint256[] memory tokenIds) public {
        for (uint i = 0; i < tokenIds.length; i++) {
            burnProphet(tokenIds[i]);
        }
    }

    function getProphet(uint256 id) external view returns(uint16 generation, uint16 rarity, uint16 race, uint16 character,
        uint256 prophetCounter, uint256 generationCounter, uint256 raceCounter, uint256 characterCounter, uint256 rarityCounter,
        uint256 rarityPerRaceCounter) {
        generation = prophetData[id].generation;
        rarity = prophetData[id].rarity;
        race = prophetData[id].race;
        character = prophetData[id].character;
        prophetCounter = prophetData[id].prophetCounter;
        generationCounter = prophetData[id].generationCounter;
        raceCounter = prophetData[id].raceCounter;
        characterCounter = prophetData[id].characterCounter;
        rarityCounter = prophetData[id].rarityCounter;
        rarityPerRaceCounter = prophetData[id].rarityPerRaceCounter;
    }
    
}