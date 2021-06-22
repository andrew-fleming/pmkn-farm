import React from "react"
import styled from "styled-components";

import { useContract } from "../context/ContractContext"

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 2rem;
`;

const Box = styled.div`
    height: 25rem;
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
    height: 25%;
    background: linear-gradient(45deg, #5f3c74, green);
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const BodyDiv = styled.div`
    width: 100%;
    background-color: black;
    color: #7A3803;
    font-size: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const Li = styled.li`
    margin: .5rem;
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

    const {
        lotteryBalance,
    } = useContract();
    
    return(
        <Container>
            <Title>
                Lottery
            </Title>
        <Box>
            <Banner>
                <TopBanner>
                    <div>
                        Jack-O'-Lottery
                    </div>
                </TopBanner>
            </Banner>
        
            <BodyDiv>
                <ul>
                    <Li>
                        Each minted Jack-O'-Lantern NFT doubles as a lottery ticket
                    </Li>
                    <Li>
                        The tokenId of the JACK NFT is your lottery ticket number
                    </Li>
                    <Li>
                        Winning number is verifiably random using Chainlink's VRF
                    </Li>
                    <Li>
                        Click on the Lottery tab above to see the results of the latest lottery
                    </Li>
                </ul>
            </BodyDiv>

            <Banner>
                <BottomBanner>
                    <Circle>
                        Prize Pool: 
                        <div>
                            {lotteryBalance ? lotteryBalance : "0"} PMKN
                        </div>
                    </Circle>
                </BottomBanner>
            </Banner>
        </Box>
        </Container>
    )
}