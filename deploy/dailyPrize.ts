import { Contract, ContractFactory } from "ethers";
// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers, upgrades } from "hardhat";
import args from "../arguments/dailyPrize";

async function deploy() {
  const DailyPrize: ContractFactory = await ethers.getContractFactory("DailyPrize");
  // const contract = await upgrades.deployProxy(DailyPrize, args);
  // await upgrades.prepareUpgrade('0x8663BfdEFed1ea1C74F3816797D939a70127eBdF', DailyPrize);
  // const contract = await upgrades.upgradeProxy('0x76718848a80EC011d08444f9f1AC975DF399A301', DailyPrize);

  const contract: Contract = await DailyPrize.deploy(...args);
  await contract.deployed();
  console.log("DailyPrize deployed to: ", contract.address);
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
