const CryptoPropheciesToken = artifacts.require("TCP");

module.exports = function (deployer, network, accounts) {
  deployer.deploy(CryptoPropheciesToken, "250000000000000000000000000");
};