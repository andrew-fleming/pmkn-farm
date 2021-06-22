import React from "react";
import styled from "styled-components";

import NavBar from "./NavBar";
import MainCard from "./MainCard";
import LotteryModal from "./LotteryModal";
import NFTModal from "./NFTModal"
import OwnerModal from "./OwnerModal"

import { useContract } from "../context/ContractContext"; 


const Container = styled.div`
    height: 100%;
    width: 100%;
    background-color: #2b2e35;
`;

export default function Main() {

    const {
        isLotteryOpen,
        isNFTOpen,
        isOwnerOpen
    } = useContract();

    
    return(
        <>
        <NavBar />
        <Container>
            {isLotteryOpen ? <LotteryModal /> : null}
            {isNFTOpen ? <NFTModal /> : null}
            {isOwnerOpen ? < OwnerModal/> : null}
            <MainCard />
        </Container>
        </>
    )
}
