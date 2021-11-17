const { expect } = require("chai");

const DailyPrize = hre.artifacts.require("DailyPrize");
const TCP = hre.artifacts.require("TCP");

describe("Daily Prize Contract", function () {
  beforeEach(async function () {
    const [admin, mockGame] = await web3.eth.getAccounts();
    this.admin = admin;
    this.mockGame = mockGame;

    this.tcp = await TCP.new("10000000000000000000000");
    await this.tcp.mint();

    this.keyhash =
      "0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4";
    this.fee = "1000000000000000000";

    const MockLink = hre.artifacts.require("MockLink");
    this.link = await MockLink.new();
    const VRFCoordinatorMock = hre.artifacts.require("VRFCoordinatorMock");
    this.vrfCoordinatorMock = await VRFCoordinatorMock.new(this.link.address);

    this.dailyPrize = await DailyPrize.new(
      this.admin,
      this.tcp.address,
      this.vrfCoordinatorMock.address,
      this.link.address,
      this.keyhash,
      this.fee
    );
    await this.dailyPrize.updateGame(this.mockGame);

    await this.tcp.approve(this.dailyPrize.address, "10000000000000000000000");
  });

  it("should draw results", async function () {
    await this.link.transfer(this.dailyPrize.address, "2000000000000000000");

    const day = 19000;
    await network.provider.send("evm_setNextBlockTimestamp", [day * 60 * 60 * 24 + 100]);
    let i;
    const players = [];
    const numPlayers = 10000;
    let totalPrize = 0;
    console.log('Start generating players');
    for (i = 0; i < numPlayers; i++) {
      const player = hre.ethers.Wallet.createRandom();
      players.push(player.address);
      if ((i + 1) % 500 == 0) console.log(i + 1);
    }
    console.log('Done generating players');

    console.log('Adding tickets and prizes');
    for (i = 0; i < numPlayers; i++) {
      const tickets = Math.floor(Math.random() * 100) + 1;
      await this.dailyPrize.addTickets(players[i], tickets.toString(), { from: this.mockGame });
      const prize = Math.floor(Math.random() * 1000000000);
      totalPrize += prize;
      await this.dailyPrize.addPrize(prize.toString(), { from: this.mockGame });
      if ((i + 1) % 500 == 0) console.log(i + 1);
    }
    console.log('Added tickets and prizes');

    await network.provider.send("evm_setNextBlockTimestamp", [(day + 1) * 60 * 60 * 24 + 100]);
    const tx = await this.dailyPrize.draw(day);
    const requestId = tx.logs[0].args.requestID;

    await this.vrfCoordinatorMock.callBackWithRandomness(
      requestId,
      "123456",
      this.dailyPrize.address
    );

    const res = await this.dailyPrize.drawWinners(day);
    const mintLog = res.receipt.rawLogs[0];

    expect(mintLog.topics[0]).to.equal(
      "0x6196adb02480f16180a67631210ff82ca32f47fdd47e0241d38be76850ac6d90"
    );
    expect(
      hre.ethers.BigNumber.from(mintLog.topics[1])
        .toString()
    ).to.be.eq(
      hre.ethers.BigNumber.from(day.toString())
        .toString()
    );
  });
});
