// SPDX-License-Identifier: MIT

pragma solidity 0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

contract Shop is ReentrancyGuard, Ownable {
    using Address for address;
    using SafeERC20 for IERC20;

    struct ItemInfo {
        bool initialized;
        address owner;
        uint256 amount;
        uint256 limit;
        uint256 price;
        address nftAddress;
        uint256 tokenId;
    }

    // NFT Address => token id => itemInfo
    mapping(address => mapping(uint256 => ItemInfo)) private _items;

    // DropNo => address => token id => purchased number
    mapping(uint256 => mapping(address => mapping(uint256 => uint256)))
        public userLimits;

    // NFT Address
    mapping(uint256 => ItemInfo[]) private _shopItems;

    // Sale start timestamp
    uint256 public startTime;

    // Drop Number
    uint256 public dropNo;

    // Pausable variable
    bool public isPaused;

    // TCP token address
    IERC20 public tcpToken;

    // Reward address
    address public rewardAddress;

    event ItemListed(
        address indexed nftAddress,
        address indexed owner,
        uint256 amount,
        uint256 limit,
        uint256 price,
        uint256 indexed tokenId
    );
    event ItemPriceUpdated(
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 _price
    );
    event ItemCancelled(address indexed nftAddress, uint256 indexed tokenId);

    modifier whenNotPaused() {
        require(!isPaused, "already paused");
        _;
    }

    constructor(
        address _rewardAddress,
        address _tcpToken,
        uint256 _startTime
    ) public {
        require(_rewardAddress != address(0), "invalid reward address");
        require(_tcpToken != address(0), "invalid tcp token address");
        require(_startTime >= block.timestamp, "invalid start time");

        rewardAddress = _rewardAddress;
        tcpToken = IERC20(_tcpToken);
        startTime = _startTime;
    }

    function purchase(
        address _nftAddress,
        uint256 _tokenId,
        uint256 _count
    ) external nonReentrant whenNotPaused {
        require(startTime < block.timestamp, "purchase: Not started");

        ItemInfo storage item = _items[_nftAddress][_tokenId];
        require(
            userLimits[dropNo][_msgSender()][_tokenId] + _count <= item.limit,
            "purchase: User limit exceeded"
        );

        require(_count != 0, "purchase: invalid purchase count");
        require(item.amount != 0, "purchase: Not enough items left");
        require(!_msgSender().isContract(), "purchase: No contracts permitted");
        require(
            _items[_nftAddress][_tokenId].initialized,
            "purchase: Not able to purchase which isn't existed"
        );
        require(
            IERC1155(_nftAddress).balanceOf(item.owner, _tokenId) >= _count,
            "purchase: owner doesn't have NFT items"
        );

        // Send to owner
        tcpToken.safeTransferFrom(
            _msgSender(),
            rewardAddress,
            item.price * _count
        );

        // Send NFT item to buyer
        IERC1155(_nftAddress).safeTransferFrom(
            item.owner,
            _msgSender(),
            _tokenId,
            _count,
            ""
        );
        item.amount = item.amount - _count;

        // Update _shopItems
        for (uint256 i = 0; i < _shopItems[dropNo].length; i++) {
            if (
                _shopItems[dropNo][i].nftAddress == _nftAddress &&
                _shopItems[dropNo][i].tokenId == _tokenId
            ) {
                _shopItems[dropNo][i].amount =
                    _shopItems[dropNo][i].amount -
                    _count;
                break;
            }
        }

        userLimits[dropNo][_msgSender()][_tokenId] =
            userLimits[dropNo][_msgSender()][_tokenId] +
            _count;
    }

    ///////////////
    // Accessors //
    ///////////////

    function getItem(address _nftAddress, uint256 _tokenId)
        external
        view
        returns (
            bool _initialized,
            address _owner,
            uint256 _amount,
            uint256 _limit,
            uint256 _price
        )
    {
        ItemInfo memory item = _items[_nftAddress][_tokenId];
        return (
            item.initialized,
            item.owner,
            item.amount,
            item.limit,
            item.price
        );
    }

    function getList(uint256 _dropNo)
        external
        view
        returns (ItemInfo[] memory)
    {
        return _shopItems[_dropNo];
    }

    function getLimits(
        uint256 _dropNo,
        address _account,
        uint256[] memory _tokenIds
    ) external view returns (uint256[] memory) {
        uint256[] memory limits = new uint256[](_tokenIds.length);
        for (uint256 i = 0; i < _tokenIds.length; i++) {
            limits[i] = userLimits[_dropNo][_account][_tokenIds[i]];
        }

        return limits;
    }

    //////////
    // Admin /
    //////////

    function toggleIsPaused() external onlyOwner {
        isPaused = !isPaused;
    }

    function startNewDrop(uint256 _startTime) external onlyOwner {
        require(_startTime >= block.timestamp, "invalid start time");
        startTime = _startTime;
        dropNo = dropNo + 1;
    }

    function createItem(
        address _nftAddress,
        uint256 _tokenId,
        uint256 _amount,
        uint256 _limit,
        uint256 _price
    ) external onlyOwner {
        require(_amount != 0, "invalid amount");
        require(_limit != 0, "invalid limit number");
        require(_price != 0, "invalid price");
        require(
            IERC1155(_nftAddress).balanceOf(_msgSender(), _tokenId) >=
                _amount &&
                IERC1155(_nftAddress).isApprovedForAll(
                    _msgSender(),
                    address(this)
                ),
            "createItem: not owner or approved"
        );

        _items[_nftAddress][_tokenId] = ItemInfo({
            initialized: true,
            owner: _msgSender(),
            amount: _amount,
            limit: _limit,
            price: _price,
            nftAddress: _nftAddress,
            tokenId: _tokenId
        });

        uint256 i;
        for (i = 0; i < _shopItems[dropNo].length; i++) {
            if (
                _shopItems[dropNo][i].nftAddress == _nftAddress &&
                _shopItems[dropNo][i].tokenId == _tokenId
            ) {
                _shopItems[dropNo][i] = _items[_nftAddress][_tokenId];
                break;
            }
        }

        if (i == _shopItems[dropNo].length)
            _shopItems[dropNo].push(_items[_nftAddress][_tokenId]);

        emit ItemListed(
            _nftAddress,
            _msgSender(),
            _amount,
            _limit,
            _price,
            _tokenId
        );
    }

    function cancelItem(address _nftAddress, uint256 _tokenId)
        external
        onlyOwner
    {
        ItemInfo storage item = _items[_nftAddress][_tokenId];

        require(item.initialized, "cancelItem: not initialized");

        for (uint256 i = 0; i < _shopItems[dropNo].length; i++) {
            if (
                _shopItems[dropNo][i].nftAddress == _nftAddress &&
                _shopItems[dropNo][i].tokenId == _tokenId
            ) {
                _shopItems[dropNo][i] = _shopItems[dropNo][
                    _shopItems[dropNo].length - 1
                ];
                _shopItems[dropNo].pop();

                break;
            }
        }

        delete _items[_nftAddress][_tokenId];

        emit ItemCancelled(_nftAddress, _tokenId);
    }

    function updateItemPrice(
        address _nftAddress,
        uint256 _tokenId,
        uint256 _price
    ) external onlyOwner {
        ItemInfo storage item = _items[_nftAddress][_tokenId];

        item.price = _price;
        emit ItemPriceUpdated(_nftAddress, _tokenId, _price);
    }

    function updateItemAmount(
        address _nftAddress,
        uint256 _tokenId,
        uint256 _amount
    ) external onlyOwner {
        ItemInfo storage item = _items[_nftAddress][_tokenId];
        require(
            IERC1155(_nftAddress).balanceOf(item.owner, _tokenId) >= _amount,
            "updateItemAmount: Not enough NFT"
        );

        item.amount = _amount;
    }

    function updateItemLimit(
        address _nftAddress,
        uint256 _tokenId,
        uint256 _limit
    ) external onlyOwner {
        require(_limit != 0, "invalid limit number");
        ItemInfo storage item = _items[_nftAddress][_tokenId];

        item.limit = _limit;
    }

    function updateRewardAddress(address _rewardAddress) external onlyOwner {
        require(_rewardAddress != address(0), "invalid address");

        rewardAddress = _rewardAddress;
    }

    function updateStartTime(uint256 _startTime) external onlyOwner {
        require(_startTime >= block.timestamp, "invalid start time");

        startTime = _startTime;
    }

    function reclaimERC20(address _tokenContract) external onlyOwner {
        require(_tokenContract != address(0), "Invalid address");
        IERC20 token = IERC20(_tokenContract);
        uint256 balance = token.balanceOf(address(this));
        require(token.transfer(_msgSender(), balance), "Transfer failed");
    }
}
