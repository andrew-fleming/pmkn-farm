import React from "react"
import styled from "styled-components";

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
    background: linear-gradient(45deg, #5f3c74, #ED7014);
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

export default function NFTBox() {
    
    return(
        <Container>
            <Title>
                Mint NFTs
            </Title>
        <Box>
            <Banner>
                <TopBanner>
                    <div>
                        Jack-O'-Lantern
                    </div>
                </TopBanner>
            </Banner>
        
            <BodyDiv>
                <ul>
                    <Li>
                        Purchase a Jack-O'-Lantern NFT for 1 PMKN
                    </Li>
                    <Li>
                        Each minted Jack-O'-Lantern NFT doubles as a lottery ticket
                    </Li>
                    <Li>
                        All PMKN goes toward the lottery pool to win back
                    </Li>
                    <Li>
                        Click on the NFT tab above to mint an NFT
                    </Li>
                </ul>
            </BodyDiv>

            <Banner>
                <BottomBanner>
                    <Circle>
                        <div>
                            Cost: 1 PMKN
                        </div>
                    </Circle>
                </BottomBanner>
            </Banner>
        </Box>
        </Container>
    )
}
