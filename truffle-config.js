require('ts-node').register({
  files: true,
});
require("dotenv").config();

const HDWalletProvider = require("truffle-hdwallet-provider");
const API_KEY = process.env.INFURA_KEY;
const MNEMONIC = process.env.MNEMONIC;

module.exports = {
  networks: {
    development: {
      host: "192.168.1.180",
      port: "7545",
      network_id: "*",
      gasPrice: 100e9,
    },
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(MNEMONIC, "https://rinkeby.infura.io/v3/" + API_KEY)
      },
      network_id: 4,
      gas: 4000000      //make sure this gas allocation isn't over 4M, which is the max
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(MNEMONIC, "https://ropsten.infura.io/v3/" + API_KEY)
      },
      network_id: 3,
      gas: 4000000
    },
    live: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
      gasPrice: 100e9,
    },
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.7.0",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        },
      },
    },
  },
};
