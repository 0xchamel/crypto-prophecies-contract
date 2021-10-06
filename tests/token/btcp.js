const { expect } = require("chai");

const BTCP = hre.artifacts.require("BTCP");

describe("BTCP token", function() {
  beforeEach(async function() {
    const [alice, bob, carol] = await web3.eth.getAccounts();
    this.alice = alice;
    this.bob = bob;
    this.carol = carol;
  });

  it("should mint initial supply", async function() {
    const initialSupply = "10000000000000000000000";
    this.btcp = await BTCP.new(this.bob, initialSupply);

    const bobBalance = await this.btcp.balanceOf(this.bob);
    expect(bobBalance.toString()).to.equal(initialSupply);
  });

  it("should not send between EOAs", async function() {
    const initialSupply = "10000000000000000000000";
    this.btcp = await BTCP.new(this.bob, initialSupply);

    await expect(
      this.btcp.transfer(this.alice, "100000", { from: this.bob })
    ).to.be.revertedWith("spender not allowed");
  });

  it("allowed spender should transfer tokens", async function() {
    const initialSupply = "10000000000000000000000";
    this.btcp = await BTCP.new(this.bob, initialSupply);

    await this.btcp.allowSpend(this.alice);

    const transferAmount = "1000000000000000000";
    await this.btcp.approve(this.alice, transferAmount, { from: this.bob });
    await this.btcp.transferFrom(this.bob, this.carol, transferAmount);

    const bobBalance = await this.btcp.balanceOf(this.bob);
    const carolBalance = await this.btcp.balanceOf(this.carol);
    expect(bobBalance.toString()).to.equal("9999000000000000000000");
    expect(carolBalance.toString()).to.equal(transferAmount);
  });
});
