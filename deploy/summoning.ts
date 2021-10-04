import { Contract, ContractFactory } from "ethers";
// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

async function deploy() {
  // Deploy summoning contract
  const Summoning: ContractFactory = await ethers.getContractFactory(
    "Summoning"
  );
  const summoning: Contract = await Summoning.deploy(
    "0x084Aa2372920607196D8AeAEfb2a78cf3D039B6B", // orb
    "0x8f0D004d6484f7A772739C6a585bB99d21E13115", // prophet
    "0x2329D5C29E8089232cF3b82b5fe69971152f3cE8", // item
    "0xF49C5A61a7615bE4F7f4bFB2696cD419F33A78Df", // magic
    [
      "5000000000000000000",
      "25000000000000000000",
      "125000000000000000000",
      "625000000000000000000",
      "3125000000000000000000",
    ],
    [
      "25000000000000000000",
      "125000000000000000000",
      "625000000000000000000",
      "3125000000000000000000",
    ],
    "0x8C7382F9D8f56b33781fE506E897a4F1e2d17255",
    "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
    "0x6e75b569a01ef56d18cab6a8e71e6600d6ce853834d4a5748b720d06f878b3a4",
    "100000000000000"
  );
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
