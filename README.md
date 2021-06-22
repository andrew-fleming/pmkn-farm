# Pmkn Farm

<img width="1367" alt="Screen Shot 2021-06-22 at 12 27 31 PM" src="https://user-images.githubusercontent.com/69282788/122964969-cd00e180-d355-11eb-899a-21e59c621ed4.png">

This repository provides a DAI staking mechanism; whereby, the user receives PmknToken as a reward for staking DAI in the contract. Further, the user can purchase a JACK NFT through the NFT factory named JackOLantern. The PmknTokens are sent to a lottery pool inside the Lottery contract. Finally, each NFT includes a tokenId which acts as a lottery ticket. The lottery feature uses Chainlink's VRF to provide a verifiably random number. The winner receives the contents of the lottery pool. 

## Prerequisites
```
NodeJS and NPM >= 7.5.0
```
***
## Installation
In directory root:
```
npm i
```
***
## Testing
```
npx hardhat test
```
***
## Deployment
### Prerequisites
This dApp accepts DAI as its staking token; therefore, you'll need to acquire Kovan DAI if you deploy to Kovan (as it's preconfigured). To attain kDAI, you'll need to lock kETH in a Maker vault in exchange for kDAI.
* Network Provider
    * Infura.io
    * Alchemy.com
* MetaMask 
    * MetaMask.io
* Kovan DAI 
    * https://oasis.app/borrow?network=kovan
* Kovan LINK
    * https://kovan.chain.link/

The Hardhat configuration file and scripts have been set up to deploy on the Kovan testnet. Use the .env_sample as a template for the requisite API_KEY and PRIVATE_KEY. Infura and Alchemy offer free API access to testnets and mainnet. Once you have an API endpoint and your private key from MetaMask, create a dotenv file within the PmknFarm root:

```
touch .env
```
Populate the .env with your API_KEY and PRIVATE_KEY. 
<br>
_*If you're posting on GitHub, DO NOT FORGET to .gitignore the dotenv(.env) file!_
<br>
<br>
Uncomment out the Kovan network details in hardhat.config.ts:
```
networks: {
    kovan: {
        gas: "auto",
        gasPrice: "auto",
        url: process.env.API_KEY,
        accounts: [`0x${process.env.PRIVATE_KEY}`]
    }
  }
```
In the PmknFarm root, run:
```
npx hardhat run scripts/deployFarm.ts --network kovan
```



