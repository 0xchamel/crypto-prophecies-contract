// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "../libraries/SafeERC20.sol";
import "../interfaces/IOrb.sol";

interface INFT {
    function burn(uint256) external;

    function ownerOf(uint256) external view returns (address);
}

interface IProphet is INFT {
    function mint(
        address,
        uint16,
        uint16,
        uint16,
        uint16
    ) external returns (uint256);

    function prophets(uint256)
        external
        view
        returns (
            uint16,
            uint16,
            uint16,
            uint16,
            uint256,
            uint256
        );
}

interface IItem is INFT {
    function mint(
        address,
        uint16,
        uint16,
        uint16,
        uint16,
        uint16
    ) external returns (uint256);

    function items(uint256)
        external
        view
        returns (
            uint16,
            uint16,
            uint16,
            uint16,
            uint16,
            uint256,
            uint256
        );
}

/**
 * @title Crypto prophecies summoning contract
 * @notice Summoning contract to mint prophet/item/pet from orb, upgrade prophet/items
 */
contract Summoning is Ownable, VRFConsumerBase {
    using SafeERC20 for ERC20Burnable;

    event SummoningRequested(
        address indexed requester,
        uint256 orbID,
        bytes32 requestID
    );

    event UpgradeRequested(
        address indexed requester,
        bool isProphet,
        uint256[5] orbIDs,
        bytes32 requestID
    );

    struct SummoningRequest {
        address requester;
        uint256 orbID;
    }

    struct UpgradeRequest {
        address requester;
        bool isProphet;
        uint256[5] ids;
    }

    IOrb public orb;
    IProphet public prophet;
    IItem public item;

    // Magic token
    ERC20Burnable public magic;

    // Magic token amount required to summon an orb
    uint256 public summoningAmount;

    uint256[4] public upgradeAmounts;

    mapping(uint16 => uint16) public numRacePerGen;
    mapping(uint16 => uint16) public numCharPerGen;
    mapping(uint16 => uint16) public numMagicSourcePerGen;
    mapping(uint16 => uint16) public numItemTypePerGen;

    // Keep track of summoning requests
    mapping(bytes32 => SummoningRequest) public summoningRequests;

    // Keep track of summoning requests
    mapping(bytes32 => UpgradeRequest) public upgradeRequests;

    // Keep status of summoning request
    mapping(address => mapping(uint256 => bool)) public isSummoning;

    // VRF
    bytes32 internal vrfKeyHash;
    uint256 internal vrfFee;

    modifier isUnique(uint256[5] memory ids) {
        for (uint256 i = 0; i < 4; i++) {
            for (uint256 j = i + 1; j < 5; j++) {
                require(ids[i] != ids[j]);
            }
        }
        _;
    }

    modifier owningItems(INFT nft, uint256[5] memory ids) {
        for (uint256 i = 0; i < 5; i++) {
            require(nft.ownerOf(ids[i]) == msg.sender, "not owning the items");
        }
        _;
    }

    constructor(
        address _orb,
        address _prophet,
        address _item,
        address _magic,
        uint256 _summoningAmount,
        uint256[4] memory _upgradeAmounts,
        address _vrfCoordinator,
        address _link,
        bytes32 _vrfKeyHash,
        uint256 _vrfFee
    )
        VRFConsumerBase(
            _vrfCoordinator, // VRF Coordinator
            _link // LINK Token
        )
    {
        orb = IOrb(_orb);
        prophet = IProphet(_prophet);
        item = IItem(_item);
        magic = ERC20Burnable(_magic);

        summoningAmount = _summoningAmount;
        for (uint256 i = 0; i < 4; i++) {
            upgradeAmounts[i] = _upgradeAmounts[i];
        }

        numRacePerGen[1] = 4;
        numCharPerGen[1] = 10;
        numMagicSourcePerGen[1] = 4;
        numItemTypePerGen[1] = 10;

        vrfKeyHash = _vrfKeyHash;
        vrfFee = _vrfFee;
    }

    function summon(uint256 orbID) external {
        require(orb.balanceOf(msg.sender, orbID) > 0, "not owning the orb");
        require(!isSummoning[msg.sender][orbID], "already requested to summon");
        isSummoning[msg.sender][orbID] = true;

        magic.burnFrom(msg.sender, summoningAmount);

        bytes32 requestID = getRandomNumber();
        SummoningRequest storage request = summoningRequests[requestID];
        request.requester = msg.sender;
        request.orbID = orbID;

        emit SummoningRequested(msg.sender, orbID, requestID);
    }

    function _summon(bytes32 requestID, uint256 randomness) internal {
        SummoningRequest memory request = summoningRequests[requestID];

        if (orb.balanceOf(request.requester, request.orbID) > 0) {
            (uint8 orbType, uint8 orbRarity, uint16 generation) = orb.orbs(
                request.orbID
            );

            uint16 rarity = _getRarity(orbRarity, randomness);

            // Burn orb item
            orb.burn(request.requester, request.orbID, 1);

            // Generate Prophet/Item NFT
            if (orbType == 0) {
                require(numRacePerGen[generation] > 0, "numRacePerGen not set");
                require(numCharPerGen[generation] > 0, "numCharPerGen not set");
                prophet.mint(
                    request.requester,
                    generation,
                    rarity,
                    uint16(randomness % numRacePerGen[generation]),
                    uint16(randomness % numCharPerGen[generation])
                );
            } else {
                require(
                    numMagicSourcePerGen[generation] > 0,
                    "numMagicSourcePerGen not set"
                );
                require(
                    numItemTypePerGen[generation] > 0,
                    "numItemTypePerGen not set"
                );
                item.mint(
                    request.requester,
                    generation,
                    rarity,
                    uint16(orbType - 1),
                    uint16(randomness % numMagicSourcePerGen[generation]),
                    uint16(randomness % numItemTypePerGen[generation])
                );
            }
        }

        isSummoning[request.requester][request.orbID] = false;
        delete summoningRequests[requestID];
    }

    function upgradeProphet(uint256[5] memory ids)
        external
        isUnique(ids)
        owningItems(prophet, ids)
    {
        for (uint256 i = 0; i < 4; i++) {
            require(
                _hasSameGenerationRarityRace(ids[i], ids[i + 1]),
                "prophets should have same generation, rarity and race"
            );
        }

        (, uint16 rarity, , , , ) = prophet.prophets(ids[0]);

        require(rarity < 4, "can't upgrade legendary prophets");

        // transfer magic token required to upgrade
        magic.burnFrom(msg.sender, upgradeAmounts[rarity]);

        bytes32 requestID = getRandomNumber();
        UpgradeRequest storage request = upgradeRequests[requestID];
        request.requester = msg.sender;
        request.isProphet = true;
        for (uint256 i = 0; i < 5; i++) {
            request.ids[i] = ids[i];
        }

        emit UpgradeRequested(msg.sender, true, ids, requestID);
    }

    function upgradeItem(uint256[5] memory ids)
        external
        isUnique(ids)
        owningItems(item, ids)
    {
        for (uint256 i = 0; i < 4; i++) {
            require(
                _hasSameGenerationRarityClassMagicSource(ids[i], ids[i + 1]),
                "items should have same generation, rarity, class and magic source"
            );
        }

        (, uint16 rarity, , , , , ) = item.items(ids[0]);

        require(rarity < 4, "can't upgrade legendary items");

        // transfer magic token required to upgrade
        magic.burnFrom(msg.sender, upgradeAmounts[rarity]);

        bytes32 requestID = getRandomNumber();
        UpgradeRequest storage request = upgradeRequests[requestID];
        request.requester = msg.sender;
        for (uint256 i = 0; i < 5; i++) {
            request.ids[i] = ids[i];
        }

        emit UpgradeRequested(msg.sender, false, ids, requestID);
    }

    function _hasSameGenerationRarityRace(uint256 id1, uint256 id2)
        internal
        view
        returns (bool)
    {
        (uint16 generation1, uint16 rarity1, uint16 race1, , , ) = prophet
            .prophets(id1);
        (uint16 generation2, uint16 rarity2, uint16 race2, , , ) = prophet
            .prophets(id2);

        return
            generation1 == generation2 && rarity1 == rarity2 && race1 == race2;
    }

    function _hasSameGenerationRarityClassMagicSource(uint256 id1, uint256 id2)
        internal
        view
        returns (bool)
    {
        (
            uint16 generation1,
            uint16 rarity1,
            uint16 class1,
            uint16 magicSource1,
            ,
            ,

        ) = item.items(id1);
        (
            uint16 generation2,
            uint16 rarity2,
            uint16 class2,
            uint16 magicSource2,
            ,
            ,

        ) = item.items(id2);

        return
            generation1 == generation2 &&
            rarity1 == rarity2 &&
            class1 == class2 &&
            magicSource1 == magicSource2;
    }

    function _upgrade(bytes32 requestID, uint256 randomness) internal {
        UpgradeRequest memory request = upgradeRequests[requestID];

        if (request.isProphet) {
            (uint16 generation, uint16 rarity, uint16 race, , , ) = prophet
                .prophets(request.ids[0]);

            require(numCharPerGen[generation] > 0, "numCharPerGen not set");

            for (uint256 i = 0; i < 5; i++) {
                prophet.burn(request.ids[i]);
            }

            prophet.mint(
                request.requester,
                generation,
                rarity + 1,
                race,
                uint16(randomness % numCharPerGen[generation])
            );
        } else {
            (
                uint16 generation,
                uint16 rarity,
                uint16 class,
                uint16 magicSource,
                ,
                ,

            ) = item.items(request.ids[0]);

            require(
                numItemTypePerGen[generation] > 0,
                "numItemTypePerGen not set"
            );

            for (uint256 i = 0; i < 5; i++) {
                item.burn(request.ids[i]);
            }

            item.mint(
                request.requester,
                generation,
                rarity + 1,
                class,
                magicSource,
                uint16(randomness % numItemTypePerGen[generation])
            );
        }

        delete upgradeRequests[requestID];
    }

    function _getRarity(uint8 orbRarity, uint256 randomness)
        internal
        view
        returns (uint16)
    {
        (
            uint16 common,
            uint16 uncommon,
            uint16 rare,
            uint16 epic,
            uint16 legendary
        ) = orb.rarities(orbRarity);
        uint16 total = common + uncommon + rare + epic + legendary;
        uint16 mod = uint16(randomness % uint256(total));

        if (mod < common) return 0;
        mod -= common;
        if (mod < uncommon) return 1;
        mod -= uncommon;
        if (mod < rare) return 2;
        mod -= rare;
        if (mod < epic) return 3;
        return 4;
    }

    /**
     * Requests randomness from a user-provided seed
     */
    function getRandomNumber() internal returns (bytes32 requestID) {
        require(LINK.balanceOf(address(this)) >= vrfFee, "Not enough LINK");
        return requestRandomness(vrfKeyHash, vrfFee);
    }

    /**
     * Callback function used by VRF Coordinator
     */
    function fulfillRandomness(bytes32 requestID, uint256 randomness)
        internal
        override
    {
        SummoningRequest memory summonReq = summoningRequests[requestID];
        UpgradeRequest memory upgradeReq = upgradeRequests[requestID];

        if (summonReq.requester != address(0)) {
            _summon(requestID, randomness);
        } else if (upgradeReq.requester != address(0)) {
            _upgrade(requestID, randomness);
        }
    }

    function updateSummoningAmount(uint256 _amount) external onlyOwner {
        summoningAmount = _amount;
    }

    function updateUpgradeAmount(uint256[4] memory _amounts)
        external
        onlyOwner
    {
        for (uint256 i = 0; i < 4; i++) {
            upgradeAmounts[i] = _amounts[i];
        }
    }

    function updateNumRacePerGen(uint16 generation, uint16 numRace)
        external
        onlyOwner
    {
        numRacePerGen[generation] = numRace;
    }

    function updateNumCharPerGen(uint16 generation, uint16 numChar)
        external
        onlyOwner
    {
        numCharPerGen[generation] = numChar;
    }

    function updateNumMagicSourcePerGen(
        uint16 generation,
        uint16 numMagicSource
    ) external onlyOwner {
        numMagicSourcePerGen[generation] = numMagicSource;
    }

    function updateNumItemTypePerGen(uint16 generation, uint16 numItemType)
        external
        onlyOwner
    {
        numItemTypePerGen[generation] = numItemType;
    }
}
