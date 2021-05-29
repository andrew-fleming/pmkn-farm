import React from "react"
import styled from "styled-components";

import NavBar from "./NavBar"
import MainCard from "./MainCard"


const Container = styled.div`
    height: 100%;
    width: 100%;
    background-color: #2b2e35;
`;

export default function Main() {
    
    return(
        <>
        <NavBar />
        <Container>
            <MainCard />
        </Container>
        </>
    )
}
