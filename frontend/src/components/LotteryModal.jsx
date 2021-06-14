import React from "react"
import styled from "styled-components";

//import { useUser } from "../context/UserContext"
import { useContract } from "../context/ContractContext"

const ModalStyle ={
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#FFF',
    height: '15rem',
    width: '30rem',
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
    justify-content: center;
`;

const Div = styled.div`
    display: flex;
    justify-content: center;
    color: green; 
    font-size: 1.5rem;
`;

const Align = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const ClaimButton = styled.button`
    width: 10rem;
    height: 4rem;
    margin-top: 1.5rem;
`;

export default function LotteryModal() {

    const displayLottoNum = "Lottery Count: 2"
    const displayWinningNum = "Winning Number: 5"
    const displayUserNum = "Your Number(s): 2"
    const displayWinningAmount = "Lottery Winnings: 25 PMKN"

    const {
        setIsModalOpen,
        provider,
        pmknFarmContract
    } = useContract();

    function closeModal() {
        setIsModalOpen(false)
    }

    const claimWinnings = async() => {
        try {
            let signer = provider.getSigner()
            let tx = await pmknFarmContract.connect(signer).claimLottery()            
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
                <Div>
                    <Align>
                        <div>
                            {displayLottoNum}
                        </div>
                        <div>
                            {displayWinningNum}
                        </div>
                        <div>
                            {displayUserNum}
                        </div>
                            {displayWinningAmount}
                        <ClaimButton onClick={claimWinnings}>
                            Claim Winnings
                        </ClaimButton>
                    </Align>
                </Div>
            </Container>
        </div>
        
    </>
    )
}