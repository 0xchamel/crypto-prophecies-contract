import { Contract, ContractFactory } from "ethers";
// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

async function deploy() {
  // Deploy prophet nft
  const Prophet: ContractFactory = await ethers.getContractFactory("CryptoPropheciesProphet");
  const prophet: Contract = await Prophet.deploy("https://api.thecryptoprophecies.com/prophet/");
  console.log("Prophet was deployed to: ", prophet.address);
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
