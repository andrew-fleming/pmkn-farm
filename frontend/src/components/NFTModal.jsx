import React from "react"
import styled from "styled-components";
import { ethers } from "ethers" 

import { useUser } from "../context/UserContext"
import { useContract } from "../context/ContractContext"

const ModalStyle ={
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#2b2e35',
    borderRadius: '2rem',
    border: '.3rem solid black',
    height: '24rem',
    width: '25rem',
    zIndex: 1000
}

const OverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, .7)',
    zIndex: 1000
}

const Container = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
`;

const H1 = styled.h1`
    background: linear-gradient(45deg, #5f3c74, #ED7014);
    background-clip: text;
    -webkit-background-clip: text;
    -moz-background-clip: text;
    -moz-text-fill-color: transparent;
    -webkit-text-fill-color: transparent;
`;

const MintButton = styled.button`
    background: linear-gradient(45deg, #5f3c74, #ED7014);
    font-size: 1.5rem;
    width: 12rem;
    height: 4rem;
    cursor: pointer;
`;

const DivBody = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 10rem;
    width: 18rem;
    align-items: center;
    background-color: transparent;
    border: .1rem solid black;
    border-radius: 1rem;
    color: white;
`;

const Img = styled.img`
    height: 8rem;
    width: 8rem;
`;

const BottomDiv = styled.div`
    height: 20%;
`;

export default function LotteryModal() {

    const {
        userAddress
    } = useUser();

    const {
        provider,
        pmknFarmContract,
        pmknTokenContract,
        lotteryContract,
        setIsNFTOpen
    } = useContract();

    function closeModal() {
        setIsNFTOpen(false)
    }

    const URI = "https://gateway.pinata.cloud/ipfs/QmbJ9d3mp88MK3y4djxU8PsG1m8773wbmPA4JHE6mVcTc7"

    const mintJack = async() => {
        try {
            let signer = provider.getSigner()
            let tx = await pmknTokenContract.connect(signer).approve(
                lotteryContract.address, ethers.utils.parseEther("1")
                )
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
    <>
        <div style={OverlayStyle} onClick={closeModal}/>
        <div style={ModalStyle}>
            <Container>
                    <H1>Mint NFT</H1>
                    <DivBody>
                        <Img src={URI} alt="display image"/>
                    </DivBody>
                    <BottomDiv>
                        <MintButton onClick={mintJack}>
                            Mint JACK NFT
                        </MintButton>
                    </BottomDiv>
                        
            </Container>
        </div>
    </>
    )
}