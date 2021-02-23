const CryptoPropheciesToken = artifacts.require("CPT");
module.exports = function (deployer, network, accounts) {
  deployer.deploy(CryptoPropheciesToken, "1000000000000000000000000");
};