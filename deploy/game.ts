import { Contract, ContractFactory } from "ethers";
// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

async function deploy() {
  const bTCP = "0x5fBdEE72194489CF83728302FbeF60A7B236E3b7";
  const TCP = "0x2f90E1DBEB014b353b19fa4864F6FFd3437AC51c";
  const MPOT = "0x9ECb2e9b098b8254AE58c10E6343c382F4229260";
  const kfBurnAddress = "0xdA4A0a3a914D47406aAb73D31281423713f16fdC";
  const kfDailyPrizeAddress = "0xdA4A0a3a914D47406aAb73D31281423713f16fdC";
  const kfCustodyAddress = "0xdA4A0a3a914D47406aAb73D31281423713f16fdC";
  const ctDailyPrize = "0x54198c1a1334b873535a5c7902447812cfc41302";
  const ctSwap = "0x7fD346C5D3231b24626182babce8e6b77B4646FC";

  //   const BTCP: ContractFactory = await ethers.getContractFactory("TCP");
  //   const bTCP: Contract = await BTCP.deploy("250000000000000000000000000");
  //   console.log("BTCP was deployed to: ", bTCP.address);

  //   const SWAP: ContractFactory = await ethers.getContractFactory("Exchange");
  //   const swap: Contract = await SWAP.deploy(bTCP.address, TCP);
  //   console.log("SWAP was deployed to: ", swap.address);

  // testnet

  const Game: ContractFactory = await ethers.getContractFactory(
    "CryptoPropheciesGame"
  );
  const game: Contract = await Game.deploy(
    MPOT,
    TCP,
    bTCP,
    kfBurnAddress,
    kfDailyPrizeAddress,
    kfCustodyAddress,
    ctDailyPrize,
    ctSwap
  );
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
