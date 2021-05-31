const Battle = artifacts.require("Battle");
const TCP = artifacts.require("TCP");
module.exports = async function (deployer, network, accounts) {
  deployer.deploy(Battle, "0xfDB7d9400eA7Da71210883A313c0DF12AA1Beb4f");
};