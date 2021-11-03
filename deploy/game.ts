import { Contract, ContractFactory } from "ethers";
// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

async function deploy() {
    // testnet
    const bTCP = "0x9c4dffb299a9e5f0d2141e3c6be44645e10427d8";
    const TCP = "0x032f85b8fbf8540a92b986d953e4c3a61c76d39e";
    const MPOT = "0x9ECb2e9b098b8254AE58c10E6343c382F4229260";
    const kfBurnAddress = "0xdA4A0a3a914D47406aAb73D31281423713f16fdC";
    const kfDailyPrizeAddress = "0xdA4A0a3a914D47406aAb73D31281423713f16fdC";
    const kfCustodyAddress = "0xdA4A0a3a914D47406aAb73D31281423713f16fdC";
    const ctDailyPrize = "0x54198c1a1334b873535a5c7902447812cfc41302";

    const Game: ContractFactory = await ethers.getContractFactory("CryptoPropheciesGame");
    const game: Contract = await Game.deploy(MPOT, TCP, kfBurnAddress, kfDailyPrizeAddress, kfCustodyAddress, ctDailyPrize);
    console.log("Game was deployed to: ", game.address);
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
