import React from "react"
import styled from "styled-components";
import { ethers } from "ethers";

import { useUser } from '../context/UserContext'

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
    background: linear-gradient(45deg, #2d1b38, #5f3c74);
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
    color: green;
    text-shadow: .03rem .03rem #ED7014;
`;

const BottomBanner = styled.div`
    align-self: center;
    font-size: 1rem;
    font-weight: bold;
`;

const Circle = styled.button`
    width: 12rem;
    height: 4rem;
    border: .05rem dashed #ED7014;
    border-radius: 1rem;
    background-color: transparent;
    color: yellow;
    font-size: 1rem;
    font-weight: bold;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

export default function StakeBox() {

    const {
        stakingBalance,
        pmknYield
    } = useUser();

    const accruingPmkn = pmknYield ? ethers.utils.formatEther(pmknYield) : "0"

    return(
        <Container>
            <Banner>
                <TopBanner>
                    <div>
                        { accruingPmkn } PMKN
                    </div>
                </TopBanner>
            </Banner>
        
            <div>
                <ClaimButton>
                    Claim
                </ClaimButton>
                
            </div>
            <Banner>
                <BottomBanner>

                    <Circle>
                            Rate: { stakingBalance } / day
                    </Circle>

                </BottomBanner>
            </Banner>
        </Container>
    )
}