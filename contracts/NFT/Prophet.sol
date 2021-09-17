// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CryptoPropheciesProphet is ERC721Enumerable, Ownable {
    struct ProphetInfo {
        uint16 generation;
        uint16 rarity;
        uint16 race;
        uint16 character;
        uint256 raceOrder;
        uint256 characterOrder;
    }

    uint256 public prophetIdPointer;
    mapping(uint16 => uint256) public prophetsPerRace;
    mapping(uint16 => uint256) public prophetsPerCharacter;
    // generation => race => character => count;
    mapping(uint16 => mapping(uint16 => mapping(uint16 => uint256)))
        public legendaryProphetsPerGeneration;

    mapping(uint256 => ProphetInfo) public prophets;

    string private baseTokenURI;

    mapping(address => bool) private minters;
    mapping(address => bool) private burners;

    event SetMinter(address indexed account, bool value);
    event SetBurner(address indexed account, bool value);

    modifier onlyMinter() {
        require(minters[msg.sender], "Invalid minter");
        _;
    }

    modifier onlyBurner() {
        require(burners[msg.sender], "Invalid burner");
        _;
    }

    constructor(string memory _baseTokenURI) ERC721("Crypto Prophecies Prophet", "CPP") {
        baseTokenURI = _baseTokenURI;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseTokenURI;
    }

    function setBaseURI(string memory _baseTokenURI) external onlyOwner {
        baseTokenURI = _baseTokenURI;
    }

    function mint(
        address _owner,
        uint16 _generation,
        uint16 _rarity,
        uint16 _race,
        uint16 _character
    ) external onlyMinter returns (uint256) {
        prophetIdPointer = prophetIdPointer + 1;
        uint256 prophetId = prophetIdPointer;

        _safeMint(_owner, prophetId);
        _setProphetData(prophetId, _generation, _rarity, _race, _character);

        return prophetId;
    }

    function burn(uint256 _prophetId) external onlyBurner {
        _burn(_prophetId);
    }

    function _setProphetData(
        uint256 _prophetId,
        uint16 _generation,
        uint16 _rarity,
        uint16 _race,
        uint16 _character
    ) internal {
        prophetsPerRace[_race] = prophetsPerRace[_race] + 1;
        prophetsPerCharacter[_character] = prophetsPerCharacter[_character] + 1;
        uint16 rarity = _rarity;
        if (rarity == 4) {
            // for first legendary prophet in the generation, set rarity as founder
            if (
                legendaryProphetsPerGeneration[_generation][_race][
                    _character
                ] == 0
            ) {
                rarity = 5;
            }
            legendaryProphetsPerGeneration[_generation][_race][_character]++;
        }
        prophets[_prophetId] = ProphetInfo(
            _generation,
            rarity,
            _race,
            _character,
            prophetsPerRace[_race],
            prophetsPerCharacter[_character]
        );
    }

    function setMinter(address _address, bool _isMinter) external onlyOwner {
        minters[_address] = _isMinter;
        emit SetMinter(_address, _isMinter);
    }

    function setBurner(address _address, bool _isBurner) external onlyOwner {
        burners[_address] = _isBurner;
        emit SetBurner(_address, _isBurner);
    }

    function getProphetIDsByOwner(address _owner) public view returns (uint256[] memory) {
        uint256 balance = balanceOf(_owner);
        uint256[] memory ids = new uint256[](balance);
        for (uint256 i = 0; i < balance; i++) {
            ids[i] = tokenOfOwnerByIndex(_owner, i);
        }
        return ids;
    }

    function getProphetInfoByOwner(address _owner) public view returns (ProphetInfo[] memory) {
        uint256 balance = balanceOf(_owner);
        ProphetInfo[] memory res = new ProphetInfo[](balance);
        for (uint256 i = 0; i < balance; i++) {
            uint256 id = tokenOfOwnerByIndex(_owner, i);
            res[i] = prophets[id];
        }
        return res;
    }
}
