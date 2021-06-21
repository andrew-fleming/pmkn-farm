import { ethers } from "hardhat";
import chai, { expect } from "chai";
import { Contract } from "ethers";
import { solidity } from "ethereum-waffle";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

chai.use(solidity)

describe("JackOLantern Contract", () => {

    let owner: SignerWithAddress;
    let alice: SignerWithAddress;
    let bob: SignerWithAddress;

    let jackOLantern: Contract;

    beforeEach(async() => {
        const JackOLantern = await ethers.getContractFactory("JackOLantern");
        [owner, alice, bob] = await ethers.getSigners();
        jackOLantern =  await JackOLantern.deploy()
        let minter = await jackOLantern.MINTER_ROLE()
        await jackOLantern.grantRole(minter, owner.address)
    })

    describe("Init", async() => {
        it("should deploy", async() => {
            expect(jackOLantern)
                .to.be.ok
        })

        it("has a name", async() => {
            expect(await jackOLantern.name())
                .to.eq("Jack-O-Lantern")
        })

        it("tracks tokens", async() => {
            await jackOLantern.safeMint(owner.address)
            await jackOLantern.safeMint(owner.address)

            expect(await jackOLantern.getTotalSupply())
                .to.eq(2)
        })

        it("should enumerate", async() => {
            await jackOLantern.safeMint(owner.address)
            await jackOLantern.safeMint(owner.address)
            await jackOLantern.safeMint(owner.address)
            await jackOLantern.safeMint(owner.address)
            await jackOLantern.safeMint(owner.address)
            await jackOLantern.transferFrom(owner.address, alice.address, 4)
            let res = await jackOLantern.tokenOfOwnerByIndex(alice.address, 0)
            expect(res).to.eq(4)
            res = await jackOLantern.balanceOf(alice.address)
            expect(res).to.eq(1)
            res = await jackOLantern.balanceOf(owner.address)
            expect(res).to.eq(4)
        })
    })
})
