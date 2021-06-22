import React, { useState } from "react"
import styled from "styled-components";
import { ethers } from "ethers";
import MarkDai from "../assets/Mark_Dai.svg";

import { useUser } from "../context/UserContext"
import { useContract } from "../context/ContractContext"

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 2rem;
`;

const Box = styled.div`
    height: 15rem;
    width: 22rem;
    background-color: #2b2e35;
    display: flex;
    flex-direction: column;
    margin-top: 1rem;
    border: .3rem solid black;
`;

const Title = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 1.5rem;
    color: white;
`

const Img = styled.img`
    height: 1.5rem;
    width: 1.5rem;
    margin-right: .4rem;
`;

const Banner = styled.div`
    width: 100%;
    height: 33%;
    background: linear-gradient(45deg, #ED7014, #6e3003);
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const StakeInput = styled.input`
    height: 3rem;
    width: 100%;
`;

const StakeButton = styled.button`
    height: 3rem;
    width: 50%;
    background-color: black;
    color: #7A3803;
    font-size: 1.2rem;
    cursor: pointer;
`;

const AlignInput = styled.div`
    display: flex;
    align-items: center;
`;

const TopBanner = styled.div`
    align-self: center;
    font-size: 1.25rem;
    font-weight: bold;
`;

const BottomBanner = styled.div`
    display: flex;
    justify-content: space-around;
    font-size: 1rem;
    font-weight: bold;
`;

const Circle = styled.button`
    width: 7rem;
    height: 3.7rem;
    font-size: 1rem;
    font-weight: bold;
    background-color: transparent;
    border: .05rem dashed yellow;
    border-radius: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

export default function StakeBox() {

    const {
        daiBalance, 
        stakingBalance,
    } = useUser();

    const {
        provider,
        daiContract,
        pmknFarmContract,
    } = useContract();

    const [ transferAmount, setTransferAmount ] = useState("");

    /**
     * @notice Fired when user types in input. Sets transfer amount for stake/unstake functions 
     */
    const handleTransfer = (event) => {
        setTransferAmount(event.target.value)
    }

    /**
     * @notice Calls the stake function
     */
    const stake = async() => {
        try {
            let signer = provider.getSigner()
            let amount = ethers.utils.parseEther(transferAmount)
            let tx = await daiContract.connect(signer).approve(pmknFarmContract.address, amount)
            provider.waitForTransaction(tx.hash)
            .then(async() => {
                tx = await pmknFarmContract.connect(signer).stake(amount)
            })
            return tx
        } catch (error) {
            alert(error)
        }
    }

    /**
     * @notice Calls the unstake function
     */
    const unstake = async() => {
        try {
            let signer = provider.getSigner()
            let amount = ethers.utils.parseEther(transferAmount)
            let tx = await pmknFarmContract.connect(signer).unstake(amount)
            return tx
        } catch (error) {
            alert(error)
        }
    }

    return(
        <Container>
            <Title>
                Stake/Unstake
            </Title>
            <Box>
                <Banner>
                    <TopBanner>
                    <Img src={MarkDai} alt="DAI logo"/>
                            DAI (1 PMKN / Day)
                    </TopBanner>
                </Banner>
                <AlignInput>
                    <StakeInput 
                        onChange={handleTransfer} 
                        placeholder="Input Amount"
                    />
                </AlignInput>
                <div>
                    <StakeButton onClick={stake}>
                        Stake
                    </StakeButton>
                    <StakeButton onClick={unstake}>
                        Unstake
                    </StakeButton>
                </div>
                <Banner>
                    <BottomBanner>
                    </BottomBanner>
                    <BottomBanner>
                        <Circle>
                            Unstaked:
                            <div>
                                { daiBalance ? ethers.utils.formatEther(daiBalance) : "0" }
                            </div>
                        </Circle>
                        <Circle>
                            Staked:
                            <div>
                                { stakingBalance ? ethers.utils.formatEther(stakingBalance) : "0" }
                            </div>
                        </Circle>
                    </BottomBanner>
                </Banner>
            </Box>
        </Container>
    )
}