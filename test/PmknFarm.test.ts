import { ethers } from "hardhat";
import chai, { expect } from "chai";
import { solidity } from "ethereum-waffle"
import { Contract, BigNumber } from "ethers"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { time } from "@openzeppelin/test-helpers";

chai.use(solidity)

describe("PmknFarm Contract", () => {
    
    let res: any;

    let owner: SignerWithAddress;
    let alice: SignerWithAddress;
    let bob: SignerWithAddress;
    let carol: SignerWithAddress;
    let dave: SignerWithAddress;
    let eve: SignerWithAddress;

    let pmknFarm: Contract;
    let mockDai: Contract;
    let pmknToken: Contract;
    let jackOLantern: Contract;
    let lottery: Contract;

    const daiAmount: BigNumber = ethers.utils.parseEther("25000");
    const nftPrice: BigNumber = ethers.utils.parseEther("1")

    before(async() => {
        const PmknFarm = await ethers.getContractFactory("PmknFarm");
        const MockERC20 = await ethers.getContractFactory("MockERC20");
        const PmknToken = await ethers.getContractFactory("PmknToken");
        const JackOLantern = await ethers.getContractFactory("JackOLantern");
        const Lottery = await ethers.getContractFactory("Lottery");

        [owner, alice, bob, carol, dave, eve] = await ethers.getSigners();

        mockDai = await MockERC20.deploy("MockDai", "mDAI")
        pmknToken =  await PmknToken.deploy()
        jackOLantern = await JackOLantern.deploy()

        const lottoConfig = [
            jackOLantern.address,
            pmknToken.address,
            "0xa36085F69e2889c224210F603D836748e7dC0088",
            "0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9", // Coordinator
            "0xa36085F69e2889c224210F603D836748e7dC0088", // LINK address
            ethers.utils.parseEther(".1"), // VRF price
            "0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4" // KeyHash
        ]

        lottery = await Lottery.deploy(...lottoConfig)

        /*//////////////////////
        // Dai Transfers      //
        //////////////////////*/

        await Promise.all([
            mockDai.mint(owner.address, daiAmount),
            mockDai.mint(alice.address, daiAmount),
            mockDai.mint(bob.address, daiAmount),
            mockDai.mint(carol.address, daiAmount),
            mockDai.mint(dave.address, daiAmount),
            mockDai.mint(eve.address, daiAmount)
        ])

        let pmknFarmParams: Array<string | BigNumber> = [
            mockDai.address,
            pmknToken.address,
            jackOLantern.address,
            lottery.address,
            nftPrice
        ]

        // PmknFarm Contract deployment
        pmknFarm = await PmknFarm.deploy(...pmknFarmParams)

    })

    describe("Init", async() => {
        it("should deploy contracts", async() => {
            expect(pmknFarm).to.be.ok
            expect(pmknToken).to.be.ok
            expect(mockDai).to.be.ok
        })

        it("should return name", async() => {
            expect(await pmknFarm.name())
                .to.eq("Pmkn Farm")
            expect(await mockDai.name())
                .to.eq("MockDai")
            expect(await pmknToken.name())
                .to.eq("PmknToken")
        })

        it("should show mockDai balance", async() => {
            expect(await mockDai.balanceOf(owner.address))
                .to.eq(daiAmount)
        })

    })

    describe("Staking", async() => {
        it("should stake and update mapping", async() => {
            let toTransfer = ethers.utils.parseEther("100")
            await mockDai.connect(alice).approve(pmknFarm.address, toTransfer)

            expect(await pmknFarm.isStaking(alice.address))
                .to.eq(false)
            
            expect(await pmknFarm.connect(alice).stake(toTransfer))
                .to.be.ok

            expect(await pmknFarm.stakingBalance(alice.address))
                .to.eq(toTransfer)
            
            expect(await pmknFarm.isStaking(alice.address))
                .to.eq(true)
        })

        it("should remove dai from user", async() => {
            res = await mockDai.balanceOf(alice.address)
            expect(Number(res))
                .to.be.lessThan(Number(daiAmount))
        })

        it("should update balance with multiple stakes", async() => {
            let toTransfer = ethers.utils.parseEther("100")
            await mockDai.connect(eve).approve(pmknFarm.address, toTransfer)
            await pmknFarm.connect(eve).stake(toTransfer)
            
        })

        it("should revert stake with zero as staked amount", async() => {
            await expect(pmknFarm.connect(bob).stake(0))
                .to.be.revertedWith("You cannot stake zero tokens")
        })

        it("should revert stake without allowance", async() => {
            let toTransfer = ethers.utils.parseEther("50")
            await expect(pmknFarm.connect(bob).stake(toTransfer))
                .to.be.revertedWith("transfer amount exceeds allowance")
        })

        it("should revert with not enough funds", async() => {
            let toTransfer = ethers.utils.parseEther("1000000")
            await mockDai.approve(pmknFarm.address, toTransfer)

            await expect(pmknFarm.connect(bob).stake(toTransfer))
                .to.be.revertedWith("You cannot stake zero tokens")
        })
    })

    describe("Unstaking", async() => {
        it("should unstake balance from user", async() => {
            res = await pmknFarm.stakingBalance(alice.address)
            expect(Number(res))
                .to.be.greaterThan(0)

            let toTransfer = ethers.utils.parseEther("100")
            await pmknFarm.connect(alice).unstake(toTransfer)

            res = await pmknFarm.stakingBalance(alice.address)
            expect(Number(res))
                .to.eq(0)
        })

        it("should remove staking status", async() => {
            expect(await pmknFarm.isStaking(alice.address))
                .to.eq(false)
        })

        it("should transfer ownership", async() => {
            let minter = await pmknToken.MINTER_ROLE()
            await pmknToken.grantRole(minter, pmknFarm.address)

            expect(await pmknToken.hasRole(minter, pmknFarm.address))
                .to.eq(true)
        })
    })
})

describe("Start from deployment for time increase", () => {
    let res: any
    let expected: any
    
    let alice: SignerWithAddress
    let mockDai: Contract
    let pmknFarm: Contract
    let pmknToken: Contract
    let jackOLantern: Contract
    let lottery: Contract

    beforeEach(async() => {
        // Bare-boned initial deployment setup
        const PmknFarm = await ethers.getContractFactory("PmknFarm");
        const MockERC20 = await ethers.getContractFactory("MockERC20");
        const PmknToken = await ethers.getContractFactory("PmknToken");
        const JackOLantern = await ethers.getContractFactory("JackOLantern");
        const Lottery = await ethers.getContractFactory("Lottery");
        [alice] = await ethers.getSigners();
        mockDai = await MockERC20.deploy("MockDai", "mDAI")
        pmknToken =  await PmknToken.deploy()
        jackOLantern = await JackOLantern.deploy()
        let lottoConfig = [
            jackOLantern.address,
            pmknToken.address,
            "0xa36085F69e2889c224210F603D836748e7dC0088",
            "0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9", // Coordinator
            "0xa36085F69e2889c224210F603D836748e7dC0088", // LINK address
            ethers.utils.parseEther(".1"), // VRF price
            "0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4" // KeyHash
        ]
        lottery = await Lottery.deploy(...lottoConfig)
        const daiAmount: BigNumber = ethers.utils.parseEther("25000");
        const nftPrice: BigNumber = ethers.utils.parseEther("1")
        await mockDai.mint(alice.address, daiAmount)
        pmknFarm = await PmknFarm.deploy(
            mockDai.address, 
            pmknToken.address, 
            jackOLantern.address, 
            lottery.address,
            nftPrice
            )
        let minter = await pmknToken.MINTER_ROLE()
        await pmknToken.grantRole(minter, pmknFarm.address)

        let jackMinter = await jackOLantern.MINTER_ROLE()
        await jackOLantern.grantRole(jackMinter, pmknFarm.address)

        let toTransfer = ethers.utils.parseEther("10")
        await mockDai.approve(pmknFarm.address, toTransfer)
        await pmknFarm.stake(toTransfer)
    })

    describe("Yield", async() => {
        it("should return correct yield time", async() => {
            let timeStart = await pmknFarm.startTime(alice.address)
            expect(Number(timeStart))
                .to.be.greaterThan(0)

            // Fast-forward time
            await time.increase(86400)

            expect(await pmknFarm.calculateYieldTime(alice.address))
                .to.eq((86400))
        })

        it("should mint correct token amount in total supply and user", async() => { 
            await time.increase(86400)

            let _time = await pmknFarm.calculateYieldTime(alice.address)
            let formatTime = _time / 86400
            let staked = await pmknFarm.stakingBalance(alice.address)
            let bal = staked * formatTime
            let newBal = ethers.utils.formatEther(bal.toString())
            expected = Number.parseFloat(newBal).toFixed(3)

            await pmknFarm.withdrawYield()

            res = await pmknToken.totalSupply()
            let newRes = ethers.utils.formatEther(res)
            let formatRes = Number.parseFloat(newRes).toFixed(3).toString()

            expect(expected)
                .to.eq(formatRes)

            res = await pmknToken.balanceOf(alice.address)
            newRes = ethers.utils.formatEther(res)
            formatRes = Number.parseFloat(newRes).toFixed(3).toString()

            expect(expected)
                .to.eq(formatRes)
        })

        it("should update yield balance when unstaked", async() => {
            await time.increase(86400)
            await pmknFarm.unstake(ethers.utils.parseEther("5"))

            res = await pmknFarm.pmknBalance(alice.address)
            expect(Number(ethers.utils.formatEther(res)))
                .to.be.approximately(10, .001)
        })

        /** BUG */
        it("should return correct yield when partially unstake", async() => {
            await time.increase(86400)
            await pmknFarm.unstake(ethers.utils.parseEther("5"))
            await time.increase(86400)
            await pmknFarm.withdrawYield()
            res = await pmknToken.balanceOf(alice.address)
            expect(Number(ethers.utils.formatEther(res)))
                .to.be.approximately(15, .001)
        })
    })

    describe("Multiple Stakes", async() => {
        it("should update yield balance after multiple stakes", async() => {
            time.increase(8640)

            let toTransfer = ethers.utils.parseEther("10")
            await mockDai.approve(pmknFarm.address, toTransfer)
            await pmknFarm.stake(toTransfer)

            res = await pmknFarm.pmknBalance(alice.address)
            let formatRes = ethers.utils.formatEther(res)

            expect(Number.parseFloat(formatRes).toFixed(3))
                .to.eq("1.000")
        })
    })

    describe("NFT", async() => {
        it("should mint an nft", async() => {
            time.increase(10000000)

            await pmknFarm.withdrawYield()

            let toTransfer = ethers.utils.parseEther("1")
            
            await pmknToken.approve(lottery.address, toTransfer)
            await pmknFarm.mintNFT(alice.address, "www")

            await pmknToken.approve(lottery.address, toTransfer)
            expect(await pmknFarm.mintNFT(alice.address, "www"))
                .to.emit(pmknFarm, "MintNFT")
                .withArgs(alice.address, 1)

            await pmknToken.approve(lottery.address, toTransfer)
            expect(await pmknFarm.mintNFT(alice.address, "www"))
                .to.emit(pmknFarm, "MintNFT")
                .withArgs(alice.address, 2)
        })

        it("should update nftCount", async() => {
            time.increase(1000000)

            await pmknFarm.withdrawYield()

            res = await pmknFarm.nftCount("www")
            expect(res).to.eq(0)

            let toTransfer = ethers.utils.parseEther("1")
            await pmknToken.approve(lottery.address, toTransfer)
            await pmknFarm.mintNFT(alice.address, "www")

            res = await pmknFarm.nftCount("www")
            expect(res).to.eq(1)
        })
    })

    describe("Events", async() => {
        it("should emit Stake", async() => {
            let toTransfer = ethers.utils.parseEther("10")
            await mockDai.approve(pmknFarm.address, toTransfer)

            await expect(pmknFarm.stake(toTransfer))
                .to.emit(pmknFarm, 'Stake')
                .withArgs(alice.address, toTransfer);
        })

        it("should emit Unstake", async() => {
            let toTransfer = ethers.utils.parseEther("10")
            await mockDai.approve(pmknFarm.address, toTransfer)
            await pmknFarm.stake(toTransfer)

            expect(await pmknFarm.unstake(toTransfer))
                .to.emit(pmknFarm, "Unstake")
                .withArgs(alice.address, toTransfer)
        })

        it("should emit YieldWithdraw", async() => {
            await time.increase(86400)

            let toTransfer = ethers.utils.parseEther("10")
            await pmknFarm.unstake(toTransfer)

            res = await pmknFarm.pmknBalance(alice.address)

            expect(await pmknFarm.withdrawYield())
                .to.emit(pmknFarm, "YieldWithdraw")
                .withArgs(alice.address, res)
        })

        it("should emit MintNFT event", async() => {
            await time.increase(86400)

            await pmknFarm.withdrawYield()

            let toTransfer = ethers.utils.parseEther("1")
            await pmknToken.approve(lottery.address, toTransfer)
            expect(await pmknFarm.mintNFT(alice.address, "www"))
                .to.emit(pmknFarm, "MintNFT")
                .withArgs(alice.address, 0)
        })
    })
})