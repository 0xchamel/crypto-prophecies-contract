// SPDX-License-Identifier: MIT
pragma solidity 0.7.4;

import "@openzeppelin/contracts/utils/Counters.sol";

contract ProphetV2Storage {
    
    struct Voter { // Struct
        uint weight;
        bool voted;
        address delegate;
        uint vote;
    }

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
    mapping(uint8 => mapping(uint8 => Counters.Counter)) public prophetRarityPerRaceCounter;

    //Keep track of races
    string[] public prophetRace;
    //Keep track of names
    mapping(uint8 => string[]) public  prophetCharacter;
    //Keep track of rarities
    string[] public prophetRarities;

}