import { Contract, ContractFactory } from "ethers";
// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

async function deploy() {
  // Deploy pool factory
  const Bonus: ContractFactory = await ethers.getContractFactory("Bonus");
  const contract: Contract = await Bonus.deploy(
    "0x9c4DFfb299a9e5F0D2141E3c6be44645E10427d8",
    "0x2d847211BEf5c1706C66fd5461455B915a11eE76",
    "0x2d847211BEf5c1706C66fd5461455B915a11eE76"
  );
  console.log("Bonus was deployed to: ", contract.address);
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
