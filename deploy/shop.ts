import { Contract, ContractFactory } from "ethers";
// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

async function deploy() {
    const Shop: ContractFactory = await ethers.getContractFactory("Shop");
    const shop: Contract = await Shop.deploy(
        "0x5a7863bf31CCd463389D25a3F0ADEdA826C1E287",
        "0xfdb7d9400ea7da71210883a313c0df12aa1beb4f",
        1633354964
    );
    console.log("Shop was deployed to: ", shop.address);
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
