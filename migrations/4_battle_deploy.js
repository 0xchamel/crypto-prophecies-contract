const Battle = artifacts.require("Battle");
const TCP = artifacts.require("TCP");
module.exports = async function (deployer, network, accounts) {
  deployer.deploy(Battle, TCP.address);
};