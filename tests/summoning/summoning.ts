import { expect } from "chai";

const Summoning = hre.artifacts.require("Summoning");
const Magic = hre.artifacts.require("Magic");
const Orb = hre.artifacts.require("Orb");
const Prophet = hre.artifacts.require("CryptoPropheciesProphet");
const Item = hre.artifacts.require("CryptoPropheciesItem");

const prophetBaseTokenURI = "https://api.crypto-propheccies.com/prophet/";
const itemBaseTokenURI = "https://api.crypto-propheccies.com/item/";

describe("Summoning Contract", function() {
  beforeEach(async function() {
    const [alice, bob, carol] = await web3.eth.getAccounts();
    this.alice = alice;
    this.bob = bob;
    this.carol = carol;

    this.summoningAmount = "10000000000000000000";
    this.upgradeAmounts = [
      "25000000000000000000",
      "125000000000000000000",
      "625000000000000000000",
      "3125000000000000000000",
    ];

    this.orb = await Orb.new();
    await this.orb.initialize("");
    await this.orb.setRarity("0", "9000", "800", "200", "0", "0");
    await this.orb.setRarity("1", "945", "8500", "300", "250", "5");
    await this.orb.setRarity("2", "100", "950", "8500", "400", "50");
    await this.orb.setRarity("3", "50", "300", "1000", "8250", "400");
    await this.orb.setRarity("4", "0", "5", "495", "1000", "8500");

    this.prophet = await Prophet.new(prophetBaseTokenURI);
    this.item = await Item.new(itemBaseTokenURI);
    this.magic = await Magic.new("10000000000000000000000");

    this.keyhash =
      "0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4";
    this.fee = "1000000000000000000";

    const MockLink = hre.artifacts.require("MockLink");
    this.link = await MockLink.new();
    const VRFCoordinatorMock = hre.artifacts.require("VRFCoordinatorMock");
    this.vrfCoordinatorMock = await VRFCoordinatorMock.new(this.link.address);

    this.summoning = await Summoning.new(
      this.orb.address,
      this.prophet.address,
      this.item.address,
      this.magic.address,
      this.summoningAmount,
      this.upgradeAmounts,
      this.vrfCoordinatorMock.address,
      this.link.address,
      this.keyhash,
      this.fee
    );

    await this.prophet.setMinter(this.summoning.address, true);
    await this.prophet.setBurner(this.summoning.address, true);
    await this.item.setMinter(this.summoning.address, true);
    await this.item.setBurner(this.summoning.address, true);
    await this.orb.setBurner(this.summoning.address, true);
  });

  it("should mint orb", async function() {
    await this.orb.setGenerationId("1");
    await this.orb.mint(this.bob, 1, 10, "orb1", "0", "0", "0x");

    const res = await this.orb.orbs(1);
    expect(res[0].toString()).to.equal("0");
    expect(res[1].toString()).to.equal("0");
    expect(res[2].toString()).to.equal("1");
  });

  it("should summon prophet & burn orb", async function() {
    await this.orb.setGenerationId("1");
    await this.orb.mint(this.bob, 1, 10, "orb1", "0", "0", "0x");

    await this.magic.transfer(this.bob, "10000000000000000000");
    await this.magic.approve(this.summoning.address, "10000000000000000000", {
      from: this.bob,
    });

    await this.link.transfer(this.summoning.address, "2000000000000000000");

    const tx = await this.summoning.summon(1, { from: this.bob });
    const requestId = tx.logs[0].args.requestID;

    const res = await this.vrfCoordinatorMock.callBackWithRandomness(
      requestId,
      "33333",
      this.summoning.address
    );
    const mintLog = res.receipt.rawLogs[1];

    expect(mintLog.topics[0]).to.equal(
      "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
    );
    expect(
      hre.ethers.BigNumber.from(mintLog.topics[2])
        .toString()
        .toLowerCase()
    ).to.be.eq(
      hre.ethers.BigNumber.from(this.bob)
        .toString()
        .toLowerCase()
    );

    const prophetId = hre.ethers.BigNumber.from(mintLog.topics[3]);
    const prophetData = await this.prophet.prophets(prophetId);
    expect(prophetData.generation.toString()).to.equal("1");
    expect(prophetData.rarity.toString()).to.equal("0");
    expect(prophetData.race.toString()).to.equal("1");
    expect(prophetData.character.toString()).to.equal("3");

    expect((await this.orb.balanceOf(this.bob, 1)).toString()).to.equal("9");
  });

  it("should summon item & burn orb", async function() {
    await this.orb.setGenerationId("1");
    await this.orb.mint(this.bob, 1, 10, "orb1", "3", "0", "0x");

    await this.magic.transfer(this.bob, "10000000000000000000");
    await this.magic.approve(this.summoning.address, "10000000000000000000", {
      from: this.bob,
    });

    await this.link.transfer(this.summoning.address, "2000000000000000000");

    const tx = await this.summoning.summon(1, { from: this.bob });
    const requestId = tx.logs[0].args.requestID;

    const res = await this.vrfCoordinatorMock.callBackWithRandomness(
      requestId,
      "77777",
      this.summoning.address
    );
    const mintLog = res.receipt.rawLogs[1];

    expect(mintLog.topics[0]).to.equal(
      "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
    );
    expect(
      hre.ethers.BigNumber.from(mintLog.topics[2])
        .toString()
        .toLowerCase()
    ).to.be.eq(
      hre.ethers.BigNumber.from(this.bob)
        .toString()
        .toLowerCase()
    );

    const itemId = hre.ethers.BigNumber.from(mintLog.topics[3]);
    const itemData = await this.item.items(itemId);
    expect(itemData.generation.toString()).to.equal("1");
    expect(itemData.rarity.toString()).to.equal("0");
    expect(itemData.class.toString()).to.equal("2");
    expect(itemData.magicSource.toString()).to.equal("1");
    expect(itemData.itemType.toString()).to.equal("7");

    expect((await this.orb.balanceOf(this.bob, 1)).toString()).to.equal("9");
  });

  it("should not summong without magic portion", async function() {
    await this.orb.setGenerationId("1");
    await this.orb.mint(this.bob, 1, 10, "orb1", "3", "0", "0x");

    await this.link.transfer(this.summoning.address, "2000000000000000000");

    await expect(
      this.summoning.summon(1, { from: this.bob })
    ).to.be.revertedWith("ERC20: burn amount exceeds allowance");
  });

  it("should upgrade prophets", async function() {
    await this.orb.setGenerationId("1");
    await this.orb.mint(this.bob, 1, 10, "orb1", "0", "0", "0x");

    await this.magic.transfer(this.bob, "1000000000000000000000");
    await this.magic.approve(this.summoning.address, "1000000000000000000000", {
      from: this.bob,
    });

    await this.link.transfer(this.summoning.address, "50000000000000000000");

    const prophetIds = [];

    for (let i = 0; i < 5; i++) {
      const tx = await this.summoning.summon(1, { from: this.bob });
      const requestId = tx.logs[0].args.requestID;

      const res = await this.vrfCoordinatorMock.callBackWithRandomness(
        requestId,
        "33333",
        this.summoning.address
      );
      const mintLog = res.receipt.rawLogs[1];

      expect(mintLog.topics[0]).to.equal(
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
      );
      expect(
        hre.ethers.BigNumber.from(mintLog.topics[2])
          .toString()
          .toLowerCase()
      ).to.be.eq(
        hre.ethers.BigNumber.from(this.bob)
          .toString()
          .toLowerCase()
      );

      const prophetId = hre.ethers.BigNumber.from(mintLog.topics[3]);
      const prophetData = await this.prophet.prophets(prophetId);
      expect(prophetData.generation.toString()).to.equal("1");
      expect(prophetData.rarity.toString()).to.equal("0");
      expect(prophetData.race.toString()).to.equal("1");
      expect(prophetData.character.toString()).to.equal("3");

      prophetIds.push(prophetId);
    }

    expect((await this.orb.balanceOf(this.bob, 1)).toString()).to.equal("5");

    const tx = await this.summoning.upgradeProphet(prophetIds, {
      from: this.bob,
    });
    const requestId = tx.logs[0].args.requestID;

    const res = await this.vrfCoordinatorMock.callBackWithRandomness(
      requestId,
      "12345",
      this.summoning.address
    );
    const mintLog = res.receipt.rawLogs[10];
    const prophetId = hre.ethers.BigNumber.from(mintLog.topics[3]);
    const prophetData = await this.prophet.prophets(prophetId);
    expect(prophetData.generation.toString()).to.equal("1");
    expect(prophetData.rarity.toString()).to.equal("1");
    expect(prophetData.race.toString()).to.equal("1");
    expect(prophetData.character.toString()).to.equal("5");
  });

  it("should own prophets to upgrade", async function() {
    await this.orb.setGenerationId("1");
    await this.orb.mint(this.bob, 1, 10, "orb1", "0", "0", "0x");
    await this.orb.mint(this.carol, 2, 10, "orb1", "0", "0", "0x");

    await this.magic.transfer(this.bob, "1000000000000000000000");
    await this.magic.approve(this.summoning.address, "1000000000000000000000", {
      from: this.bob,
    });
    await this.magic.transfer(this.carol, "1000000000000000000000");
    await this.magic.approve(this.summoning.address, "1000000000000000000000", {
      from: this.carol,
    });

    await this.link.transfer(this.summoning.address, "50000000000000000000");

    const prophetIds = [];

    for (let i = 0; i < 3; i++) {
      const tx = await this.summoning.summon(1, { from: this.bob });
      const requestId = tx.logs[0].args.requestID;

      const res = await this.vrfCoordinatorMock.callBackWithRandomness(
        requestId,
        "33333",
        this.summoning.address
      );
      const mintLog = res.receipt.rawLogs[1];

      expect(mintLog.topics[0]).to.equal(
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
      );
      expect(
        hre.ethers.BigNumber.from(mintLog.topics[2])
          .toString()
          .toLowerCase()
      ).to.be.eq(
        hre.ethers.BigNumber.from(this.bob)
          .toString()
          .toLowerCase()
      );

      const prophetId = hre.ethers.BigNumber.from(mintLog.topics[3]);
      const prophetData = await this.prophet.prophets(prophetId);
      expect(prophetData.generation.toString()).to.equal("1");
      expect(prophetData.rarity.toString()).to.equal("0");
      expect(prophetData.race.toString()).to.equal("1");
      expect(prophetData.character.toString()).to.equal("3");

      prophetIds.push(prophetId);
    }

    expect((await this.orb.balanceOf(this.bob, 1)).toString()).to.equal("7");

    for (let i = 0; i < 2; i++) {
      const tx = await this.summoning.summon(2, { from: this.carol });
      const requestId = tx.logs[0].args.requestID;

      const res = await this.vrfCoordinatorMock.callBackWithRandomness(
        requestId,
        "33333",
        this.summoning.address
      );
      const mintLog = res.receipt.rawLogs[1];

      expect(mintLog.topics[0]).to.equal(
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
      );
      expect(
        hre.ethers.BigNumber.from(mintLog.topics[2])
          .toString()
          .toLowerCase()
      ).to.be.eq(
        hre.ethers.BigNumber.from(this.carol)
          .toString()
          .toLowerCase()
      );

      const prophetId = hre.ethers.BigNumber.from(mintLog.topics[3]);
      const prophetData = await this.prophet.prophets(prophetId);
      expect(prophetData.generation.toString()).to.equal("1");
      expect(prophetData.rarity.toString()).to.equal("0");
      expect(prophetData.race.toString()).to.equal("1");
      expect(prophetData.character.toString()).to.equal("3");

      prophetIds.push(prophetId);
    }

    expect((await this.orb.balanceOf(this.carol, 2)).toString()).to.equal("8");

    await expect(
      this.summoning.upgradeProphet(prophetIds, { from: this.bob })
    ).to.be.revertedWith("not owning the items");
  });

  it("should not upgrade prophets with duplicate prophet id", async function() {
    await this.orb.setGenerationId("1");
    await this.orb.mint(this.bob, 1, 10, "orb1", "0", "0", "0x");

    await this.magic.transfer(this.bob, "1000000000000000000000");
    await this.magic.approve(this.summoning.address, "1000000000000000000000", {
      from: this.bob,
    });

    await this.link.transfer(this.summoning.address, "50000000000000000000");

    const prophetIds = [];

    for (let i = 0; i < 4; i++) {
      const tx = await this.summoning.summon(1, { from: this.bob });
      const requestId = tx.logs[0].args.requestID;

      const res = await this.vrfCoordinatorMock.callBackWithRandomness(
        requestId,
        "33333",
        this.summoning.address
      );
      const mintLog = res.receipt.rawLogs[1];

      expect(mintLog.topics[0]).to.equal(
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
      );
      expect(
        hre.ethers.BigNumber.from(mintLog.topics[2])
          .toString()
          .toLowerCase()
      ).to.be.eq(
        hre.ethers.BigNumber.from(this.bob)
          .toString()
          .toLowerCase()
      );

      const prophetId = hre.ethers.BigNumber.from(mintLog.topics[3]);
      const prophetData = await this.prophet.prophets(prophetId);
      expect(prophetData.generation.toString()).to.equal("1");
      expect(prophetData.rarity.toString()).to.equal("0");
      expect(prophetData.race.toString()).to.equal("1");
      expect(prophetData.character.toString()).to.equal("3");

      prophetIds.push(prophetId);
    }
    prophetIds.push(prophetIds[0]);

    expect((await this.orb.balanceOf(this.bob, 1)).toString()).to.equal("6");

    await expect(
      this.summoning.upgradeProphet(prophetIds, { from: this.bob })
    ).to.be.revertedWith("");
  });

  it("should not upgrade prophets with different generation", async function() {
    await this.magic.transfer(this.bob, "1000000000000000000000");
    await this.magic.approve(this.summoning.address, "1000000000000000000000", {
      from: this.bob,
    });
    await this.link.transfer(this.summoning.address, "50000000000000000000");

    const prophetIds = [];

    await this.orb.setGenerationId("1");
    await this.orb.mint(this.bob, 1, 10, "orb1", "0", "0", "0x");

    for (let i = 0; i < 3; i++) {
      const tx = await this.summoning.summon(1, { from: this.bob });
      const requestId = tx.logs[0].args.requestID;

      const res = await this.vrfCoordinatorMock.callBackWithRandomness(
        requestId,
        "33333",
        this.summoning.address
      );
      const mintLog = res.receipt.rawLogs[1];

      expect(mintLog.topics[0]).to.equal(
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
      );
      expect(
        hre.ethers.BigNumber.from(mintLog.topics[2])
          .toString()
          .toLowerCase()
      ).to.be.eq(
        hre.ethers.BigNumber.from(this.bob)
          .toString()
          .toLowerCase()
      );

      const prophetId = hre.ethers.BigNumber.from(mintLog.topics[3]);
      const prophetData = await this.prophet.prophets(prophetId);
      expect(prophetData.generation.toString()).to.equal("1");
      expect(prophetData.rarity.toString()).to.equal("0");
      expect(prophetData.race.toString()).to.equal("1");
      expect(prophetData.character.toString()).to.equal("3");

      prophetIds.push(prophetId);
    }

    expect((await this.orb.balanceOf(this.bob, 1)).toString()).to.equal("7");

    await this.orb.setGenerationId("2");
    await this.summoning.updateNumRacePerGen("2", "4");
    await this.summoning.updateNumCharPerGen("2", "10");
    await this.summoning.updateNumMagicSourcePerGen("2", "4");
    await this.summoning.updateNumItemTypePerGen("2", "10");
    await this.orb.mint(this.bob, 2, 10, "orb2", "0", "0", "0x");

    for (let i = 0; i < 2; i++) {
      const tx = await this.summoning.summon(2, { from: this.bob });
      const requestId = tx.logs[0].args.requestID;

      const request = await this.summoning.summoningRequests(requestId);

      const res = await this.vrfCoordinatorMock.callBackWithRandomness(
        requestId,
        "33333",
        this.summoning.address
      );
      const mintLog = res.receipt.rawLogs[1];

      expect(mintLog.topics[0]).to.equal(
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
      );
      expect(
        hre.ethers.BigNumber.from(mintLog.topics[2])
          .toString()
          .toLowerCase()
      ).to.be.eq(
        hre.ethers.BigNumber.from(this.bob)
          .toString()
          .toLowerCase()
      );

      const prophetId = hre.ethers.BigNumber.from(mintLog.topics[3]);
      const prophetData = await this.prophet.prophets(prophetId);
      expect(prophetData.generation.toString()).to.equal("2");
      expect(prophetData.rarity.toString()).to.equal("0");
      expect(prophetData.race.toString()).to.equal("1");
      expect(prophetData.character.toString()).to.equal("3");

      prophetIds.push(prophetId);
    }

    expect((await this.orb.balanceOf(this.bob, 2)).toString()).to.equal("8");

    await expect(
      this.summoning.upgradeProphet(prophetIds, { from: this.bob })
    ).to.be.revertedWith(
      "prophets should have same generation, rarity and race"
    );
  });

  it("should not upgrade prophets with different rarity", async function() {
    await this.orb.setGenerationId("1");
    await this.orb.mint(this.bob, 1, 10, "orb1", "0", "0", "0x");
    await this.orb.mint(this.bob, 2, 10, "orb2", "0", "1", "0x");

    await this.magic.transfer(this.bob, "1000000000000000000000");
    await this.magic.approve(this.summoning.address, "1000000000000000000000", {
      from: this.bob,
    });

    await this.link.transfer(this.summoning.address, "50000000000000000000");

    const prophetIds = [];

    for (let i = 0; i < 3; i++) {
      const tx = await this.summoning.summon(1, { from: this.bob });
      const requestId = tx.logs[0].args.requestID;

      const res = await this.vrfCoordinatorMock.callBackWithRandomness(
        requestId,
        "33333",
        this.summoning.address
      );
      const mintLog = res.receipt.rawLogs[1];

      expect(mintLog.topics[0]).to.equal(
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
      );
      expect(
        hre.ethers.BigNumber.from(mintLog.topics[2])
          .toString()
          .toLowerCase()
      ).to.be.eq(
        hre.ethers.BigNumber.from(this.bob)
          .toString()
          .toLowerCase()
      );

      const prophetId = hre.ethers.BigNumber.from(mintLog.topics[3]);
      const prophetData = await this.prophet.prophets(prophetId);
      expect(prophetData.generation.toString()).to.equal("1");
      expect(prophetData.rarity.toString()).to.equal("0");
      expect(prophetData.race.toString()).to.equal("1");
      expect(prophetData.character.toString()).to.equal("3");

      prophetIds.push(prophetId);
    }

    expect((await this.orb.balanceOf(this.bob, 1)).toString()).to.equal("7");

    for (let i = 0; i < 2; i++) {
      const tx = await this.summoning.summon(2, { from: this.bob });
      const requestId = tx.logs[0].args.requestID;

      const res = await this.vrfCoordinatorMock.callBackWithRandomness(
        requestId,
        "33333",
        this.summoning.address
      );
      const mintLog = res.receipt.rawLogs[1];

      expect(mintLog.topics[0]).to.equal(
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
      );
      expect(
        hre.ethers.BigNumber.from(mintLog.topics[2])
          .toString()
          .toLowerCase()
      ).to.be.eq(
        hre.ethers.BigNumber.from(this.bob)
          .toString()
          .toLowerCase()
      );

      const prophetId = hre.ethers.BigNumber.from(mintLog.topics[3]);
      const prophetData = await this.prophet.prophets(prophetId);
      expect(prophetData.generation.toString()).to.equal("1");
      expect(prophetData.rarity.toString()).to.equal("1");
      expect(prophetData.race.toString()).to.equal("1");
      expect(prophetData.character.toString()).to.equal("3");

      prophetIds.push(prophetId);
    }

    expect((await this.orb.balanceOf(this.bob, 2)).toString()).to.equal("8");

    await expect(
      this.summoning.upgradeProphet(prophetIds, { from: this.bob })
    ).to.be.revertedWith(
      "prophets should have same generation, rarity and race"
    );
  });

  it("should not upgrade prophets with different race", async function() {
    await this.orb.setGenerationId("1");
    await this.orb.mint(this.bob, 1, 10, "orb1", "0", "0", "0x");
    await this.orb.mint(this.bob, 2, 10, "orb2", "0", "0", "0x");

    await this.magic.transfer(this.bob, "1000000000000000000000");
    await this.magic.approve(this.summoning.address, "1000000000000000000000", {
      from: this.bob,
    });

    await this.link.transfer(this.summoning.address, "50000000000000000000");

    const prophetIds = [];

    for (let i = 0; i < 3; i++) {
      const tx = await this.summoning.summon(1, { from: this.bob });
      const requestId = tx.logs[0].args.requestID;

      const res = await this.vrfCoordinatorMock.callBackWithRandomness(
        requestId,
        "33333",
        this.summoning.address
      );
      const mintLog = res.receipt.rawLogs[1];

      expect(mintLog.topics[0]).to.equal(
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
      );
      expect(
        hre.ethers.BigNumber.from(mintLog.topics[2])
          .toString()
          .toLowerCase()
      ).to.be.eq(
        hre.ethers.BigNumber.from(this.bob)
          .toString()
          .toLowerCase()
      );

      const prophetId = hre.ethers.BigNumber.from(mintLog.topics[3]);
      const prophetData = await this.prophet.prophets(prophetId);
      expect(prophetData.generation.toString()).to.equal("1");
      expect(prophetData.rarity.toString()).to.equal("0");
      expect(prophetData.race.toString()).to.equal("1");
      expect(prophetData.character.toString()).to.equal("3");

      prophetIds.push(prophetId);
    }

    expect((await this.orb.balanceOf(this.bob, 1)).toString()).to.equal("7");

    for (let i = 0; i < 2; i++) {
      const tx = await this.summoning.summon(2, { from: this.bob });
      const requestId = tx.logs[0].args.requestID;

      const res = await this.vrfCoordinatorMock.callBackWithRandomness(
        requestId,
        "33334",
        this.summoning.address
      );
      const mintLog = res.receipt.rawLogs[1];

      expect(mintLog.topics[0]).to.equal(
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
      );
      expect(
        hre.ethers.BigNumber.from(mintLog.topics[2])
          .toString()
          .toLowerCase()
      ).to.be.eq(
        hre.ethers.BigNumber.from(this.bob)
          .toString()
          .toLowerCase()
      );

      const prophetId = hre.ethers.BigNumber.from(mintLog.topics[3]);
      const prophetData = await this.prophet.prophets(prophetId);
      expect(prophetData.generation.toString()).to.equal("1");
      expect(prophetData.rarity.toString()).to.equal("0");
      expect(prophetData.race.toString()).to.equal("2");
      expect(prophetData.character.toString()).to.equal("4");

      prophetIds.push(prophetId);
    }

    expect((await this.orb.balanceOf(this.bob, 2)).toString()).to.equal("8");

    await expect(
      this.summoning.upgradeProphet(prophetIds, { from: this.bob })
    ).to.be.revertedWith(
      "prophets should have same generation, rarity and race"
    );
  });

  it("should upgrade items", async function() {
    await this.orb.setGenerationId("1");
    await this.orb.mint(this.bob, 1, 10, "orb1", "2", "0", "0x");

    await this.magic.transfer(this.bob, "1000000000000000000000");
    await this.magic.approve(this.summoning.address, "1000000000000000000000", {
      from: this.bob,
    });

    await this.link.transfer(this.summoning.address, "50000000000000000000");

    const itemIds = [];

    for (let i = 0; i < 5; i++) {
      const tx = await this.summoning.summon(1, { from: this.bob });
      const requestId = tx.logs[0].args.requestID;

      const res = await this.vrfCoordinatorMock.callBackWithRandomness(
        requestId,
        "55555",
        this.summoning.address
      );
      const mintLog = res.receipt.rawLogs[1];

      expect(mintLog.topics[0]).to.equal(
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
      );
      expect(
        hre.ethers.BigNumber.from(mintLog.topics[2])
          .toString()
          .toLowerCase()
      ).to.be.eq(
        hre.ethers.BigNumber.from(this.bob)
          .toString()
          .toLowerCase()
      );

      const itemId = hre.ethers.BigNumber.from(mintLog.topics[3]);
      const itemData = await this.item.items(itemId);
      expect(itemData.generation.toString()).to.equal("1");
      expect(itemData.rarity.toString()).to.equal("0");
      expect(itemData.class.toString()).to.equal("1");
      expect(itemData.magicSource.toString()).to.equal("3");
      expect(itemData.itemType.toString()).to.equal("5");

      itemIds.push(itemId);
    }

    expect((await this.orb.balanceOf(this.bob, 1)).toString()).to.equal("5");

    const tx = await this.summoning.upgradeItem(itemIds, { from: this.bob });
    const requestId = tx.logs[0].args.requestID;

    const res = await this.vrfCoordinatorMock.callBackWithRandomness(
      requestId,
      "12345",
      this.summoning.address
    );
    const mintLog = res.receipt.rawLogs[10];
    const itemId = hre.ethers.BigNumber.from(mintLog.topics[3]);
    const itemData = await this.item.items(itemId);
    expect(itemData.generation.toString()).to.equal("1");
    expect(itemData.rarity.toString()).to.equal("1");
    expect(itemData.class.toString()).to.equal("1");
    expect(itemData.magicSource.toString()).to.equal("3");
    expect(itemData.itemType.toString()).to.equal("5");
  });

  it("should own items to upgrade", async function() {
    await this.orb.setGenerationId("1");
    await this.orb.mint(this.bob, 1, 10, "orb1", "2", "1", "0x");
    await this.orb.mint(this.carol, 2, 10, "orb2", "2", "1", "0x");

    await this.magic.transfer(this.bob, "1000000000000000000000");
    await this.magic.approve(this.summoning.address, "1000000000000000000000", {
      from: this.bob,
    });
    await this.magic.transfer(this.carol, "1000000000000000000000");
    await this.magic.approve(this.summoning.address, "1000000000000000000000", {
      from: this.carol,
    });

    await this.link.transfer(this.summoning.address, "50000000000000000000");

    const itemIds = [];

    for (let i = 0; i < 3; i++) {
      const tx = await this.summoning.summon(1, { from: this.bob });
      const requestId = tx.logs[0].args.requestID;

      const res = await this.vrfCoordinatorMock.callBackWithRandomness(
        requestId,
        "55555",
        this.summoning.address
      );
      const mintLog = res.receipt.rawLogs[1];

      expect(mintLog.topics[0]).to.equal(
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
      );
      expect(
        hre.ethers.BigNumber.from(mintLog.topics[2])
          .toString()
          .toLowerCase()
      ).to.be.eq(
        hre.ethers.BigNumber.from(this.bob)
          .toString()
          .toLowerCase()
      );

      const itemId = hre.ethers.BigNumber.from(mintLog.topics[3]);
      const itemData = await this.item.items(itemId);
      expect(itemData.generation.toString()).to.equal("1");
      expect(itemData.rarity.toString()).to.equal("1");
      expect(itemData.class.toString()).to.equal("1");
      expect(itemData.magicSource.toString()).to.equal("3");
      expect(itemData.itemType.toString()).to.equal("5");

      itemIds.push(itemId);
    }

    expect((await this.orb.balanceOf(this.bob, 1)).toString()).to.equal("7");

    for (let i = 0; i < 2; i++) {
      const tx = await this.summoning.summon(2, { from: this.carol });
      const requestId = tx.logs[0].args.requestID;

      const res = await this.vrfCoordinatorMock.callBackWithRandomness(
        requestId,
        "55555",
        this.summoning.address
      );
      const mintLog = res.receipt.rawLogs[1];

      expect(mintLog.topics[0]).to.equal(
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
      );
      expect(
        hre.ethers.BigNumber.from(mintLog.topics[2])
          .toString()
          .toLowerCase()
      ).to.be.eq(
        hre.ethers.BigNumber.from(this.carol)
          .toString()
          .toLowerCase()
      );

      const itemId = hre.ethers.BigNumber.from(mintLog.topics[3]);
      const itemData = await this.item.items(itemId);
      expect(itemData.generation.toString()).to.equal("1");
      expect(itemData.rarity.toString()).to.equal("1");
      expect(itemData.class.toString()).to.equal("1");
      expect(itemData.magicSource.toString()).to.equal("3");
      expect(itemData.itemType.toString()).to.equal("5");

      itemIds.push(itemId);
    }

    expect((await this.orb.balanceOf(this.carol, 2)).toString()).to.equal("8");

    await expect(
      this.summoning.upgradeItem(itemIds, { from: this.bob })
    ).to.be.revertedWith("not owning the items");
  });

  it("should not upgrade items with duplicate item id", async function() {
    await this.orb.setGenerationId("1");
    await this.orb.mint(this.bob, 1, 10, "orb1", "1", "0", "0x");

    await this.magic.transfer(this.bob, "1000000000000000000000");
    await this.magic.approve(this.summoning.address, "1000000000000000000000", {
      from: this.bob,
    });

    await this.link.transfer(this.summoning.address, "50000000000000000000");

    const itemIds = [];

    for (let i = 0; i < 4; i++) {
      const tx = await this.summoning.summon(1, { from: this.bob });
      const requestId = tx.logs[0].args.requestID;

      const res = await this.vrfCoordinatorMock.callBackWithRandomness(
        requestId,
        "55555",
        this.summoning.address
      );
      const mintLog = res.receipt.rawLogs[1];

      expect(mintLog.topics[0]).to.equal(
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
      );
      expect(
        hre.ethers.BigNumber.from(mintLog.topics[2])
          .toString()
          .toLowerCase()
      ).to.be.eq(
        hre.ethers.BigNumber.from(this.bob)
          .toString()
          .toLowerCase()
      );

      const itemId = hre.ethers.BigNumber.from(mintLog.topics[3]);
      const itemData = await this.item.items(itemId);
      expect(itemData.generation.toString()).to.equal("1");
      expect(itemData.rarity.toString()).to.equal("0");
      expect(itemData.class.toString()).to.equal("0");
      expect(itemData.magicSource.toString()).to.equal("3");
      expect(itemData.itemType.toString()).to.equal("5");

      itemIds.push(itemId);
    }
    itemIds.push(itemIds[0]);

    expect((await this.orb.balanceOf(this.bob, 1)).toString()).to.equal("6");

    await expect(
      this.summoning.upgradeItem(itemIds, { from: this.bob })
    ).to.be.revertedWith("");
  });

  it("should not upgrade items with different generation", async function() {
    await this.magic.transfer(this.bob, "1000000000000000000000");
    await this.magic.approve(this.summoning.address, "1000000000000000000000", {
      from: this.bob,
    });
    await this.link.transfer(this.summoning.address, "50000000000000000000");

    const itemIds = [];

    await this.orb.setGenerationId("1");
    await this.orb.mint(this.bob, 1, 10, "orb1", "1", "0", "0x");

    for (let i = 0; i < 3; i++) {
      const tx = await this.summoning.summon(1, { from: this.bob });
      const requestId = tx.logs[0].args.requestID;

      const res = await this.vrfCoordinatorMock.callBackWithRandomness(
        requestId,
        "55555",
        this.summoning.address
      );
      const mintLog = res.receipt.rawLogs[1];

      expect(mintLog.topics[0]).to.equal(
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
      );
      expect(
        hre.ethers.BigNumber.from(mintLog.topics[2])
          .toString()
          .toLowerCase()
      ).to.be.eq(
        hre.ethers.BigNumber.from(this.bob)
          .toString()
          .toLowerCase()
      );

      const itemId = hre.ethers.BigNumber.from(mintLog.topics[3]);
      const itemData = await this.item.items(itemId);
      expect(itemData.generation.toString()).to.equal("1");
      expect(itemData.rarity.toString()).to.equal("0");
      expect(itemData.class.toString()).to.equal("0");
      expect(itemData.magicSource.toString()).to.equal("3");
      expect(itemData.itemType.toString()).to.equal("5");

      itemIds.push(itemId);
    }

    expect((await this.orb.balanceOf(this.bob, 1)).toString()).to.equal("7");

    await this.orb.setGenerationId("2");
    await this.summoning.updateNumRacePerGen("2", "4");
    await this.summoning.updateNumCharPerGen("2", "10");
    await this.summoning.updateNumMagicSourcePerGen("2", "4");
    await this.summoning.updateNumItemTypePerGen("2", "10");
    await this.orb.mint(this.bob, 2, 10, "orb2", "1", "0", "0x");

    for (let i = 0; i < 2; i++) {
      const tx = await this.summoning.summon(2, { from: this.bob });
      const requestId = tx.logs[0].args.requestID;

      const request = await this.summoning.summoningRequests(requestId);

      const res = await this.vrfCoordinatorMock.callBackWithRandomness(
        requestId,
        "55555",
        this.summoning.address
      );
      const mintLog = res.receipt.rawLogs[1];

      expect(mintLog.topics[0]).to.equal(
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
      );
      expect(
        hre.ethers.BigNumber.from(mintLog.topics[2])
          .toString()
          .toLowerCase()
      ).to.be.eq(
        hre.ethers.BigNumber.from(this.bob)
          .toString()
          .toLowerCase()
      );

      const itemId = hre.ethers.BigNumber.from(mintLog.topics[3]);
      const itemData = await this.item.items(itemId);
      expect(itemData.generation.toString()).to.equal("2");
      expect(itemData.rarity.toString()).to.equal("0");
      expect(itemData.class.toString()).to.equal("0");
      expect(itemData.magicSource.toString()).to.equal("3");
      expect(itemData.itemType.toString()).to.equal("5");

      itemIds.push(itemId);
    }

    expect((await this.orb.balanceOf(this.bob, 2)).toString()).to.equal("8");

    await expect(
      this.summoning.upgradeItem(itemIds, { from: this.bob })
    ).to.be.revertedWith("items should have same generation, rarity, class and magic source");
  });

  it("should not upgrade items with different rarity", async function() {
    await this.orb.setGenerationId("1");
    await this.orb.mint(this.bob, 1, 10, "orb1", "1", "0", "0x");
    await this.orb.mint(this.bob, 2, 10, "orb2", "1", "1", "0x");

    await this.magic.transfer(this.bob, "1000000000000000000000");
    await this.magic.approve(this.summoning.address, "1000000000000000000000", {
      from: this.bob,
    });

    await this.link.transfer(this.summoning.address, "50000000000000000000");

    const itemIds = [];

    for (let i = 0; i < 3; i++) {
      const tx = await this.summoning.summon(1, { from: this.bob });
      const requestId = tx.logs[0].args.requestID;

      const res = await this.vrfCoordinatorMock.callBackWithRandomness(
        requestId,
        "55555",
        this.summoning.address
      );
      const mintLog = res.receipt.rawLogs[1];

      expect(mintLog.topics[0]).to.equal(
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
      );
      expect(
        hre.ethers.BigNumber.from(mintLog.topics[2])
          .toString()
          .toLowerCase()
      ).to.be.eq(
        hre.ethers.BigNumber.from(this.bob)
          .toString()
          .toLowerCase()
      );

      const itemId = hre.ethers.BigNumber.from(mintLog.topics[3]);
      const itemData = await this.item.items(itemId);
      expect(itemData.generation.toString()).to.equal("1");
      expect(itemData.rarity.toString()).to.equal("0");
      expect(itemData.class.toString()).to.equal("0");
      expect(itemData.magicSource.toString()).to.equal("3");
      expect(itemData.itemType.toString()).to.equal("5");

      itemIds.push(itemId);
    }

    expect((await this.orb.balanceOf(this.bob, 1)).toString()).to.equal("7");

    for (let i = 0; i < 2; i++) {
      const tx = await this.summoning.summon(2, { from: this.bob });
      const requestId = tx.logs[0].args.requestID;

      const res = await this.vrfCoordinatorMock.callBackWithRandomness(
        requestId,
        "55555",
        this.summoning.address
      );
      const mintLog = res.receipt.rawLogs[1];

      expect(mintLog.topics[0]).to.equal(
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
      );
      expect(
        hre.ethers.BigNumber.from(mintLog.topics[2])
          .toString()
          .toLowerCase()
      ).to.be.eq(
        hre.ethers.BigNumber.from(this.bob)
          .toString()
          .toLowerCase()
      );

      const itemId = hre.ethers.BigNumber.from(mintLog.topics[3]);
      const itemData = await this.item.items(itemId);
      expect(itemData.generation.toString()).to.equal("1");
      expect(itemData.rarity.toString()).to.equal("1");
      expect(itemData.class.toString()).to.equal("0");
      expect(itemData.magicSource.toString()).to.equal("3");
      expect(itemData.itemType.toString()).to.equal("5");

      itemIds.push(itemId);
    }

    expect((await this.orb.balanceOf(this.bob, 2)).toString()).to.equal("8");

    await expect(
      this.summoning.upgradeItem(itemIds, { from: this.bob })
    ).to.be.revertedWith("items should have same generation, rarity, class and magic source");
  });

  it("should not upgrade items with different class", async function() {
    await this.orb.setGenerationId("1");
    await this.orb.mint(this.bob, 1, 10, "orb1", "1", "0", "0x");
    await this.orb.mint(this.bob, 2, 10, "orb2", "2", "0", "0x");

    await this.magic.transfer(this.bob, "1000000000000000000000");
    await this.magic.approve(this.summoning.address, "1000000000000000000000", {
      from: this.bob,
    });

    await this.link.transfer(this.summoning.address, "50000000000000000000");

    const itemIds = [];

    for (let i = 0; i < 3; i++) {
      const tx = await this.summoning.summon(1, { from: this.bob });
      const requestId = tx.logs[0].args.requestID;

      const res = await this.vrfCoordinatorMock.callBackWithRandomness(
        requestId,
        "33333",
        this.summoning.address
      );
      const mintLog = res.receipt.rawLogs[1];

      expect(mintLog.topics[0]).to.equal(
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
      );
      expect(
        hre.ethers.BigNumber.from(mintLog.topics[2])
          .toString()
          .toLowerCase()
      ).to.be.eq(
        hre.ethers.BigNumber.from(this.bob)
          .toString()
          .toLowerCase()
      );

      const itemId = hre.ethers.BigNumber.from(mintLog.topics[3]);
      const itemData = await this.item.items(itemId);
      expect(itemData.generation.toString()).to.equal("1");
      expect(itemData.rarity.toString()).to.equal("0");
      expect(itemData.class.toString()).to.equal("0");
      expect(itemData.magicSource.toString()).to.equal("1");
      expect(itemData.itemType.toString()).to.equal("3");

      itemIds.push(itemId);
    }

    expect((await this.orb.balanceOf(this.bob, 1)).toString()).to.equal("7");

    for (let i = 0; i < 2; i++) {
      const tx = await this.summoning.summon(2, { from: this.bob });
      const requestId = tx.logs[0].args.requestID;

      const res = await this.vrfCoordinatorMock.callBackWithRandomness(
        requestId,
        "33333",
        this.summoning.address
      );
      const mintLog = res.receipt.rawLogs[1];

      expect(mintLog.topics[0]).to.equal(
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
      );
      expect(
        hre.ethers.BigNumber.from(mintLog.topics[2])
          .toString()
          .toLowerCase()
      ).to.be.eq(
        hre.ethers.BigNumber.from(this.bob)
          .toString()
          .toLowerCase()
      );

      const itemId = hre.ethers.BigNumber.from(mintLog.topics[3]);
      const itemData = await this.item.items(itemId);
      expect(itemData.generation.toString()).to.equal("1");
      expect(itemData.rarity.toString()).to.equal("0");
      expect(itemData.class.toString()).to.equal("1");
      expect(itemData.magicSource.toString()).to.equal("1");
      expect(itemData.itemType.toString()).to.equal("3");

      itemIds.push(itemId);
    }

    expect((await this.orb.balanceOf(this.bob, 2)).toString()).to.equal("8");

    await expect(
      this.summoning.upgradeItem(itemIds, { from: this.bob })
    ).to.be.revertedWith("items should have same generation, rarity, class and magic source");
  });

  it("should not upgrade items with different magic source", async function() {
    await this.orb.setGenerationId("1");
    await this.orb.mint(this.bob, 1, 10, "orb1", "1", "0", "0x");
    await this.orb.mint(this.bob, 2, 10, "orb2", "1", "0", "0x");

    await this.magic.transfer(this.bob, "1000000000000000000000");
    await this.magic.approve(this.summoning.address, "1000000000000000000000", {
      from: this.bob,
    });

    await this.link.transfer(this.summoning.address, "50000000000000000000");

    const itemIds = [];

    for (let i = 0; i < 3; i++) {
      const tx = await this.summoning.summon(1, { from: this.bob });
      const requestId = tx.logs[0].args.requestID;

      const res = await this.vrfCoordinatorMock.callBackWithRandomness(
        requestId,
        "33333",
        this.summoning.address
      );
      const mintLog = res.receipt.rawLogs[1];

      expect(mintLog.topics[0]).to.equal(
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
      );
      expect(
        hre.ethers.BigNumber.from(mintLog.topics[2])
          .toString()
          .toLowerCase()
      ).to.be.eq(
        hre.ethers.BigNumber.from(this.bob)
          .toString()
          .toLowerCase()
      );

      const itemId = hre.ethers.BigNumber.from(mintLog.topics[3]);
      const itemData = await this.item.items(itemId);
      expect(itemData.generation.toString()).to.equal("1");
      expect(itemData.rarity.toString()).to.equal("0");
      expect(itemData.class.toString()).to.equal("0");
      expect(itemData.magicSource.toString()).to.equal("1");
      expect(itemData.itemType.toString()).to.equal("3");

      itemIds.push(itemId);
    }

    expect((await this.orb.balanceOf(this.bob, 1)).toString()).to.equal("7");

    for (let i = 0; i < 2; i++) {
      const tx = await this.summoning.summon(2, { from: this.bob });
      const requestId = tx.logs[0].args.requestID;

      const res = await this.vrfCoordinatorMock.callBackWithRandomness(
        requestId,
        "33334",
        this.summoning.address
      );
      const mintLog = res.receipt.rawLogs[1];

      expect(mintLog.topics[0]).to.equal(
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
      );
      expect(
        hre.ethers.BigNumber.from(mintLog.topics[2])
          .toString()
          .toLowerCase()
      ).to.be.eq(
        hre.ethers.BigNumber.from(this.bob)
          .toString()
          .toLowerCase()
      );

      const itemId = hre.ethers.BigNumber.from(mintLog.topics[3]);
      const itemData = await this.item.items(itemId);
      expect(itemData.generation.toString()).to.equal("1");
      expect(itemData.rarity.toString()).to.equal("0");
      expect(itemData.class.toString()).to.equal("0");
      expect(itemData.magicSource.toString()).to.equal("2");
      expect(itemData.itemType.toString()).to.equal("4");

      itemIds.push(itemId);
    }

    expect((await this.orb.balanceOf(this.bob, 2)).toString()).to.equal("8");

    await expect(
      this.summoning.upgradeItem(itemIds, { from: this.bob })
    ).to.be.revertedWith("items should have same generation, rarity, class and magic source");
  });
});
