import { ethers } from "hardhat";
import chai, { expect} from "chai";
import { Contract } from "ethers";
import { solidity } from "ethereum-waffle";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

chai.use(solidity)

describe("PmknToken Contract", () => {

    let owner: SignerWithAddress;
    let alice: SignerWithAddress;
    let bob: SignerWithAddress;

    let pmknToken: Contract;
    let differentContract: Contract;

    before(async() => {
        const PmknToken = await ethers.getContractFactory("PmknToken");
        const DifferentContract = await ethers.getContractFactory("PmknToken");

        [owner, alice, bob] = await ethers.getSigners();

        pmknToken =  await PmknToken.deploy()
        differentContract = await DifferentContract.deploy()
    })

    describe("Init", async() => {
        it("should deploy", async() => {
            expect(pmknToken)
                .to.be.ok
        })

        it("has a name", async() => {
            expect(await pmknToken.name())
                .to.eq("PmknToken")
        })

        it("should have no supply after deployment", async() => {
            expect(await pmknToken.totalSupply())
                .to.eq(0)
        })
    })

    describe("Test owner functions", async() => {
        it("should confirm deployer as owner", async() => {
            expect(await pmknToken.owner())
                .to.eq(owner.address)
        })

        it("should mint tokens from owner", async() => {
            // Sanity check
            expect(await pmknToken.balanceOf(owner.address))
                .to.eq(0)

            await pmknToken.mint(owner.address, 50)

            expect(await pmknToken.totalSupply())
                .to.eq(50)

            expect(await pmknToken.balanceOf(owner.address))
                .to.eq(50)
        })

        //it("should burn tokens", async() => {
        //    await pmknToken.burn(owner.address, 25)
        //    expect(await pmknToken.totalSupply())
        //        .to.eq(25)
        //})

        it("should revert mint from non-owner", async() => {
            await expect(pmknToken.connect(alice).mint(alice.address, 20))
                .to.be.revertedWith("caller is not the owner")
        })

        it("should revert transfer from non-owner", async() => {
            await expect(pmknToken.connect(alice)._transferOwnership(bob.address))
                .to.be.revertedWith("caller is not the owner")
        })

        it("should transfer ownership", async() => {
            await pmknToken._transferOwnership(alice.address)

            expect(await pmknToken.owner())
                .to.eq(alice.address)
        })

        it("should transfer ownership to 'differentContract'", async() => {
            await pmknToken.connect(alice)._transferOwnership(differentContract.address)

            expect(await pmknToken.owner())
                .to.eq(differentContract.address)
        })
    })
})