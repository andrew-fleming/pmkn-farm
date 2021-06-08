import { ethers } from "hardhat";
import chai, { expect} from "chai";
import { Contract } from "ethers";
import { solidity } from "ethereum-waffle";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

chai.use(solidity)

describe("JackOLantern Contract", () => {

    let owner: SignerWithAddress;
    let alice: SignerWithAddress;
    let bob: SignerWithAddress;

    let jackOLantern: Contract;

    before(async() => {
        const JackOLantern = await ethers.getContractFactory("JackOLantern");

        [owner, alice, bob] = await ethers.getSigners();

        jackOLantern =  await JackOLantern.deploy()
    })

    describe("Init", async() => {
        it("should deploy", async() => {
            expect(jackOLantern)
                .to.be.ok
        })

        it("has a name", async() => {
            expect(await jackOLantern.name())
                .to.eq("Jack-O'-Lantern")
        })
    })
})
