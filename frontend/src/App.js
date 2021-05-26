import React, { useState } from "react";
import styled from "styled-components";
import Main from "./components/Main";

import { UserProvider } from './context/UserContext'
import { ContractProvider } from './context/ContractContext'

const Container = styled.div`
  width: 100%;
  height: 45.5rem;
`;

function App() {

  /**
   * @notice User state
   */
  const [userAddress, setUserAddress] = useState('')
  const [ethBalance, setEthBalance] = useState('')
  const [daiBalance, setDaiBalance] = useState('')
  const [pmknBalance, setPmknBalance] = useState('')
  const [stakingBalance, setStakingBalance] = useState('')
  const [pmknYield, setPmknYield] = useState('')

  const userState = {
    userAddress, 
    setUserAddress,
    ethBalance, 
    setEthBalance,
    daiBalance,
    setDaiBalance,
    pmknBalance,
    setPmknBalance,
    stakingBalance,
    setStakingBalance,
    pmknYield,
    setPmknYield,
  }

  /**
   * @notice Contract state
   */
  const [networkId, setNetworkId] = useState('')
  //const [provider, setProvider] = useState({})
  const [daiContractBalance, setDaiContractBalance] = useState('')

  const contractState = {
    networkId,
    setNetworkId,
    //provider,
    //setProvider,
    daiContractBalance,
    setDaiContractBalance,
  }





  return (
    <Container>
      <ContractProvider value={contractState}>
        <UserProvider value={userState}>
          <Main />
        </UserProvider>
      </ContractProvider>
    </Container>
  );
}

export default App;
