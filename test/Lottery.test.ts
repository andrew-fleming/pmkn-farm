import { ethers } from "hardhat";
import { expect } from "chai";
import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";


describe("Lottery Contract", () => {

    let owner: SignerWithAddress;
    let alice: SignerWithAddress;
    let bob: SignerWithAddress;

    let lottery: Contract;
    let jackContract: Contract;
    let pmknToken: Contract;
    let mockLink: Contract;

    beforeEach(async() => {
        const Lottery = await ethers.getContractFactory("MockLotteryFunctions");
        const JackContract = await ethers.getContractFactory("JackOLantern");
        const PmknToken = await ethers.getContractFactory("PmknToken");
        const MockLink = await ethers.getContractFactory("MockERC20");
        mockLink = await MockLink.deploy("MockLink", "mLINK");
        pmknToken = await PmknToken.deploy();
        [owner, alice, bob] = await ethers.getSigners();

        await mockLink.mint(owner.address, ethers.utils.parseEther("9999"));

        let lotteryParams = [
            pmknToken.address,
            mockLink.address,
            "0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9", // coor
            "0xa36085F69e2889c224210F603D836748e7dC0088", // link
            1, // fee
            "0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4" // keyHash
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
    })

    describe("Link interaction", async() => {
        it("should accept link", async() => {
            let res = await mockLink.balanceOf(lottery.address)
            expect(res).to.eq(0)
            await mockLink.transfer(lottery.address, 1)
            expect(await mockLink.balanceOf(lottery.address))
                .to.eq("1")
        })

        it("should return correct balance", async() => {
            await mockLink.transfer(lottery.address, ethers.utils.parseEther("10"))
            
            let res = await lottery.getLinkBalance()
            expect(res)
                .to.eq(ethers.utils.parseEther("10"))
        })

        it("should withdraw link", async() => {
            await mockLink.transfer(lottery.address, ethers.utils.parseEther("10"))
            await lottery.withdrawLink()
            expect(await mockLink.balanceOf(lottery.address))
                .to.eq("0")
            expect(await mockLink.balanceOf(owner.address))
                .to.eq(ethers.utils.parseEther("9999"))
        })

        it("should revert non owner withdraw call", async() => {
            await mockLink.transfer(lottery.address, ethers.utils.parseEther("10"))
            await expect(lottery.connect(alice).withdrawLink())
                .to.be.revertedWith("caller is not the owner")
        })

    })

    describe("Call Test functions to check state", async() => {
        beforeEach(async() => {
            let minter = await jackContract.MINTER_ROLE()
            await Promise.all([
                jackContract.grantRole(minter, owner.address),
                pmknToken.grantRole(minter, owner.address),
                pmknToken.mint(owner.address, ethers.utils.parseEther("999")),
                jackContract.safeMint(alice.address),
                jackContract.safeMint(bob.address),
                jackContract.safeMint(alice.address),
                jackContract.safeMint(bob.address),
                jackContract.safeMint(alice.address),
                jackContract.safeMint(bob.address),
                pmknToken.approve(lottery.address, ethers.utils.parseEther("25")),
                lottery.addToLotteryPool(owner.address, ethers.utils.parseEther("25"))
            ])
        })

        it("should call testGetRandomNumber", async() => {
            await lottery.testGetWinningNumber()
            expect(await lottery.lotteryCount())
                .to.eq(1)
            let reqId = await lottery.__requestId()
            expect(await lottery.requestIdToCount(reqId))
                .to.eq(0)
            expect(await lottery.winningNumber(0))
                .to.eq(3)
            expect(await jackContract.tokenOfOwnerByIndex(alice.address, 0))
                .to.eq(0)
        })

        it("should show alice as winner", async() => {
            await lottery.testGetWinningNumber0()
            expect(await lottery.lotteryCount())
                .to.eq(1)
            let reqId = await lottery.__requestId()
            expect(await lottery.winningNumber(reqId))
                .to.eq(0)
            expect(await jackContract.tokenOfOwnerByIndex(alice.address, 0))
                .to.eq(0)
            expect(await lottery.connect(alice).claimLottoWinnings())
                .to.be.ok
        })

        it("should payout bob", async() => {
            let res = await pmknToken.balanceOf(lottery.address)
            expect(res)    
                .to.eq(ethers.utils.parseEther("25"))
            await lottery.testGetWinningNumber()
            await lottery.connect(bob).claimLottoWinnings()
            expect(await pmknToken.balanceOf(lottery.address))
                .to.eq(0)
            expect(await pmknToken.balanceOf(bob.address))
                .to.eq(ethers.utils.parseEther("25"))
        })

        it("should revert non-winner claims", async() => {
            await lottery.testGetWinningNumber()
            await expect(lottery.connect(owner).claimLottoWinnings())
                .to.be.revertedWith("You either did not win or nothing in lotteryPool")
            await expect(lottery.connect(alice).claimLottoWinnings())
                .to.be.revertedWith("You either did not win or nothing in lotteryPool")
        })
    })

    describe("Events", async() => {
        beforeEach(async() => {
            let minter = await jackContract.MINTER_ROLE()
            await Promise.all([
                jackContract.grantRole(minter, owner.address),
                pmknToken.grantRole(minter, owner.address),
                pmknToken.mint(owner.address, ethers.utils.parseEther("999")),
                jackContract.safeMint(alice.address),
                jackContract.safeMint(bob.address),
                jackContract.safeMint(alice.address),
                jackContract.safeMint(bob.address),
                jackContract.safeMint(alice.address),
                jackContract.safeMint(bob.address),
                pmknToken.approve(lottery.address, ethers.utils.parseEther("25")),
                lottery.addToLotteryPool(owner.address, ethers.utils.parseEther("25")),
            ])
        })

        it("should emit LotteryStart", async() => {
            await lottery.testGetWinningNumber()
            expect(await lottery.testGetWinningNumber())
                .to.emit(lottery, "LotteryStart")
        })

        it("should emit NumberReceived", async() => {
            let _requestId = await lottery.__requestId()
            expect(await lottery.testGetWinningNumber())
                .to.emit(lottery, "NumberReceived")
                .withArgs(_requestId, 3)
        })

        it("should emit LotteryClaim", async() => {
            await lottery.testGetWinningNumber()
            expect(await lottery.connect(bob).claimLottoWinnings())
                .to.emit(lottery, "LotteryClaim")
                    .withArgs(bob.address, ethers.utils.parseEther("25"))
        })

        it("should emit AddPmkn", async() => {
            let amount = ethers.utils.parseEther("10")
            await pmknToken.approve(lottery.address, amount)
            expect(await lottery.addToLotteryPool(owner.address, amount))
                .to.emit(lottery, "AddPmkn")
                .withArgs(owner.address, amount)
        })

        it("should emit WithdrawLink", async() => {
            let amount = ethers.utils.parseEther("10")
            await mockLink.mint(owner.address, amount)
            await mockLink.approve(lottery.address, amount)
            await mockLink.transfer(lottery.address, amount)
            expect(await lottery.withdrawLink())
                .to.emit(lottery, "WithdrawLink")
                .withArgs(owner.address, amount)

        })
    })
})