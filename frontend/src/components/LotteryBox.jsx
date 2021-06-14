import React from "react"
import styled from "styled-components";

//import { useUser } from "../context/UserContext"
//import { useContract } from "../context/ContractContext"

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

const Banner = styled.div`
    width: 100%;
    height: 33%;
    background: linear-gradient(45deg, #5f3c74, green);
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const TimeDiv = styled.div`
    height: 5rem;
    width: 100%;
    background-color: black;
    color: #7A3803;
    font-size: 1.6rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
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

export default function LotteryBox() {

    
    return(
        <Container>
            <Title>
                Lottery
            </Title>
        <Box>
            <Banner>
                <TopBanner>
                    <div>
                        Jack-O-Lottery
                    </div>
                </TopBanner>
            </Banner>
        
            <TimeDiv>
                Finished
            </TimeDiv>

            <Banner>
                <BottomBanner>
                    <Circle>
                        Prize Pool: 
                        <div>
                            0 PMKN
                        </div>
                    </Circle>
                </BottomBanner>
            </Banner>
        </Box>
        </Container>
    )
}