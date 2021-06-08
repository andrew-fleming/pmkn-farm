import { ethers } from "hardhat";
import { mainConfig } from "./config";

const nftPrice = ethers.utils.parseEther("1")

async function main() {
    const [deployer] = await ethers.getSigners()
    console.log(`Deploying contracts with ${deployer.address}`);

    const balance = await deployer.getBalance();
    console.log(`Account balance: ${balance.toString()}`)

    const PmknToken = await ethers.getContractFactory("PmknToken")
    const pmknToken = await PmknToken.deploy()
    console.log(`PmknToken address: ${pmknToken.address}`)

    const JackOLantern = await ethers.getContractFactory("JackOLantern")
    const jackOLantern = await JackOLantern.deploy()
    console.log(`JackOLantern address: ${jackOLantern.address}`)

    const PmknFarm = await ethers.getContractFactory("PmknFarm");
    const pmknFarm = await PmknFarm.deploy(
        ...mainConfig, pmknToken.address, jackOLantern.address, nftPrice
        )
    console.log(`PmknFarm address: ${pmknFarm.address}`)
    console.log(`NFT Price: ${ethers.utils.formatEther(nftPrice)} PMKN`)

    await pmknToken._transferOwnership(pmknFarm.address)
    console.log(`PmknToken ownership transferred to: ${pmknFarm.address}`)
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.log(error)
        process.exit(1)
    })