import { BigNumber, Contract, ContractFactory } from "ethers";
// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

const delay = (ms: any) => new Promise((res: any) => setTimeout(res, ms));

async function deploy() {
    const tcpTokenAddress = "0x032f85b8fbf8540a92b986d953e4c3a61c76d39e";
    const shopRewardAddress = "0x3Aaa03BF2e6a3a5D64FC75868211174527f841E6";
    const dj = "0x83ea75EDf03c892663F3D69b0b7D603C23922DEF";
    const Orb: ContractFactory = await ethers.getContractFactory("Orb");
    const orb: Contract = await Orb.deploy();
    console.log("Orb token was deployed to: ", orb.address);

    const Shop: ContractFactory = await ethers.getContractFactory("Shop");
    const shop: Contract = await Shop.deploy(shopRewardAddress, tcpTokenAddress, 1633957850);
    console.log("Shop was deployed to: ", shop.address);

    // await console.log(1);
    // await orb.initialize("");
    // console.log(2);
    // await orb.setGenerationId(1);

    // console.log(3);
    // await orb.setRarity(0, 9000, 800, 200, 0, 0);
    // await orb.setRarity(1, 945, 8500, 300, 250, 5);
    // await orb.setRarity(2, 100, 950, 8500, 400, 50);
    // await orb.setRarity(3, 50, 300, 1000, 8250, 400);
    // await orb.setRarity(4, 0, 5, 495, 1000, 8500);

    // console.log(3);
    // await orb.mint(dj, 111, 96040, 0, 0, "0x00");
    // await orb.mint(dj, 121, 13720, 0, 1, "0x00");
    // await orb.mint(dj, 131, 1960, 0, 2, "0x00");
    // await orb.mint(dj, 141, 280, 0, 3, "0x00");
    // await orb.mint(dj, 151, 40, 0, 4, "0x00");

    // console.log(3);
    // await orb.mint(dj, 112, 51840, 1, 0, "0x00");
    // await orb.mint(dj, 122, 8640, 1, 1, "0x00");
    // await orb.mint(dj, 132, 1440, 1, 2, "0x00");
    // await orb.mint(dj, 142, 240, 1, 3, "0x00");
    // await orb.mint(dj, 152, 40, 1, 4, "0x00");

    // console.log(3);
    // await orb.mint(dj, 113, 51840, 2, 0, "0x00");
    // await orb.mint(dj, 123, 8640, 2, 1, "0x00");
    // await orb.mint(dj, 133, 1440, 2, 2, "0x00");
    // await orb.mint(dj, 143, 240, 2, 3, "0x00");
    // await orb.mint(dj, 153, 40, 2, 4, "0x00");

    // console.log(3);
    // await orb.mint(dj, 114, 51840, 3, 0, "0x00");
    // await orb.mint(dj, 124, 8640, 3, 1, "0x00");
    // await orb.mint(dj, 134, 1440, 3, 2, "0x00");
    // await orb.mint(dj, 144, 240, 3, 3, "0x00");
    // await orb.mint(dj, 154, 40, 3, 4, "0x00");

    // console.log(3);
    // await orb.mint(dj, 115, 51840, 4, 0, "0x00");
    // await orb.mint(dj, 125, 8640, 4, 1, "0x00");
    // await orb.mint(dj, 135, 1440, 4, 2, "0x00");
    // await orb.mint(dj, 145, 240, 4, 3, "0x00");
    // await orb.mint(dj, 155, 40, 4, 4, "0x00");

    // console.log(4);
    // await orb.setApprovalForAll(shop.address, true);

    // console.log(5);
    // await shop.createItem(orb.address, 111, 19208, 20, "50000000000000000000", {
    //     gasPrice: 32e9,
    // });
    // await shop.createItem(orb.address, 121, 2744, 10, "275000000000000000000", {
    //     gasPrice: 32e9,
    // });
    // await shop.createItem(orb.address, 131, 392, 5, "1513000000000000000000", {
    //     gasPrice: 32e9,
    // });
    // await shop.createItem(orb.address, 141, 56, 2, "8319000000000000000000", {
    //     gasPrice: 32e9,
    // });
    // await shop.createItem(orb.address, 151, 8, 1, "45753000000000000000000", {
    //     gasPrice: 32e9,
    // });

    // console.log(5);
    // await shop.createItem(orb.address, 112, 10368, 20, "35000000000000000000", {
    //     gasPrice: 32e9,
    // });
    // await shop.createItem(orb.address, 122, 1728, 10, "193000000000000000000", {
    //     gasPrice: 32e9,
    // });
    // await shop.createItem(orb.address, 132, 288, 5, "1059000000000000000000", {
    //     gasPrice: 32e9,
    // });
    // await shop.createItem(orb.address, 142, 48, 2, "5823000000000000000000", {
    //     gasPrice: 32e9,
    // });
    // await shop.createItem(orb.address, 152, 8, 1, "32027000000000000000000", {
    //     gasPrice: 32e9,
    // });

    // console.log(5);
    // await shop.createItem(orb.address, 113, 10368, 20, "40000000000000000000", {
    //     gasPrice: 32e9,
    // });
    // await shop.createItem(orb.address, 123, 1728, 10, "220000000000000000000", {
    //     gasPrice: 32e9,
    // });
    // await shop.createItem(orb.address, 133, 288, 5, "1210000000000000000000", {
    //     gasPrice: 32e9,
    // });
    // await shop.createItem(orb.address, 143, 48, 2, "6655000000000000000000", {
    //     gasPrice: 32e9,
    // });
    // await shop.createItem(orb.address, 153, 8, 1, "36603000000000000000000", {
    //     gasPrice: 32e9,
    // });

    // console.log(5);
    // await shop.createItem(orb.address, 114, 10368, 15, "50000000000000000000", {
    //     gasPrice: 32e9,
    // });
    // await shop.createItem(orb.address, 124, 1728, 10, "275000000000000000000", {
    //     gasPrice: 32e9,
    // });
    // await shop.createItem(orb.address, 134, 288, 5, "1513000000000000000000", {
    //     gasPrice: 32e9,
    // });
    // await shop.createItem(orb.address, 144, 48, 2, "8319000000000000000000", {
    //     gasPrice: 32e9,
    // });
    // await shop.createItem(orb.address, 154, 8, 1, "45753000000000000000000", {
    //     gasPrice: 32e9,
    // });

    // console.log(5);
    // await shop.createItem(orb.address, 115, 10368, 15, "60000000000000000000", {
    //     gasPrice: 32e9,
    // });
    // await shop.createItem(orb.address, 125, 1728, 10, "330000000000000000000", {
    //     gasPrice: 32e9,
    // });
    // await shop.createItem(orb.address, 135, 288, 5, "1815000000000000000000", {
    //     gasPrice: 32e9,
    // });
    // await shop.createItem(orb.address, 145, 48, 2, "9983000000000000000000", {
    //     gasPrice: 32e9,
    // });
    // await shop.createItem(orb.address, 155, 8, 1, "54904000000000000000000", {
    //     gasPrice: 32e9,
    // });
}

async function main(): Promise<void> {
    await deploy();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error: Error) => {
        console.error(error);
        process.exit(1);
    });
