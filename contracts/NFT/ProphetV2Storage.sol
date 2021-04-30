// SPDX-License-Identifier: MIT
pragma solidity 0.7.4;

import "@openzeppelin/contracts/utils/Counters.sol";

contract ProphetV2Storage {
    
    struct Prophet {
         uint16 generation;
         uint16 rarity;
         uint16 race;
         uint16 character;
        // Counters.current(prophetCounter);
        // Counters.current(prophetGenerationCounter[generation]);
        // Counters.current(prophetRaceCounter[race]);
        // Counters.current(prophetCharacterCounter[character]);
        // Counters.current(prophetRarityCounter[rarity]);
        // Counters.current(prophetRarityPerRaceCounter[race][rarity]);
    }

    //Keep track of prophetrs
    Counters.Counter public prophetCounter;
    //Keep track of generation
    mapping(uint16 => Counters.Counter) public prophetGenerationCounter;
    //Keep track of prophet per race
    mapping(uint16 => Counters.Counter) public prophetRaceCounter;
    //Keep track of prophet per name per race
    mapping(uint16 => Counters.Counter) public prophetCharacterCounter;
    //Keep track of rarities
    mapping(uint16 => Counters.Counter) public prophetRarityCounter;
    //Keep track of rarities per race
    mapping(uint16 => mapping(uint16 => Counters.Counter)) public prophetRarityPerRaceCounter;

    //Keep track of races
    string[] public prophetRace;
    //Keep track of names
    mapping(uint16 => string[]) public  prophetCharacter;
    //Keep track of rarities
    string[] public prophetRarities;

    
    //Prophet storage
    mapping(uint256 => Prophet) public prophetData;

}