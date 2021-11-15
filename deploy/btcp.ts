import { Contract, ContractFactory } from "ethers";
// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

async function deploy() {
  // Deploy pool factory
  const bTCP: ContractFactory = await ethers.getContractFactory("BTCP");
  const contract: Contract = await bTCP.deploy(
    "0x9d070Ff13103D24455355391ce55DEc3bF3EC01f",
    "16500000000000000000000000"
  );
  console.log("bTCP was deployed to: ", contract.address);
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
