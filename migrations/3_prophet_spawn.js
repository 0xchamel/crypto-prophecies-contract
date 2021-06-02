const Prophet = artifacts.require("ProphetV2");
module.exports = async function (deployer, network, accounts) {
  let NFTinstance = await Prophet.deployed();
  console.log(NFTinstance.address);
  let addresses = [
    // "0xA5403cECD0F4Ffd25B5b86BCF1d2b8FD5CF7474d", //sergey
    // "0xC0e364A5D5b6080E35a86aa20F61509bc418c875", //dennis
    // "0x3e0f78886d062440DC8DBe6787Db302A0fE90341", //adam
    // "0x834F2Ceb5C410A9C7F8206D37096ad0e30766D36", //Volo
    // "0x9dDf96E77cD37A1EE90e3934C615ab294328f23F", //Paul
    // "0xa07469269466bB05025DB99fDD79077347eb639c", //Phi
    // "0x9608d8154814b0124ceBbc29FdCbf51f4AbFa56A", //Gerald
    // "0xb8C71f2aa276F243B4BcfABFb51e77F00bf32eA7 ", //Hamza
    // "0x41120f8306ccFe31Fd3ab163090d97EE4260725B", //Stu
    // "0xa031F70EA3cA201194A7Fdeded5CEfc8cF739149", //Rini
    // "0x3e59A97DC8B5C0846E5a70562cb34a53b63f461a", //Ruth
    // "0xC3C85D774A094f3689bfAceCbEa7734024DbC64A", //LukasD
    // "0xEeee1Aa700e714F974DBbA3bb610853AE8f2B803", //Sue



    // "0x56a512BC271E9cb638E480954e2321009A6D5f4F",
    // "0xadda30c27f1e750ca8904dcfe2abba369808274b",
    // "0xd6C103d07697B4feCd4F104a131Ea9809Ec336fD",
    // "0xCe5600F9aC619677CA3E0853d1FdDd067919B3fd",
    // "0x2a8EefBDa9C321D577Fee6f3Db486919E26Cd14d",
    // "0xEE22BEdFFaF4A3FDbE7CE680F645e165336E3491",
    // "0xf8BeeE9Da85484a60b90939018E34124C78e24E6",
    // "0x0DC23e6cBB900971327226B23C5bcfF8804a75d7",
    // "0x5C24B7308637513f593b6E5005135186c85e9c11",
    // "0x70dDD0d55e4012E2D73CE3C64001e2C1147F231C",
    // "0x191447fAB0c5736380774CE5197e9Ccda7e835A2",
    // "0xdBa89F6Ad5F103980392F5abf45261b58783E77c",
    // "0xecD3CF60AC3EaDe5ab514f8Fb361d199535F77DE",
    // "0x0f288b2da04441bBF769514d56EEF46e38b3a5C4",
    // "0x75298D6Fd0757DaDcfE18a106023efa195F741e6",
    // "0x6CE7584865aC6016da445818412baE81cE8d18A2",
    // "0x78a020fC6fD236f3920a6BE62448a8288023A695",
    // "0xFE290d59a74B693200Ce0496BcfC5c5986e3cb13",
    // "0x9a75d4691C90Affa38241Ed30CddD1aAba32C917",
    // "0xE27B5CD2C2402c072af2Dd58Ec0DcfE457630086",
    // "0x901c4A1A7a8f1c914F7E9856E634CC57b374f771",
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