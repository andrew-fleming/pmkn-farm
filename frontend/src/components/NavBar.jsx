import React from "react";
import styled from "styled-components";
import { ethers } from "ethers";

import { useUser } from "../context/UserContext"
import { useContract } from "../context/ContractContext"

const MetaContainer = styled.div`
    height: 6rem;
    width: 100%;
    background-color: #2b2e35;
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-bottom: .04rem solid green;
`;

const Container = styled.div`
    display: flex;
    justify-content: space-between;
`;

const Title = styled.div`
    font-size: 1.8rem;
    color: #ED7014;
    text-shadow: .03rem .03rem green;
    margin-left: 2rem;
`;

const SubContainer = styled.div`
    display: flex;
    align-items: center;
`;

const Network = styled.div`
    font-size: 1.5rem;
    color: white;
    margin-right: 2rem;
`;

const AccountWrapper = styled.div`
    height: 2.1rem;
    width: 15rem;
    font-size: 1.2rem;
    background: linear-gradient(45deg, #ED7014, #6e3003);
    margin-right: 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: .8rem;
`;

const Account = styled(AccountWrapper)`
    width: 9rem;
    background-color: black;
    height: 2rem;
    display: flex;
    justify-content: center;
    margin-right: 0;
    color: #7A3803;
    background: black;
`;

const Eth = styled.div`
    margin-left: .5rem;
`;

 
export default function NavBar() {

    const {
        userAddress,
        ethBalance
    } = useUser();

    const {
        networkId
    } = useContract();



    return(
            <MetaContainer>
                <Container>
                    <Title>Pumpkin Farm</Title>
                    <SubContainer>
                        <Network>
                            { networkId ? networkId.charAt(0).toUpperCase() + networkId.slice(1) : "N/A" }
                        </Network>
                        <AccountWrapper>
                            <Eth>
                                { ethBalance ? Number.parseFloat(ethers.utils.formatEther(ethBalance)).toPrecision(3) : "0" } ETH
                                </Eth>
                            <Account>
                                { userAddress ? userAddress.slice(0, 5) + "..." + userAddress.slice(38, 42) : null }
                            </Account>
                    
                        </AccountWrapper>
                    </SubContainer>
                </Container>
            </MetaContainer>
    )
}