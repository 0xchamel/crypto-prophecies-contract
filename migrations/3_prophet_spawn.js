const Prophet = artifacts.require("ProphetV2");
module.exports = async function (deployer, network, accounts) {
  let NFTinstance = await Prophet.deployed();
  let addresses = [
    "0xA5403cECD0F4Ffd25B5b86BCF1d2b8FD5CF7474d"
  ];
  //let NFTinstance = Prophet.deployed();
  for (let address of addresses) {
    await NFTinstance._createProphet(1, 4, 0, 0, address);
    await NFTinstance._createProphet(1, 4, 0, 1, address);
    await NFTinstance._createProphet(1, 4, 0, 2, address);
    await NFTinstance._createProphet(1, 4, 0, 3, address);
    await NFTinstance._createProphet(1, 4, 0, 4, address);
    await NFTinstance._createProphet(1, 4, 0, 5, address);
  }
  //_createProphet(uint16 generation, uint16 rarity, uint16 race, uint16 character, address destination)
};