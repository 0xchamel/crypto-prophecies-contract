const Prophet = artifacts.require("ProphetV2");
module.exports = async function (deployer, network, accounts) {
  let NFTinstance = await Prophet.deployed();
  console.log(NFTinstance.address);
  let addresses = [
    //"0xA5403cECD0F4Ffd25B5b86BCF1d2b8FD5CF7474d", //sergey
    "0xC0e364A5D5b6080E35a86aa20F61509bc418c875", //dennis
    "0x3e0f78886d062440DC8DBe6787Db302A0fE90341", //adam
    "0x834F2Ceb5C410A9C7F8206D37096ad0e30766D36", //Volo
    "0x9dDf96E77cD37A1EE90e3934C615ab294328f23F", //Paul
  ];
  //let NFTinstance = Prophet.deployed();
  for (let address of addresses) {
    console.log("Address: " + address);
    await NFTinstance._createProphet(1, 4, 0, 0, address);
    await NFTinstance._createProphet(1, 4, 0, 1, address);
    await NFTinstance._createProphet(1, 4, 0, 2, address);
    await NFTinstance._createProphet(1, 4, 0, 3, address);
    await NFTinstance._createProphet(1, 4, 0, 4, address);
    await NFTinstance._createProphet(1, 4, 0, 5, address);
    //TODO RANDOMISE ITEMS
  }
  //_createProphet(uint16 generation, uint16 rarity, uint16 race, uint16 character, address destination)
};