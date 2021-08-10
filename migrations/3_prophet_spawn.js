const Prophet = artifacts.require("ProphetV2");
module.exports = async function (deployer, network, accounts) {
  let NFTinstance = await Prophet.deployed();
  console.log(NFTinstance.address);
  let addresses = [
    //TEAM
    // "0x009177f7a79142d77b19FCc106fbb72399593Ffb",// Vlad
    //  "0x5C88D9c2DfF52DB271E684c441ECF382eB645057",//Mo
    //  "0x6B0f2b332E13EC4c20B049b486DAaEb43efE5C0b",//Vicki
    //  "0xAdFff875deE58634C5da64409F78cd3CdC9c7736", //Bohdan
    // "0x834F2Ceb5C410A9C7F8206D37096ad0e30766D36", //Volo
    // "0x4767Fc87DBB485b0B7812167AC85eEC14398a882", //Volo Brave
    // "0x69e0C5F5061B864eba6FD5D602060F790b9E3716", //Volo Firefox
    // "0x9dDf96E77cD37A1EE90e3934C615ab294328f23F", //Paul
    // "0xa07469269466bB05025DB99fDD79077347eb639c", //Phi
    // "0x9608d8154814b0124ceBbc29FdCbf51f4AbFa56A", //Gerald
    // "0xb8C71f2aa276F243B4BcfABFb51e77F00bf32eA7 ", //Hamza
    // "0x41120f8306ccFe31Fd3ab163090d97EE4260725B", //Stu
    // "0xa031F70EA3cA201194A7Fdeded5CEfc8cF739149", //Rini
    // "0x3e59A97DC8B5C0846E5a70562cb34a53b63f461a", //Ruth
    // "0xC3C85D774A094f3689bfAceCbEa7734024DbC64A", //LukasD
    // "0xEeee1Aa700e714F974DBbA3bb610853AE8f2B803", //Sue
    // "0x34d77382Ddf3D9DB19b195e5D25771BD07dcC898", //Mauro
    // "0x28291D86a38b5448037cfa64611ef0009d3C42C0", //Chris
    // "0xe9a607Ea91e60C8107Ec89B5a363D043E95B91ab", //Micah
    // "0xF834D8c5F267a6E6D97008DDBdE41fD3409FB248", //Stefan


    //FIRST SET
    // "0x56a512BC271E9cb638E480954e2321009A6D5f4F",
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

    //SECOND SET
    // "0x8E8A0a425Bd00BE1cd29Ea374dC613292D496FD8",
    // "0xadda30c27f1e750ca8904dcfe2abba369808274b",
    // "0x99D1de1982C5C9834d7eFa5726460C8A092A88Cc",

    //THIRD SET
    // "0x1C124a43F38c3bbe09a8A07c4Ca301299Fc016Df",
    // "0x86f5259AFd904768786e2E4d4B54abAfa8A6E215",
    // "0xAaF8BA7f8964c12C843009b6a691369F86245Ab5",
    // "0x5831CCCA9c1F6e2c9890b0DF85b50B3536a60792",
    // "0xD2BAdfFf6cc8a84aB49AF622d876231C1846987A",
    // "0x46fd3dcd2E47d8093739F6e6FE401EF6fCC434f0",
    // "0xA8C3a4A3f89e1f1936476FAA314185A430B251ea",

    //FOURTH SET
    // "0xA8C3a4A3f89e1f1936476FAA314185A430B251ea",
    // "0x9aD1Acfefa4bB3e13D0dECb3F5247e64C520e9AD",
    // "0xCb12591976544d57c482F05dfBAb89eA898063ba",
    // "0xaFE4fC546108d24A5B9C76235188fb76888CC86a",
    // "0x7E8b3cC4A464bb77a6b6C6637cC0308B0B178A0C",
    // "0xb275B0bD0B9b4587DD28f9e6c8f77162D6FB3280",
    // "0x6eDac9C922f3fC17299760940861aB4fE3b19BbB",
    // "0x68e797AEd43F08f024Fe817D0B5777D3D09667b2",
    // "0x0304C96578E9449A847b7B95EB345aAaF5d76BA6",
    // "0xd9D1730A243B5e563b5238dbE4FD81427E6d5A94",


    //EXTRA
    // "0x8BA29Acbc17D043635CD98ABD5ebA7adB2c665D4",
    // "0xB800895394C34509978Af9Ee26A9B821Ac360C53",
    // "0x4276F21f9dE6f6Cccaa5C42D35D8252B5780326D",
  ];
  //let NFTinstance = Prophet.deployed();
  for (let address of addresses) {
    console.log("Address: " + address);

    //FIRST SET
    await NFTinstance._createProphet(1, 4, 0, 0, address);
    await NFTinstance._createProphet(1, 4, 0, 1, address);
    await NFTinstance._createProphet(1, 4, 0, 2, address);
    await NFTinstance._createProphet(1, 4, 0, 3, address);
    await NFTinstance._createProphet(1, 4, 0, 4, address);
    await NFTinstance._createProphet(1, 4, 0, 5, address);

    //SECOND SET
    await NFTinstance._createProphet(1, 4, 1, 0, address);
    await NFTinstance._createProphet(1, 4, 1, 1, address);
    await NFTinstance._createProphet(1, 4, 1, 2, address);

    //TODO RANDOMISE ITEMS
  }
  //_createProphet(uint16 generation, uint16 rarity, uint16 race, uint16 character, address destination)
};