import { ethers } from "hardhat";
import { expect} from "chai";
import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";



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

        pmknToken = await PmknToken.deploy()
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

    describe("Test minter role", async() => {
        it("should confirm deployer as owner", async() => {
            let minter = await pmknToken.MINTER_ROLE()
        await pmknToken.grantRole(minter, owner.address)
            expect(await pmknToken.hasRole(minter, owner.address))
                .to.eq(true)
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

        it("should revert mint from non-minter", async() => {
            await expect(pmknToken.connect(alice).mint(alice.address, 20))
                .to.be.reverted
        })

        it("should revert transfer from non-admin", async() => {
            let minter = await pmknToken.MINTER_ROLE()
          await expect(pmknToken.connect(alice).grantRole(minter, alice.address))
            .to.be.reverted
        })
    })
})