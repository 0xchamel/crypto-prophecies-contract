import { Contract, ContractFactory } from "ethers";
// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
import args from "../arguments/summoning";

async function deploy() {
  // Deploy summoning contract
  const Summoning: ContractFactory = await ethers.getContractFactory(
    "Summoning"
  );
  const summoning: Contract = await Summoning.deploy(...args);
  console.log("Summoning was deployed to: ", summoning.address);
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
