import { ethers, waffle } from "hardhat";
import chai, { expect, use} from "chai";
import { Contract } from "ethers";
import { solidity, deployMockContract, MockProvider } from "ethereum-waffle";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

use(solidity);

describe("Lottery Contract", () => {

    let owner: SignerWithAddress;
    let alice: SignerWithAddress;
    let bob: SignerWithAddress;

    let lottery: Contract;
    let jackContract: Contract;

    before(async() => {
        const Lottery = await ethers.getContractFactory("Lottery");
        const JackContract = await ethers.getContractFactory("JackOLantern");

        [owner, alice, bob] = await ethers.getSigners();

        let lotteryParams = [
            "0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9",
            "0xa36085F69e2889c224210F603D836748e7dC0088",
            1, 
            "0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4"
        ];

        jackContract = await JackContract.deploy();
        lottery =  await Lottery.deploy(jackContract.address, ...lotteryParams);

    })

    describe("Init", async() => {
        it("should deploy", async() => {
            expect(lottery).to.be.ok
            expect(jackContract).to.be.ok
        })

        it("should track tokenIds", async() => {
            let minter = await jackContract.MINTER_ROLE()
            await jackContract.grantRole(minter, owner.address)
            await jackContract.safeMint(alice.address)
            await jackContract.safeMint(alice.address)

            let res = await jackContract.getTotalSupply()

            expect(await jackContract.getTotalSupply())
                .to.eq(2)
        })

        it("should ")

    })
})



//const {use, expect} = require("chai");
//const {ContractFactory, utils} = require("ethers");
//const {MockProvider} = require("@ethereum-waffle/provider");
//const {waffleChai} = require("@ethereum-waffle/chai");
//const {deployMockContract} = require("@ethereum-waffle/mock-contract");
//
//const JackContract = require("../artifacts/contracts/JackOLantern.sol/JackOLantern.json");
//const Lottery = require("../artifacts/contracts/Lottery.sol/Lottery.json");
//const ChainlinkVRF = require("../artifacts/@chainlink/contracts/src/v0.8/dev/VRFConsumerBase.sol/VRFConsumerBase.json");
//
//use(waffleChai);
//
//describe("Lottery", () => {
//  async function setup() {
//    const [owner, alice, bob] = new MockProvider().getWallets();
//    const mockVRF = await deployMockContract(owner, ChainlinkVRF.abi);
//    const jackFactory = new ContractFactory(JackContract.abi, JackContract.bytecode, owner);
//    const lotteryFactory = new ContractFactory(Lottery.abi, Lottery.bytecode, owner);
//    const lotteryParams = [
//        "0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9",
//        "0xa36085F69e2889c224210F603D836748e7dC0088",
//        1, 
//        "0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4"    
//    ]
//    const jackContract = await jackFactory.deploy();
//    const lottery = await lotteryFactory.deploy(jackContract.address, ...lotteryParams);
//    return {owner, alice, bob, lottery, jackContract, mockVRF};
//  }
//
//  // FIX ME
//  it("should call VRF and store value in requestId", async () => {
//    const {lottery, jackContract, mockVRF} = await setup();
//    expect(await lottery.winningNumber(0))
//        .to.eq(0)
//    
//    await mockVRF.mock.requestRandomness().returns(99)
//    await lottery.getWinningNumber() // refactor tests, not working correctly
//  });
//
//})