const { expect } = require("chai");

const getCurrentBlockTimestamp = async () => {
  const blockNo = await hre.ethers.provider.getBlockNumber();
  const block = await hre.ethers.provider.getBlock(blockNo);
  return block.timestamp;
};

const Bonus = hre.artifacts.require("Bonus");
const BTCP = hre.artifacts.require("BTCP");

describe("Signup/Referral Bonus Contract", function () {
  beforeEach(async function () {
    const [owner, admin, treasury, user1, user2] = await web3.eth.getAccounts();
    this.owner = owner;
    this.admin = admin;
    this.treasury = treasury;
    this.user1 = user1;
    this.user2 = user2;

    const initialSupply = "10000000000000000000000";
    this.btcp = await BTCP.new(this.treasury, initialSupply);
    this.bonus = await Bonus.new(this.btcp.address, this.treasury, this.admin);

    await this.btcp.approve(this.bonus.address, initialSupply, { from: this.treasury });
    await this.btcp.allowSpend(this.bonus.address);
  });

  it("should claim signup bonus only once", async function () {
    const nonce = "123123";
    const bonusAmount = "200000000000000000000";
    const now = await getCurrentBlockTimestamp();
    const expireTimestamp = (now + 3600).toString();
    const bonusType = "0";
    const data = ethers.utils.solidityKeccak256(
      ["address", "address", "uint256", "uint256", "uint256", "uint8"],
      [
        this.bonus.address,
        this.user1,
        nonce,
        bonusAmount,
        expireTimestamp,
        bonusType
      ],
    );
    const sig = await web3.eth.sign(data, this.admin);

    await this.bonus.claimBonus(nonce, bonusAmount, expireTimestamp, bonusType, sig, { from: this.user1 });

    const balance = await this.btcp.balanceOf(this.user1);
    expect(balance.toString()).to.equal(bonusAmount);

    await expect(this.bonus.claimBonus(nonce, bonusAmount, expireTimestamp, bonusType, sig, { from: this.user1 })).to.be.revertedWith("already claimed");
  });

  it("should not claim other's bonus", async function () {
    const nonce = "123456";
    const bonusAmount = "200000000000000000000";
    const now = await getCurrentBlockTimestamp();
    const expireTimestamp = (now + 3600).toString();
    const bonusType = "0";
    const data = ethers.utils.solidityKeccak256(
      ["address", "address", "uint256", "uint256", "uint256", "uint8"],
      [
        this.bonus.address,
        this.user1,
        nonce,
        bonusAmount,
        expireTimestamp,
        bonusType
      ],
    );
    const sig = await web3.eth.sign(data, this.admin);

    await expect(this.bonus.claimBonus(nonce, bonusAmount, expireTimestamp, bonusType, sig, { from: this.user2 })).to.be.revertedWith("invalid sig");
  });

  it("should not claim expired bonus", async function () {
    const nonce = "123456";
    const bonusAmount = "200000000000000000000";
    const now = await getCurrentBlockTimestamp();
    const expireTimestamp = (now - 3600).toString();
    const bonusType = "0";
    const data = ethers.utils.solidityKeccak256(
      ["address", "address", "uint256", "uint256", "uint256", "uint8"],
      [
        this.bonus.address,
        this.user1,
        nonce,
        bonusAmount,
        expireTimestamp,
        bonusType
      ],
    );
    const sig = await web3.eth.sign(data, this.admin);

    await expect(this.bonus.claimBonus(nonce, bonusAmount, expireTimestamp, bonusType, sig, { from: this.user1 })).to.be.revertedWith("bonus expired");
  });
});
