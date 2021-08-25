const { expectRevert, time } = require("@openzeppelin/test-helpers");
const { equal } = require("chai");
const hre = require("hardhat");
const { web3: any } = require("hardhat");
const TCPArt = hre.artifacts.require("TCP");
const PoolFactoryArt = hre.artifacts.require("PoolFactory");
const PoolInitializableArt = hre.artifacts.require("PoolInitializable");

const unlockAccount = async (address: any) => {
    await hre.network.provider.send("hardhat_impersonateAccount", [address]);
    return hre.ethers.provider.getSigner(address);
};

describe("Vault", function() {
    before("Deploy contract", async function() {
        const [alice, bob, carol, rewardHolder] = await web3.eth.getAccounts();
        this.alice = alice;
        this.bob = bob;
        this.carol = carol;
        this.rewardHolder = rewardHolder;

        this.PoolFactory = await PoolFactoryArt.new();
        this.LP = await TCPArt.new("10000000000000000000000");
        this.RT = await TCPArt.new("10000000000000000000000");
        await this.LP.mint();
        await this.RT.mint();
        await this.PoolFactory.deployPool(
            this.LP.address,
            this.RT.address,
            this.rewardHolder,
            "10",
            "0",
            "100000000",
            this.alice
        );

        this.poolAddress = await this.PoolFactory.getPoolAddress(
            this.LP.address,
            this.RT.address,
            0
        );
        this.chef = await PoolInitializableArt.at(this.poolAddress);
    });

    beforeEach(async function() {
        //
    });

    it("should set correct state variables", async function() {
        const rewardToken = await this.chef.rewardToken();
        const stakeToken = await this.chef.stakedToken();
        const owner = await this.chef.owner();
        const rewardHolder = await this.chef.rewardHolder();
        const rewardPerBlock = await this.chef.rewardPerBlock();
        const poolFactory = await this.chef.POOL_FACTORY();

        expect(stakeToken).to.equal(this.LP.address);
        expect(rewardToken).to.equal(this.RT.address);
        expect(rewardHolder).to.equal(this.rewardHolder);
        expect(owner).to.equal(this.alice);
        expect(poolFactory).to.equal(this.PoolFactory.address);
        expect(rewardPerBlock.toString()).to.equal("10");
    });

    it("deposit/withdraw", async function() {
        await this.LP.transfer(this.bob, "1000");
        await this.RT.transfer(this.rewardHolder, "1000000");

        await this.RT.approve(this.chef.address, "1000000", {
            from: this.rewardHolder,
        });
        await this.LP.approve(this.chef.address, "100", { from: this.bob });
        await this.chef.deposit("20", { from: this.bob });
        await this.chef.deposit("40", { from: this.bob });

        await time.advanceBlock();
        assert.equal((await this.LP.balanceOf(this.bob)).toString(), "940");
        await this.chef.withdraw("10", { from: this.bob });
        assert.equal((await this.LP.balanceOf(this.bob)).toString(), "950");
        await this.chef.withdraw("50", { from: this.bob });
        assert.equal((await this.LP.balanceOf(this.bob)).toString(), "1000");
        const tmp = (await this.RT.balanceOf(this.bob)).toString();
        assert(Number(tmp) > 0);
    });

    it("emergency withdraw", async function() {
        await this.LP.transfer(this.carol, "1000");
        await this.LP.approve(this.chef.address, "100", { from: this.carol });

        await this.chef.deposit("20", { from: this.carol });
        await this.chef.deposit("40", { from: this.carol });

        await time.advanceBlock();
        const prevBal = (await this.RT.balanceOf(this.carol)).toString();
        assert.equal((await this.LP.balanceOf(this.carol)).toString(), "940");
        await this.chef.emergencyWithdraw({ from: this.carol });
        assert.equal((await this.RT.balanceOf(this.carol)).toString(), prevBal);
    });

    it("Update RewardPerBlock", async function() {
        await this.chef.updateRewardPerBlock("200");

        assert.equal((await this.chef.rewardPerBlock()).toString(), "200");
    });

    it("Update StartAndEndBlocks", async function() {
        const latestBlockNumber = await time.latestBlock();
        await this.chef.updateStartAndEndBlocks(
            latestBlockNumber + 100,
            latestBlockNumber + 10000
        );

        assert.equal(
            (await this.chef.startBlock()).toString(),
            latestBlockNumber + 100
        );
        assert.equal(
            (await this.chef.bonusEndBlock()).toString(),
            latestBlockNumber + 10000
        );
    });

    it("stopReward", async function() {
        const latestBlockNumber = await time.latestBlock();
        await this.chef.stopReward();

        assert.equal(
            (await this.chef.bonusEndBlock()).toString(),
            latestBlockNumber.toNumber() + 1
        );
    });
});
