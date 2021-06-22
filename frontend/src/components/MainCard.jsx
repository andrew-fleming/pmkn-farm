import React from "react"
import styled from "styled-components";
import { ethers } from "ethers";

import StakeBox from "./StakeBox"
import ClaimBox from "./ClaimBox"
import NFTBox from "./NFTBox"
import LotteryBox from "./LotteryBox"

import { useUser } from "../context/UserContext"

const Container = styled.div`
    display: flex;
    justify-content: center;
`;

const Card = styled.div`
    height: 60rem;
    width: 60rem;
    background-color: #5f5d5d;
    margin-top: 3rem;
    border-radius: .3rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    border: .3rem solid black;
`;

const CardBanner = styled.div`
    width: 90%;
    height: 3rem;
    background-color: #2b2e35;
    margin-top: 2rem;
    border: .3rem solid black;
    border-radius: 1.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 1.2rem;
`;

const AlignBox = styled.div`
    display: flex;
    align-items: center;
`;

export default function MainCard() {

    const {
        pmknBalance
    } = useUser();

    return(
        <Container>
            <Card>
                <CardBanner>
                    PMKN Balance: {pmknBalance ? Number.parseFloat(ethers.utils.formatEther(pmknBalance)).toFixed(3).toString() : "0"}
                </CardBanner>
                <AlignBox>
                    <StakeBox />
                    <ClaimBox />
                </AlignBox>
                <AlignBox>
                    <NFTBox />
                    <LotteryBox />
                </AlignBox>
            </Card>
        </Container>
    )
}
