import React from "react"
import styled from "styled-components";

import { useUser } from "../context/UserContext"
import { useContract } from "../context/ContractContext"
import { ethers } from "ethers";

const Container = styled.div`
    height: 15rem;
    width: 22rem;
    background-color: #2b2e35;
    margin-top: 3rem;
    display: flex;
    flex-direction: column;
    margin: 2rem;
    border: .3rem solid black;
`;

const Banner = styled.div`
    width: 100%;
    height: 33%;
    background: linear-gradient(45deg, #ED7014, #5f3c74);
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const ClaimButton = styled.button`
    height: 5rem;
    width: 100%;
    background-color: black;
    color: #7A3803;
    font-size: 1.2rem;
`;

const TopBanner = styled.div`
    align-self: center;
    font-size: 1.65rem;
    font-weight: bold;
    color: black;
    text-shadow: .03rem .03rem gray;
`;

const BottomBanner = styled.div`
    align-self: center;
    font-size: 1.4rem;
    font-weight: bold;
`;

const Circle = styled.button`
    width: 12rem;
    height: 4rem;
    border: .05rem dashed white;
    border-radius: 1rem;
    background-color: transparent;
    color: black;
    font-size: 1rem;
    font-weight: bold;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

export default function StakeBox() {

    const {
        userAddress,
        pmknBalance
    } = useUser();

    const {
        provider,
        pmknFarmContract,
        pmknTokenContract
    } = useContract();

    const URI = "https://gateway.pinata.cloud/ipfs/QmbJ9d3mp88MK3y4djxU8PsG1m8773wbmPA4JHE6mVcTc7"

    const mintJack = async() => {
        try {
            let signer = provider.getSigner()
            let tx = await pmknTokenContract.connect(signer).approve(pmknFarmContract.address, ethers.utils.parseEther("1"))
            provider.waitForTransaction(tx.hash)
                .then(async() => {
                    tx = await pmknFarmContract.connect(signer).mintNFT(userAddress, URI)
                })
                return tx
        } catch (error) {
            alert(error)
        }
    }

    
    return(
        <Container>
            <Banner>
                <TopBanner>
                    <div>
                        Jack-O'-Lantern
                    </div>
                </TopBanner>
            </Banner>
        
            <div>
                <ClaimButton onClick={mintJack}>
                    Mint NFT
                </ClaimButton>
                
            </div>
            <Banner>
                <BottomBanner>
                    <Circle>
                        Cost: 1 PMKN
                    </Circle>
                </BottomBanner>
            </Banner>
        </Container>
    )
}