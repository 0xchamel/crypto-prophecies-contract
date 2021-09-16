const { expectRevert, time } = require("@openzeppelin/test-helpers");
const { equal } = require("chai");
const hre = require("hardhat");
const { web3: any } = require("hardhat");
const TCPArt = hre.artifacts.require("TCP");
const OrbArt = hre.artifacts.require("Orb");
const ShopArt = hre.artifacts.require("Shop");

describe("Shop Contract", function() {
    before("Deploy contract", async function() {
        const [alice, bob, carol, rewardHolder] = await web3.eth.getAccounts();
        this.alice = alice;
        this.bob = bob;
        this.carol = carol;
        this.rewardHolder = rewardHolder;

        this.Orb = await OrbArt.new();
        await this.Orb.initialize("ipfs.io/", { from: this.alice });

        this.TCP = await TCPArt.new("10000000000000000000000");
        await this.TCP.mint();

        this.startTime = Math.floor(new Date().getTime() / 1000);
        this.Shop = await ShopArt.new(
            this.rewardHolder,
            this.TCP.address,
            this.startTime
        );
    });

    beforeEach(async function() {
        //
    });

    it("should set correct state variables", async function() {
        expect(await this.Shop.tcpToken()).to.equal(this.TCP.address);
        expect(await this.Shop.isPaused()).to.equal(false);
        expect((await this.Shop.startTime()).toString()).to.equal(
            String(this.startTime)
        );
        expect(await this.Shop.rewardAddress()).to.equal(this.rewardHolder);
    });

    it("test createItem function", async function() {
        await this.Orb.mint(this.alice, 10, 5, "test-token-uri", 0, 0, "0x00", {
            from: this.alice,
        });
        await this.Orb.setApprovalForAll(this.Shop.address, true, {
            from: this.alice,
        });
        await this.Shop.createItem(this.Orb.address, 10, 5, 3, 100, {
            from: this.alice,
        });

        const itemInfo = await this.Shop.getItem(this.Orb.address, 10);
        expect(itemInfo._initialized).to.equal(true);
        expect(itemInfo._owner).to.equal(this.alice);
        expect(itemInfo._amount.toString()).to.equal("5");
        expect(itemInfo._limit.toString()).to.equal("3");
        expect(itemInfo._price.toString()).to.equal("100");

        await expectRevert(
            this.Shop.createItem(this.Orb.address, 10, 5, 3, 100, {
                from: this.bob,
            }),
            "Ownable: caller is not the owner"
        );
    });

    it("test updateItem functions", async function() {
        await this.Shop.updateItemPrice(this.Orb.address, 10, 200, {
            from: this.alice,
        });
        await this.Shop.updateItemAmount(this.Orb.address, 10, 4, {
            from: this.alice,
        });
        await this.Shop.updateItemLimit(this.Orb.address, 10, 2, {
            from: this.alice,
        });

        const itemInfo = await this.Shop.getItem(this.Orb.address, 10);
        expect(itemInfo._initialized).to.equal(true);
        expect(itemInfo._owner).to.equal(this.alice);
        expect(itemInfo._amount.toString()).to.equal("4");
        expect(itemInfo._limit.toString()).to.equal("2");
        expect(itemInfo._price.toString()).to.equal("200");
    });

    it("test updateRewardAddress", async function() {
        await expectRevert(
            this.Shop.updateRewardAddress(this.bob, {
                from: this.bob,
            }),
            "Ownable: caller is not the owner"
        );
    });

    it("test updateStartTime", async function() {
        await expectRevert(
            this.Shop.updateStartTime(1000, {
                from: this.bob,
            }),
            "Ownable: caller is not the owner"
        );
        await expectRevert(
            this.Shop.updateStartTime(1000, {
                from: this.alice,
            }),
            "invalid start time"
        );
    });

    it("test purchase workflow", async function() {
        await this.TCP.transfer(this.carol, 2000);
        await this.TCP.approve(this.Shop.address, 2000, { from: this.carol });
        const itemInfo = await this.Shop.getItem(this.Orb.address, 10);
        await this.Shop.purchase(this.Orb.address, 10, 2, { from: this.carol });

        expect((await this.TCP.balanceOf(this.carol)).toString()).to.equal(
            "1600"
        );
        expect((await this.Orb.balanceOf(this.carol, 10)).toString()).to.equal(
            "2"
        );
        await expectRevert(
            this.Shop.purchase(this.Orb.address, 10, 2, { from: this.carol }),
            "purchase: User limit exceeded"
        );
    });

    it("test cancelItem", async function() {
        await this.Shop.cancelItem(this.Orb.address, 10);

        const itemInfo = await this.Shop.getItem(this.Orb.address, 10);
        expect(itemInfo._initialized).to.equal(false);
        expect(itemInfo._owner).to.equal(
            "0x0000000000000000000000000000000000000000"
        );
        expect(itemInfo._amount.toString()).to.equal("0");
        expect(itemInfo._limit.toString()).to.equal("0");
        expect(itemInfo._price.toString()).to.equal("0");
    });

    it("test multiple drops", async function() {
        expect(
            (await this.Shop.userLimits(0, this.carol, 10)).toString()
        ).to.equal("2");

        await this.Shop.startNewDrop(
            Math.floor((new Date().getTime() + 100) / 1000)
        );
        expect((await this.Shop.dropNo()).toString()).to.equal("1");
        expect(
            (await this.Shop.userLimits(1, this.carol, 10)).toString()
        ).to.equal("0");
    });

    it("test paused", async function() {
        await this.Shop.toggleIsPaused();

        await expectRevert(
            this.Shop.purchase(this.Orb.address, 10, 2, { from: this.carol }),
            "already paused"
        );
    });
});
