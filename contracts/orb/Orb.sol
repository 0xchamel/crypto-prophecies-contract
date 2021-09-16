// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract Orb is ERC1155Upgradeable, OwnableUpgradeable {
    enum OrbType {
        ORB,
        STONE,
        CUBE,
        DIAMOND,
        EGG
    }

    enum OrbRarity {
        COMMON,
        UNCOMMON,
        RARE,
        EPIC,
        LEGENDARY
    }

    struct OrbInfo {
        OrbType orbType;
        OrbRarity orbRarity;
        uint16 generation;
    }

    struct Rarity {
        uint16 common;
        uint16 uncommon;
        uint16 rare;
        uint16 epic;
        uint16 legendary;
    }

    event Supply(uint256 indexed tokenId, uint256 value);
    event GenerationUpdated(uint16 indexed id);
    event OrbInfoAdded(
        OrbType orbType,
        OrbRarity orbRarity,
        uint16 common,
        uint16 uncommon,
        uint16 rare,
        uint16 epic,
        uint16 legendary,
        uint16 indexed generation
    );
    event URI(uint256 indexed tokenId, string value);
    event SetMinter(address indexed account, bool value);
    event SetBurner(address indexed account, bool value);

    uint16 public orbGenId;
    mapping(uint256 => OrbInfo) public orbs;
    mapping(uint256 => uint256) public supply;
    mapping(OrbRarity => Rarity) public rarities;

    mapping(uint256 => string) private _tokenURIs;
    mapping(address => bool) private _minters;
    mapping(address => bool) private _burners;

    modifier onlyMinter() {
        require(_minters[_msgSender()], "Invalid minter");
        _;
    }

    modifier onlyBurner() {
        require(_burners[_msgSender()], "Invalid burner");
        _;
    }

    function initialize(string memory _uri) public initializer {
        _minters[_msgSender()] = true;
        __Ownable_init();
        __ERC1155_init(_uri);
        __ERC1155_init_unchained(_uri);
    }

    function mint(
        address _account,
        uint256 _id,
        uint256 _maximum,
        string memory _tokenUri,
        OrbType _orbType,
        OrbRarity _orbRarity,
        bytes memory _data
    ) external onlyMinter {
        require(_maximum > 0, "supply incorrect");
        require(supply[_id] == 0, "token id is existed");

        _saveSupply(_id, _maximum);
        _setTokenURI(_id, _tokenUri);
        _mint(_account, _id, _maximum, _data);
        _setOrbData(_id, _orbType, _orbRarity);
    }

    function burn(
        address _account,
        uint256 _id,
        uint256 _amount
    ) external onlyBurner {
        _burn(_account, _id, _amount);
    }

    function setGenerationId(uint16 _id) external onlyOwner {
        require(orbGenId < _id, "invalid generation id");
        orbGenId = _id;
        emit GenerationUpdated(_id);
    }

    function setMinter(address _address, bool _isMinter) external onlyOwner {
        _minters[_address] = _isMinter;
        emit SetMinter(_address, _isMinter);
    }

    function setBurner(address _address, bool _isBurner) external onlyOwner {
        _burners[_address] = _isBurner;
        emit SetBurner(_address, _isBurner);
    }

    function setSupply(uint256 _tokenId, uint256 _supply) external onlyOwner {
        require(_supply != 0, "supply can't be zero");
        _saveSupply(_tokenId, _supply);
    }

    function setRarity(
        OrbRarity _orbRarity,
        uint16 _common,
        uint16 _uncommon,
        uint16 _rare,
        uint16 _epic,
        uint16 _legendary
    ) external onlyOwner {
        require(
            _common + _uncommon + _rare + _epic + _legendary == 10000,
            "invalid rarity values"
        );

        rarities[_orbRarity] = Rarity(
            _common,
            _uncommon,
            _rare,
            _epic,
            _legendary
        );
    }

    function tokenURI(uint256 _tokenId) external view returns (string memory) {
        return _tokenURIs[_tokenId];
    }

    function isMinter(address _minter) external view returns (bool) {
        return _minters[_minter];
    }

    function isBurner(address _burner) external view returns (bool) {
        return _burners[_burner];
    }

    function _setOrbData(
        uint256 _orbId,
        OrbType _orbType,
        OrbRarity _orbRarity
    ) internal {
        orbs[_orbId] = OrbInfo(_orbType, _orbRarity, orbGenId);

        emit OrbInfoAdded(
            _orbType,
            _orbRarity,
            rarities[_orbRarity].common,
            rarities[_orbRarity].uncommon,
            rarities[_orbRarity].rare,
            rarities[_orbRarity].epic,
            rarities[_orbRarity].legendary,
            orbGenId
        );
    }

    function _saveSupply(uint256 _tokenId, uint256 _supply) internal {
        require(supply[_tokenId] == 0);
        supply[_tokenId] = _supply;
        emit Supply(_tokenId, _supply);
    }

    function _setTokenURI(uint256 _tokenId, string memory _tokenUri)
        internal
        virtual
    {
        bytes memory emptyStringTest = bytes(_tokenUri);
        if (emptyStringTest.length == 0) {
            revert("invalid token uri");
        }

        _tokenURIs[_tokenId] = _tokenUri;
        emit URI(_tokenId, _tokenUri);
    }
}
