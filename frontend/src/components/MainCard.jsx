import React from "react"
import styled from "styled-components";

import StakeBox from "./StakeBox"
import ClaimBox from "./ClaimBox"

const Container = styled.div`
    display: flex;
    justify-content: center;
`;

const Card = styled.div`
    height: 28rem;
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

export default function MainCard(props) {

    const displayPmkn = props.pmkn ? props.pmkn : "0"

    return(
        <>
        <Container>
            <Card>
                <CardBanner>
                    PMKN Balance: {displayPmkn}
                </CardBanner>
                <AlignBox>
                    <StakeBox 
                        daiBalance={props.dai}
                        stakingBalance={props.stkBalance}
                    />
                    <ClaimBox />
                </AlignBox>
            </Card>
        </Container>
        </>
    )
}
