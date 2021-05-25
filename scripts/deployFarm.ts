import { ethers } from "hardhat";
import { mainConfig } from "./config";

async function main() {
    const [deployer] = await ethers.getSigners()
    console.log(`Deploying contracts with ${deployer.address}`);

    const balance = await deployer.getBalance();
    console.log(`Account balance: ${balance.toString()}`)

    const PmknToken = await ethers.getContractFactory("PmknToken")
    const pmknToken = await PmknToken.deploy()
    console.log(`PmknToken address: ${pmknToken.address}`)

    const PmknFarm = await ethers.getContractFactory("PmknFarm");
    const pmknFarm = await PmknFarm.deploy(...mainConfig, pmknToken.address)
    console.log(`PmknFarm address: ${pmknFarm.address}`)
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.log(error)
        process.exit(1)
    })