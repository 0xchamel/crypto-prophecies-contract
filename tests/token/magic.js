const { expect } = require("chai");

const Magic = hre.artifacts.require("Magic");

describe("Magic Portion token", function() {
  beforeEach(async function() {
    const [alice, bob, carol] = await web3.eth.getAccounts();
    this.alice = alice;
    this.bob = bob;
    this.carol = carol;
  });

  it("should mint initial supply", async function() {
    const initialSupply = "10000000000000000000000";
    this.magic = await Magic.new(this.bob, initialSupply);

    const bobBalance = await this.magic.balanceOf(this.bob);
    expect(bobBalance.toString()).to.equal(initialSupply);
  });

  it("should be minted by minter", async function() {
    const initialSupply = "10000000000000000000000";
    this.magic = await Magic.new(this.bob, initialSupply);

    const mintAmount = "100000000000000000000";
    await expect(this.magic.mint(this.carol, mintAmount)).to.be.revertedWith("msg.sender should be minter");

    await this.magic.setMinter(this.alice, true);
    await this.magic.mint(this.carol, mintAmount);

    const carolBalance = await this.magic.balanceOf(this.carol);
    expect(carolBalance.toString()).to.equal(mintAmount);
  });
});
