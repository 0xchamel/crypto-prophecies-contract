const { expectRevert, time } = require("@openzeppelin/test-helpers");
const { equal } = require("chai");
const hre = require("hardhat");
const { web3: any } = require("hardhat");
const OrbArt = hre.artifacts.require("Orb");

describe("Orb Contract", function() {
    before("Deploy contract", async function() {
        const [alice, bob, carol, rewardHolder] = await web3.eth.getAccounts();
        this.alice = alice;
        this.bob = bob;
        this.carol = carol;
        this.rewardHolder = rewardHolder;

        this.Orb = await OrbArt.new();
        await this.Orb.initialize("ipfs.io/", { from: this.alice });
    });

    beforeEach(async function() {
        //
    });

    it("test minter permissions", async function() {
        await this.Orb.setMinter(this.bob, true, { from: this.alice });
        const isMinter = await this.Orb.isMinter(this.bob);

        expect(isMinter).to.equal(true);
        await expectRevert(
            this.Orb.setMinter(this.carol, false, {
                from: this.bob,
            }),
            "Ownable: caller is not the owner"
        );
        await expectRevert(
            this.Orb.mint(this.carol, 1, 2, "1234", 0, 0, "0x00", {
                from: this.carol,
            }),
            "Invalid minter"
        );
    });

    it("test burner permissions", async function() {
        await this.Orb.setBurner(this.bob, true, { from: this.alice });
        const isBurner = await this.Orb.isBurner(this.bob);

        expect(isBurner).to.equal(true);
        await expectRevert(
            this.Orb.setBurner(this.carol, false, {
                from: this.bob,
            }),
            "Ownable: caller is not the owner"
        );
        await expectRevert(
            this.Orb.burn(this.carol, 1, 2, {
                from: this.carol,
            }),
            "Invalid burner"
        );
    });

    it("generation", async function() {
        expect((await this.Orb.orbGenId()).toString()).to.equal("0");

        await this.Orb.setGenerationId(1, { from: this.alice });
        expect((await this.Orb.orbGenId()).toString()).to.equal("1");
        await expectRevert(
            this.Orb.setGenerationId(0, { from: this.alice }),
            "invalid generation id"
        );
    });

    it("should be set the correct values after setRarity", async function() {
        await this.Orb.setRarity(4, 0, 5, 495, 1000, 8500, {
            from: this.alice,
        });

        const legendaryRarity = await this.Orb.rarities(4);
        expect(legendaryRarity.common.toString()).to.equal("0");
        expect(legendaryRarity.uncommon.toString()).to.equal("5");
        expect(legendaryRarity.rare.toString()).to.equal("495");
        expect(legendaryRarity.epic.toString()).to.equal("1000");
        expect(legendaryRarity.legendary.toString()).to.equal("8500");

        await expectRevert(
            this.Orb.setRarity(1, 9000, 800, 200, 0, 0, {
                from: this.bob,
            }),
            "Ownable: caller is not the owner"
        );
    });

    it("should be set the correct values after mint", async function() {
        await this.Orb.mint(this.bob, 10, 5, "test-token-uri", 0, 4, "0x00", {
            from: this.alice,
        });
        expect((await this.Orb.balanceOf(this.bob, 10)).toString()).to.equal(
            "5"
        );

        const orbInfo = await this.Orb.orbs(10);
        expect(orbInfo.orbType.toString()).to.equal("0");
        expect(orbInfo.orbRarity.toString()).to.equal("4");
        expect(orbInfo.generation.toString()).to.equal("1");

        const legendaryRarity = await this.Orb.rarities(4);
        expect(legendaryRarity.common.toString()).to.equal("0");
        expect(legendaryRarity.uncommon.toString()).to.equal("5");
        expect(legendaryRarity.rare.toString()).to.equal("495");
        expect(legendaryRarity.epic.toString()).to.equal("1000");
        expect(legendaryRarity.legendary.toString()).to.equal("8500");

        expect(await this.Orb.tokenURI(10), "test-token-uri");
        expect((await this.Orb.supply(10)).toString(), "5");
    });
});
