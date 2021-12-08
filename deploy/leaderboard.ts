import { Contract, ContractFactory } from "ethers";
// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers, upgrades } from "hardhat";

async function deploy() {
  const LeaderboardPrize: ContractFactory = await ethers.getContractFactory("LeaderboardPrize");

  // testnet
  const treasury = "0x2163724034e0185B42d5C746da87587c8D5e3595";
  const tcp = "0x2f90E1DBEB014b353b19fa4864F6FFd3437AC51c";

  // mainnet
  // const treasury = "";
  // const tcp = "0x032F85b8FbF8540a92B986d953e4C3A61C76d39E";

  const contract: Contract = await LeaderboardPrize.deploy(treasury, tcp);
  await contract.deployed();
  console.log("LeaderboardPrize deployed to: ", contract.address);
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
