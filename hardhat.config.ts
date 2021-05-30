import { resolve } from "path";
require("dotenv").config();

import { HardhatUserConfig } from "hardhat/config";
import { NetworkUserConfig } from "hardhat/types";

import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-truffle5";
import "hardhat-typechain";
import "solidity-coverage"

//if (!process.env.MNEMONICS) throw new Error("MNEMONICS missing from .env file");
if (!process.env.RINKEBY_PRIVKEY) throw new Error("RINKEBY_PRIVKEY missing from .env file");
if (!process.env.MAINNET_PRIVKEY) throw new Error("MAINNET_PRIVKEY missing from .env file");

//const mnemonics = process.env.MNEMONICS;

const config = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      forking: {
        url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_KEY}`,
        blockNumber: 11589707,
      },
    },
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${process.env.ALCHEMY_KEY}`,
      accounts: [process.env.RINKEBY_PRIVKEY],
    },
    live: {
      url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_KEY}`,
      accounts: [process.env.MAINNET_PRIVKEY],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./tests",
  },
  solidity: {
    compilers: [
      {
        version: "0.6.0"
      },
      {
        version: "0.7.4",
        settings: { } 
      },
      {
        version: "0.8.0",
        settings: { } 
      }
    ],
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  typechain: {
    outDir: "types/contracts",
    target: "truffle-v5"
  },
};

export default config;
