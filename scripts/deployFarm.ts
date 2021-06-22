import { ethers } from "hardhat";
import { mainConfig, lottoConfig } from "./config";

const nftPrice = ethers.utils.parseEther("1")

async function main() {
    const [deployer] = await ethers.getSigners()
    console.log(`Deploying contracts with ${deployer.address}`);

    const balance = await deployer.getBalance();
    console.log(`Account balance: ${balance.toString()}`)

    /**
     * @notice For testnets without Maker/DAI
     * @dev Comment out if using a network with DAI (ie Kovan) and use/insert
     *      DAI address in config.ts
     */
    // const MockDai = await ethers.getContractFactory("MockDai")
    // const mockDai = await MockDai.deploy()

    const PmknToken = await ethers.getContractFactory("PmknToken")
    const pmknToken = await PmknToken.deploy()
    console.log(`PmknToken address: ${pmknToken.address}`)

    const JackOLantern = await ethers.getContractFactory("JackOLantern")
    const jackOLantern = await JackOLantern.deploy()
    console.log(`JackOLantern address: ${jackOLantern.address}`)

    const Lottery = await ethers.getContractFactory("Lottery");
    const lottery = await Lottery.deploy(jackOLantern.address, pmknToken.address, ...lottoConfig);
    console.log(`Lottery contract address: ${lottery.address}`);

    const PmknFarm = await ethers.getContractFactory("PmknFarm");
    const pmknFarm = await PmknFarm.deploy(
        ...mainConfig, pmknToken.address, jackOLantern.address, lottery.address, nftPrice
        //...mainConfig, pmknToken.address, jackOLantern.address, nftPrice
        // mockDai.address, pmknToken.address, jackOLantern.address, nftPrice
        )
    console.log(`PmknFarm address: ${pmknFarm.address}`)
    console.log(`NFT Price: ${ethers.utils.formatEther(nftPrice)} PMKN`)

    const pmknMinter = await pmknToken.MINTER_ROLE()
    await pmknToken.grantRole(pmknMinter, pmknFarm.address)
    console.log(`PmknToken minter role transferred to: ${pmknFarm.address}`)

    const jackMinter = await jackOLantern.MINTER_ROLE()
    await jackOLantern.grantRole(jackMinter, pmknFarm.address)
    console.log(`Jack-O-Lantern NFT minter role transferred to ${pmknFarm.address}`)
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.log(error)
        process.exit(1)
    })