import React, { useState } from "react"
import styled from "styled-components";
import { ethers } from "ethers" 

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

const Container = styled.div` // 3 divs space around
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
`;

const H1 = styled.h1`
    background: linear-gradient(45deg, #5f3c74, white);
    background-clip: text;
    -webkit-background-clip: text;
    -moz-background-clip: text;
    -moz-text-fill-color: transparent;
    -webkit-text-fill-color: transparent;
    display: flex;
    justify-content: center;
    align-items: flex-end;
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

const Input = styled.input`
    width: 5rem;
    height: 1.5rem;
    margin-top: .5rem;
`;

const LinkButton = styled.button`
    width: 5rem;
    height: 1.9rem;
    cursor: pointer;
`;

const BottomDiv = styled.div`
    height: 20%;
`;

const LotteryButton = styled.button`
    width: 12rem;
    height: 4rem;
    background: linear-gradient(45deg, #5f3c74, white); 
    cursor: pointer;
`;
 
export default function OwnerModal() {

    const [ transferAmount, setTransferAmount ] = useState("");

    const {
        linkBalance,
        provider,
        lotteryContract,
        linkContract,
        setIsOwnerOpen
    } = useContract();

    const closeModal = () => {
        setIsOwnerOpen(false)
    }

    const handleTransfer = (event) => {
        setTransferAmount(event.target.value)
    } 

    const addLink = async() => {
        try {
            let signer = provider.getSigner()
            let amount = ethers.utils.parseEther(transferAmount)
            let tx = await linkContract.connect(signer).transfer(lotteryContract.address, amount)
            return tx
        } catch (error) {
            alert(error)
        }
    }

    const withdrawLink = async() => {
        try {
            let signer = provider.getSigner()
            let tx = await lotteryContract.connect(signer).withdrawLink()
            return tx
        } catch (error) {
            alert(error)
        }
    }

    const startLottery = async() => {
        try {
            let signer = provider.getSigner()
            let tx = await lotteryContract.connect(signer).getWinningNumber()
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
                <H1>
                    Owner
                </H1>
                <DivBody>
                    <div>
                        Link Balance: {linkBalance ? linkBalance : "-"}
                    </div>
                    <div>
                        <Input placeholder="Link Amount" onChange={handleTransfer} />
                        <LinkButton onClick={addLink}>
                            Add Link
                        </LinkButton>
                        <LinkButton onClick={withdrawLink}>
                            Withdraw
                        </LinkButton>
                    </div>  
                </DivBody>
                <BottomDiv>
                    <LotteryButton onClick={startLottery}>
                        Start Lottery
                    </LotteryButton>
                </BottomDiv>
            </Container>
        </div>
    </>
    )
}