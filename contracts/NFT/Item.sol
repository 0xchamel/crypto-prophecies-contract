// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CryptoPropheciesItem is ERC721Enumerable, Ownable {
    struct ItemInfo {
        uint16 generation;
        uint16 rarity;
        uint16 class;
        uint16 magicSource;
        uint16 itemType;
        uint256 magicSourceOrder;
        uint256 characterOrder;
    }

    uint256 public itemIdPointer;
    // magicSource => class => count;
    mapping(uint16 => mapping(uint16 => uint256)) public itemsPerMagicSource;
    // magicSource => class => itemType => count;
    mapping(uint16 => mapping(uint16 => mapping(uint16 => uint256))) public itemsPerCharacter;
    // class => generation => magicSource => itemType => count;
    mapping(uint16 => mapping(uint16 => mapping(uint16 => mapping(uint16 => uint256))))
        public legendaryItemsPerGeneration;

    mapping(uint256 => ItemInfo) public items;

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

    constructor(string memory _baseTokenURI) ERC721("Crypto Prophecies Item", "CPI") {
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
        uint16 _class,
        uint16 _magicSource,
        uint16 _itemType
    ) external onlyMinter returns (uint256) {
        itemIdPointer = itemIdPointer + 1;
        uint256 itemId = itemIdPointer;

        _safeMint(_owner, itemId);
        _setItemData(
            itemId,
            _generation,
            _rarity,
            _class,
            _magicSource,
            _itemType
        );

        return itemId;
    }

    function burn(uint256 _itemId) external onlyBurner {
        _burn(_itemId);
    }

    function _setItemData(
        uint256 _itemId,
        uint16 _generation,
        uint16 _rarity,
        uint16 _class,
        uint16 _magicSource,
        uint16 _itemType
    ) internal {
        itemsPerMagicSource[_magicSource][_class] =
            itemsPerMagicSource[_magicSource][_class] +
            1;
        itemsPerCharacter[_magicSource][_class][_itemType] = itemsPerCharacter[_magicSource][_class][_itemType] + 1;
        uint16 rarity = _rarity;
        if (rarity == 4) {
            // for first legendary item in the generation, set rarity as founder
            if (
                legendaryItemsPerGeneration[_class][_generation][_magicSource][
                    _itemType
                ] == 0
            ) {
                rarity = 5;
            }
            legendaryItemsPerGeneration[_class][_generation][_magicSource][
                _itemType
            ]++;
        }
        items[_itemId] = ItemInfo(
            _generation,
            rarity,
            _class,
            _magicSource,
            _itemType,
            itemsPerMagicSource[_magicSource][_class],
            itemsPerCharacter[_magicSource][_class][_itemType]
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

    function getItemIDsByOwner(address _owner) public view returns (uint256[] memory) {
        uint256 balance = balanceOf(_owner);
        uint256[] memory ids = new uint256[](balance);
        for (uint256 i = 0; i < balance; i++) {
            ids[i] = tokenOfOwnerByIndex(_owner, i);
        }
        return ids;
    }

    function getItemInfoByOwner(address _owner) public view returns (ItemInfo[] memory) {
        uint256 balance = balanceOf(_owner);
        ItemInfo[] memory res = new ItemInfo[](balance);
        for (uint256 i = 0; i < balance; i++) {
            uint256 id = tokenOfOwnerByIndex(_owner, i);
            res[i] = items[id];
        }
        return res;
    }
}
