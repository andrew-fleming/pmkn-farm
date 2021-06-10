import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-web3";

require('dotenv').config()


export default {
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    kovan: {
        gas: "auto",
        gasPrice: "auto",
        url: process.env.API_KEY,
        accounts: [`0x${process.env.PRIVATE_KEY}`]
    }
  }
}



//require("@nomiclabs/hardhat-ethers");
//const fs = require('fs');
//const privateKey = fs.readFileSync(".secret").toString().trim();
//module.exports = {
//  defaultNetwork: "matic",
//  networks: {
//    hardhat: {
//    },
//    matic: {
//      url: "https://rpc-mumbai.maticvigil.com",
//      accounts: [`0x${process.env.PRIVATE_KEY}`]
//    }
//  },
//  solidity: {
//    version: "0.8.4",
//    settings: {
//      optimizer: {
//        enabled: true,
//        runs: 200
//      }
//    }
//  },
//  paths: {
//    sources: "./contracts",
//    tests: "./test",
//    cache: "./cache",
//    artifacts: "./artifacts"
//  },
//  mocha: {
//    timeout: 20000
//  }
//}