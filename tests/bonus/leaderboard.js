const { expect } = require("chai");

const LeaderboardPrize = hre.artifacts.require("LeaderboardPrize");
const TCP = hre.artifacts.require("TCP");

describe("Leaderboard Prize Contract Tests", function () {
  beforeEach(async function () {
    const [admin, winner1, winner2, winner3, winner4, winner5] = await web3.eth.getAccounts();
    this.admin = admin;
    this.winner1 = winner1;
    this.winner2 = winner2;
    this.winner3 = winner3;
    this.winner4 = winner4;
    this.winner5 = winner5;

    this.tcp = await TCP.new("10000000000000000000000");
    await this.tcp.mint();

    this.leaderboardPrize = await LeaderboardPrize.new(
      this.admin,
      this.tcp.address
    );

    await this.tcp.approve(this.leaderboardPrize.address, "10000000000000000000000");
  });

  it("should not finalize competition", async function () {
    await expect(this.leaderboardPrize.finalizeCompetition([], [])).to.be.revertedWith("invalid data");

    const winners = [this.winner1, this.winner2, this.winner3];
    const prizes = ['2000000000000000000000', '1500000000000000000000', '1000000000000000000000'];

    await expect(this.leaderboardPrize.finalizeCompetition(winners, prizes.slice(0, prizes.length - 1))).to.be.revertedWith("invalid data");

    await expect(this.leaderboardPrize.finalizeCompetition([this.winner1, this.winner2, this.winner1], prizes)).to.be.revertedWith("duplicate winner");

    await this.leaderboardPrize.finalizeCompetition(winners, prizes);
  });

  it("should finalize competition", async function () {
    const winners = [this.winner1, this.winner2, this.winner3];
    const prizes = ['2000000000000000000000', '1500000000000000000000', '1000000000000000000000'];
    await this.leaderboardPrize.finalizeCompetition(winners, prizes);

    const numCompetitions = await this.leaderboardPrize.numCompetitions();
    expect(numCompetitions.toString()).to.be.eq("1");

    const info = await this.leaderboardPrize.getCompetitionInfo(0);
    const _winners = info[0];
    const _prizes = info[1];
    expect(_winners.length).to.be.eq(winners.length);
    expect(_prizes.length).to.be.eq(prizes.length);

    for (let i = 0; i < winners.length; i++) {
      expect(_winners[i]).to.be.eq(winners[i]);
      expect(_prizes[i].toString()).to.be.eq(prizes[i]);
    }
  });

  it("should claim prize for winners", async function () {
    const winners = [this.winner1, this.winner2, this.winner3];
    const prizes = ['2000000000000000000000', '1500000000000000000000', '1000000000000000000000'];
    await this.leaderboardPrize.finalizeCompetition(winners, prizes);

    for (let i = 0; i < winners.length; i++) {
      await this.leaderboardPrize.claimPrize(0, { from: winners[i] });

      const balance = await this.tcp.balanceOf(winners[i]);
      expect(balance.toString()).to.be.eq(prizes[i]);
    }
  });

  it("should not claim prize for non-winners", async function () {
    const winners = [this.winner1, this.winner2, this.winner3];
    const prizes = ['2000000000000000000000', '1500000000000000000000', '1000000000000000000000'];
    await this.leaderboardPrize.finalizeCompetition(winners, prizes);

    await expect(this.leaderboardPrize.claimPrize(0, { from: this.winner4 })).to.be.revertedWith("not winner");
  });

  it("should not claim prize twice", async function () {
    const winners = [this.winner1, this.winner2, this.winner3];
    const prizes = ['2000000000000000000000', '1500000000000000000000', '1000000000000000000000'];
    await this.leaderboardPrize.finalizeCompetition(winners, prizes);

    await this.leaderboardPrize.claimPrize(0, { from: winners[0] });
    await expect(this.leaderboardPrize.claimPrize(0, { from: winners[0] })).to.be.revertedWith("already claimed");
  });
});
