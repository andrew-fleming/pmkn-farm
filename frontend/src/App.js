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
  const [pmknUnrealizedYield, setPmknUnrealizedYield] = useState('')

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
    pmknUnrealizedYield,
    setPmknUnrealizedYield,
  }

  /**
   * @notice Contract state
   */
  const [init, setInit] = useState(false)
  const [networkId, setNetworkId] = useState('')
  const [provider, setProvider] = useState({})
  const [daiContract, setDaiContract] = useState({})
  const [pmknTokenContract, setPmknTokenContract] = useState({})
  const [pmknFarmContract, setPmknFarmContract] = useState({})

  const contractState = {
    init,
    setInit,
    networkId,
    setNetworkId,
    provider,
    setProvider,
    daiContract,
    setDaiContract,
    pmknTokenContract,
    setPmknTokenContract,
    pmknFarmContract,
    setPmknFarmContract,
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
