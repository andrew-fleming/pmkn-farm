import React from "react"
import styled from "styled-components";

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
    background: linear-gradient(45deg, #5f3c74, green);
    background-clip: text;
    -webkit-background-clip: text;
    -moz-background-clip: text;
    -moz-text-fill-color: transparent;
    -webkit-text-fill-color: transparent;
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

const Li = styled.li`
    margin: .6rem;
`;

const ClaimButton = styled.button`
    background: linear-gradient(45deg, #5f3c74, green);
    font-size: 1.5rem;
    width: 12rem;
    height: 4rem;
    cursor: pointer;
`;

const BottomDiv = styled.div`
    height: 20%;
`;

export default function LotteryModal() {

    const {
        setIsLotteryOpen,
        provider,
        lotteryContract,
        lotteryBalance,
        lotteryCount,
        winningNumber
    } = useContract();

    const {
        userNFTs
    } = useUser();

    const closeLotteryModal = () => {
        setIsLotteryOpen(false)
    }

    const claimWinnings = async() => {
        try {
            let signer = provider.getSigner()
            let tx = await lotteryContract.connect(signer).claimLottoWinnings()            
            return tx
        } catch (error) {
            alert(error)
        }
    }

    const _winningNumber = winningNumber ? winningNumber : "-"
    const _lotteryCount = lotteryCount ? lotteryCount : "0"
    const _userNFTs = userNFTs ? userNFTs : "-"
    const lotteryPoolAmount = lotteryBalance ? lotteryBalance : "0"
    
return(
    
    <>
        <div style={OverlayStyle} onClick={closeLotteryModal}/>
        <div style={ModalStyle}>
            <Container>
                    <H1>Lottery</H1>
                    <DivBody>
                        <ul>
                            <Li>
                                Lottery Count: {_lotteryCount} 
                            </Li>
                            <Li>
                                Winning Number: {_winningNumber}
                            </Li>
                            <Li>
                                Your Number(s): {_userNFTs}
                            </Li>
                            <Li>
                                Lottery Pool: {lotteryPoolAmount} PMKN
                            </Li>
                        </ul>
                        </DivBody>
                        <BottomDiv>
                        <ClaimButton onClick={claimWinnings}>
                            Claim Winnings
                        </ClaimButton>
                        </BottomDiv>
            </Container>
        </div>
    </>
    )
}