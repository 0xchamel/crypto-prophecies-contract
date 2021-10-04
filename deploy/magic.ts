import { Contract, ContractFactory } from "ethers";
// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

async function deploy() {
  // Deploy prophet nft
  const Magic: ContractFactory = await ethers.getContractFactory("Magic");
  const magic: Contract = await Magic.deploy(
    "0xd6D7f80e850e53F47a6Dd91c70638bb3c5523a2d",
    // "0x2d847211BEf5c1706C66fd5461455B915a11eE76",
    "10000000000000000000000000"
  );
  console.log("Magic token was deployed to: ", magic.address);
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
