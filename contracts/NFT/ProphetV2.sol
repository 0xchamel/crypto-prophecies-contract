// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./ProphetV2Storage.sol";

/**
 * @title Crypto prophecies Prophet NFTs
 * @notice NFTs that will be held by users
 */
contract ProphetV2 is ProphetV2Storage, ERC721Enumerable, Ownable {

    modifier prophetOwner(uint256 tokenId) {
        require(ERC721.ownerOf(tokenId) == msg.sender, "ERC721: burn of token that is not own");
        _;
    }

    constructor() ERC721("Crypto Prophecies Prophets", "Prophet") {
        //gen > rarity > race > character
        _createInitialProphetTypes();
    }

    function _createInitialProphetTypes() internal {
        _createInitialProphetRaces();
        _createInitialProphetNames();
        _createInitialProphetRarities();
    }

    function _createInitialProphetRaces() internal {
        addRace("Etherian");
        addRace("Satoshian");
        addRace("Tezmanian");
        addRace("Reptilian");
    }

    function _createInitialProphetNames() internal { //TODO import on generation creation not on contract creation
        addName(0, "Etherian 1");
        addName(0, "Etherian 2");
        addName(0, "Etherian 3");
        addName(0, "Etherian 4");
        addName(0, "Etherian 5");
        addName(0, "Etherian 6");
        addName(1, "Satoshian 1");
        addName(1, "Satoshian 2");
        addName(1, "Satoshian 3");
        addName(1, "Satoshian 4");
        addName(1, "Satoshian 5");
        addName(1, "Satoshian 6");
        addName(2, "Tezmanian 1");
        addName(2, "Tezmanian 2");
        addName(2, "Tezmanian 3");
        addName(2, "Tezmanian 4");
        addName(2, "Tezmanian 5");
        addName(2, "Tezmanian 6");
        addName(3, "Reptilian 1");
        addName(3, "Reptilian 2");
        addName(3, "Reptilian 3");
        addName(3, "Reptilian 4");
        addName(3, "Reptilian 5");
        addName(3, "Reptilian 6");
    }

    function _createInitialProphetRarities() internal {
        addRarity("Common");
        addRarity("Uncommon");
        addRarity("Rare");
        addRarity("Epic");
        addRarity("Legendary");
        addRarity("Founder");
    }

    function addRace(string memory _race) public onlyOwner {
        prophetRace.push(_race);
    }

    function addName(uint16 race, string memory _name) public onlyOwner {
        prophetCharacter[race].push(_name);
    }

    function addRarity(string memory _rarity) public onlyOwner {
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
            Counters.current(prophetRarityPerRaceCounter[race][rarity])
        );
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

    function getProphet(uint256 id) public view returns(uint256[] memory) {
        uint256[] memory values = new uint256[](10);
        values[0] = prophetData[id].generation;
        values[1] = prophetData[id].rarity;
        values[2] = prophetData[id].race;
        values[3] = prophetData[id].character;
        values[4] = prophetData[id].prophetCounter;
        values[5] = prophetData[id].generationCounter;
        values[6] = prophetData[id].raceCounter;
        values[7] = prophetData[id].characterCounter;
        values[8] = prophetData[id].rarityCounter;
        values[9] = prophetData[id].rarityPerRaceCounter;
        return values;
    }

    function getProphetIDsByOwner(address _owner) public view returns(uint256[] memory) {
        uint256 nfts = balanceOf(_owner);
        uint256[] memory ids = new uint256[](nfts);
        for (uint256 i = 0; i < nfts; i++) {
            ids[i] = tokenOfOwnerByIndex(_owner, i);
        }
        return ids;
    }

    function getProphetInfoByOwner(address _owner) public view returns(uint256[][] memory) {
        uint256 nfts = balanceOf(_owner);
        uint256[][] memory info = new uint256[][](nfts);
        for (uint256 i = 0; i < nfts; i++) {
            uint256 id = tokenOfOwnerByIndex(_owner, i);
            info[i] = getProphet(id);
        }
        return info;
    }
    
    function _baseURI() internal view override returns (string memory) {
        return "https://api.cryptoprophecies.com/v1/prophet/{id}";
    }
    
}