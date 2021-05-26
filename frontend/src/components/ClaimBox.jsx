import React from "react"
import styled from "styled-components";

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

`;

const ClaimButton = styled.button`
    height: 5rem;
    width: 100%;
    background-color: black;
    color: #7A3803;
    font-size: 1.2rem;
`;

const TopBanner = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.65rem;
    font-weight: bold;
    color: green;
    text-shadow: .03rem .03rem #ED7014;
    ;
`;

const BottomBanner = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 1rem;
    font-weight: bold;
`;

const Circle = styled.button`
    width: 12rem;
    height: 3.7rem;
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
    margin-top: .5rem;
`;

export default function StakeBox(props) {

    return(
        <Container>
            <Banner>
                <TopBanner>
                    <div>
                        789 PMKN
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
                            Rate: 123 / day
                    </Circle>

                </BottomBanner>
            </Banner>
        </Container>
    )
}