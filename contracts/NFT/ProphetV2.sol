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
        prophetRace[0] = "Satoshian";
        prophetRace[1] = "Linkie";
        prophetRace[2] = "Liteconian";
    }

    function _createInitialProphetNames() internal { //TODO import on generation creation not on contract creation
        prophetCharacter[0][0] = "Satoshian Name 1";
        prophetCharacter[0][1] = "Satoshian Name 2";
        prophetCharacter[0][2] = "Satoshian Name 3";
        prophetCharacter[1][0] = "Linkie Name 1";
        prophetCharacter[1][1] = "Linkie Name 1";
        prophetCharacter[1][2] = "Linkie Name 2";
        prophetCharacter[2][0] = "Liteconian Name 1";
        prophetCharacter[2][2] = "Liteconian Name 2";
        prophetCharacter[2][3] = "Liteconian Name 3";
    }

    function _createInitialProphetRarities() internal {
        prophetRarities[0] = "Common";
        prophetRarities[1] = "Uncommon";
        prophetRarities[2] = "Rare";
        prophetRarities[3] = "Epic";
        prophetRarities[4] = "Legendary";
        prophetRarities[5] = "Founder";
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
    }

    function _increaseProphetCounter(uint16 generation, uint16 rarity, uint16 race, uint16 character) internal {
        Counters.increment(prophetCounter);
        Counters.increment(prophetGenerationCounter[generation]);
        Counters.increment(prophetRaceCounter[race]);
        Counters.increment(prophetCharacterCounter[character]);
        Counters.increment(prophetRarityCounter[rarity]);
        Counters.increment(prophetRarityPerRaceCounter[race][rarity]);
        // todo add more
    }

}