// // SPDX-License-Identifier: MIT
// pragma solidity 0.8.0;

// import "hardhat/console.sol";
// import "@openzeppelin/contracts/token/ERC1155/extensions/ERC721Enumerable.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";
// import "./ProphetV2Storage.sol";

// /**
//  * @title Crypto prophecies Prophet Item NFTs
//  * @notice NFTs that will be held by users
//  */
// contract ProphetItems is ERC721Enumerable, Ownable {
    
//     modifier prophetOwner(uint256 tokenId) {
//         require(ERC721.ownerOf(tokenId) == msg.sender, "ERC721: burn of token that is not own");
//         _;
//     }

//     modifier noContractCalls() {
//         require(tx.origin == msg.sender, "No Contract Calls!");
//         _;
//     }

//     constructor() ERC721("Crypto Prophecies Prophets", "Prophet") {
//         //gen > rarity > race > character
//         _createInitialProphetTypes();
//         maxRarity = 4;
//     }

//     function _createInitialProphetTypes() internal {
//         _createInitialProphetRaces();
//         _createInitialProphetNames();
//         _createInitialProphetRarities();
//     }

//     function addRace(string memory _race) public onlyOwner {
//         prophetRace.push(_race);
//     }

//     function addName(uint16 race, string memory _name) public onlyOwner {
//         prophetCharacter[race].push(_name);
//     }

//     function addRarity(string memory _rarity) public onlyOwner {
//         prophetRarities.push(_rarity);
//     }

//     function createProphet(uint16 generation, uint16 rarity, uint16 race, uint16 character, address destination) public onlyOwner { //TODO only from the orb
//         _createProphet(generation, rarity, race, character, destination);
//     }

//     function _createProphet(uint16 generation, uint16 rarity, uint16 race, uint16 character, address destination) internal {
//         uint256 id = Counters.current(prophetCounter) + 1;
//         _mint(destination, id);
//         _increaseProphetCounter(uint16(generation), uint16(rarity), uint16(race), uint16(character));
//         _storeProphetData(id, uint16(generation), uint16(rarity), uint16(race), uint16(character));
//     }

//     function _storeProphetData(uint256 id, uint16 generation, uint16 rarity, uint16 race, uint16 character) internal {
//         prophetData[id] = Prophet(generation, rarity, race, character,
//             Counters.current(prophetCounter),
//             Counters.current(prophetGenerationCounter[generation]),
//             Counters.current(prophetRaceCounter[race]),
//             Counters.current(prophetCharacterCounter[character]),
//             Counters.current(prophetRarityCounter[rarity]),
//             Counters.current(prophetRarityPerRaceCounter[race][rarity])
//         );
//     }

//     function _increaseProphetCounter(uint16 generation, uint16 rarity, uint16 race, uint16 character) internal {
//         Counters.increment(prophetCounter);
//         Counters.increment(prophetGenerationCounter[generation]);
//         Counters.increment(prophetRaceCounter[race]);
//         Counters.increment(prophetCharacterCounter[character]);
//         Counters.increment(prophetRarityCounter[rarity]);
//         Counters.increment(prophetRarityPerRaceCounter[race][rarity]);
//     }

//     function _decreaseProphetCounter(uint16 generation, uint16 rarity, uint16 race, uint16 character) internal {
//         Counters.decrement(prophetCounter);
//         Counters.decrement(prophetGenerationCounter[generation]);
//         Counters.decrement(prophetRaceCounter[race]);
//         Counters.decrement(prophetCharacterCounter[character]);
//         Counters.decrement(prophetRarityCounter[rarity]);
//         Counters.decrement(prophetRarityPerRaceCounter[race][rarity]);
//     }

//     function burnUpgrade(uint256[] memory tokenIds) public noContractCalls { //noContractCalls only required for pseudo rng
//         uint16 generation = prophetData[tokenIds[0]].generation;
//         uint16 rarity = prophetData[tokenIds[0]].rarity;
//         uint16 race = prophetData[tokenIds[0]].race;
//         uint16 character = prophetData[tokenIds[0]].character;
//         require(rarity+1 <= maxRarity, "Max rarity achieved");
//         for (uint i = 0; i < tokenIds.length; i++) {
//             uint256 tokenId = tokenIds[tokenIds[i]];
//             require(prophetData[tokenId].generation == generation, "Generations do not match");
//             require(prophetData[tokenId].rarity == rarity, "Rarities do not match");
//             require(prophetData[tokenId].race == race, "Races do not match");
//             require(prophetData[tokenId].character == character, "Characters do not match");
//         }
//         burnProphets(tokenIds);
//         character = uint16(_getRandomNumber(prophetCharacter[race].length));
//         _createProphet(generation, rarity, race, character, msg.sender);
//     }

//     function burnProphets(uint256[] memory tokenIds) public {
//         for (uint i = 0; i < tokenIds.length; i++) {
//             burnProphet(tokenIds[i]);
//         }
//     }

//     function burnProphet(uint256 tokenId) prophetOwner(tokenId) public {
//         _burn(tokenId);
//         _decreaseProphetCounter(
//             prophetData[tokenId].generation, 
//             prophetData[tokenId].rarity, 
//             prophetData[tokenId].race, 
//             prophetData[tokenId].character
//         );
//     }

//     function getProphet(uint256 id) public view returns(uint256[] memory) {
//         uint256[] memory values = new uint256[](10);
//         values[0] = prophetData[id].generation;
//         values[1] = prophetData[id].rarity;
//         values[2] = prophetData[id].race;
//         values[3] = prophetData[id].character;
//         values[4] = prophetData[id].prophetCounter;
//         values[5] = prophetData[id].generationCounter;
//         values[6] = prophetData[id].raceCounter;
//         values[7] = prophetData[id].characterCounter;
//         values[8] = prophetData[id].rarityCounter;
//         values[9] = prophetData[id].rarityPerRaceCounter;
//         return values;
//     }

//     function getProphetIDsByOwner(address _owner) public view returns(uint256[] memory) {
//         uint256 nfts = balanceOf(_owner);
//         uint256[] memory ids = new uint256[](nfts);
//         for (uint256 i = 0; i < nfts; i++) {
//             ids[i] = tokenOfOwnerByIndex(_owner, i);
//         }
//         return ids;
//     }

//     function getProphetInfoByOwner(address _owner) public view returns(uint256[][] memory) {
//         uint256 nfts = balanceOf(_owner);
//         uint256[][] memory info = new uint256[][](nfts);
//         for (uint256 i = 0; i < nfts; i++) {
//             uint256 id = tokenOfOwnerByIndex(_owner, i);
//             info[i] = getProphet(id);
//         }
//         return info;
//     }
    
//     function _baseURI() internal pure override returns (string memory) {
//         return "https://api.cryptoprophecies.com/v1/prophet/{id}";
//     }

//     function _getRandomNumber(uint _upper) private returns (uint) {
//         uint _seed = uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, block.number)));
//         return _seed % _upper;
//     }

//     function setMaxRarity(uint16 _maxRarity) public onlyOwner{
//         maxRarity = _maxRarity;
//     }
    
    
// }