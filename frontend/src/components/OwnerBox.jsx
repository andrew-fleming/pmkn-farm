import React from "react"
import styled from "styled-components";

//import { useUser } from "../context/UserContext"
import { useContract } from "../context/ContractContext"
//import { ethers } from "ethers";

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
    height: 100%;
    background: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

export default function LotteryBox() {

    //const {
    //    userAddress,
    //} = useUser();
    
    const {
        //lotteryContract,
        linkBalance
    } = useContract();

    
    return(
        <Container>
            <Banner>
                Link Balance: {linkBalance ? linkBalance : "0"}
            </Banner>
        </Container>
    )
}