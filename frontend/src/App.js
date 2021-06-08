import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { ethers } from "ethers"

import PmknFarm from "./abis/PmknFarm.json"
import PmknToken from "./abis/PmknToken.json"
import JackOLantern from "./abis/JackOLantern.json"
import ERC20 from "./abis/ERC20.json"

import { UserProvider } from "./context/UserContext"
import { ContractProvider } from "./context/ContractContext"

import Main from "./components/Main";


const Container = styled.div`
  width: 100%;
  height: 50rem;
`;

function App() {

  /**
   * @notice User state
   */
  const [userAddress, setUserAddress] = useState("")
  const [ethBalance, setEthBalance] = useState("")
  const [daiBalance, setDaiBalance] = useState("")
  const [pmknBalance, setPmknBalance] = useState("")
  const [stakingBalance, setStakingBalance] = useState("")
  const [pmknYield, setPmknYield] = useState("")
  const [pmknUnrealizedYield, setPmknUnrealizedYield] = useState("")

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
  const [networkId, setNetworkId] = useState("")
  const [provider, setProvider] = useState({})
  const [daiContract, setDaiContract] = useState({})
  const [pmknTokenContract, setPmknTokenContract] = useState({})
  const [pmknFarmContract, setPmknFarmContract] = useState({})
  const [jackContract, setJackContract] = useState({})

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
    jackContract,
    setJackContract
  }

  /**
   * @notice componentDidMount
   */

  const loadProvider = useCallback(async() => {
    let prov = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(prov)
    return prov
}, [setProvider])

const loadDaiContract = useCallback(async(_provider) => {
    let daiAddress = "0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa"  // Kovan DAI
    let contract = new ethers.Contract(daiAddress, ERC20.abi, _provider)
    setDaiContract(contract)
}, [setDaiContract])

const loadPmknToken = useCallback(async(_provider) => {
    let pmknTokenAddress = "0x5A67113312875395A339bF158E77b7aEca998622" 
    let contract = new ethers.Contract(pmknTokenAddress, PmknToken.abi, _provider)
    setPmknTokenContract(contract)
}, [setPmknTokenContract])

const loadPmknFarmContract = useCallback(async(_provider) => {
    let pmknFarmAddress = "0x21A79e8F883Ea23F6fcbA261aa6Bf4a689E6668B"
    let contract = new ethers.Contract(pmknFarmAddress, PmknFarm.abi, _provider)
    setPmknFarmContract(contract)
}, [setPmknFarmContract])

const loadJackContract = useCallback(async(_provider) => {
  let jackContractAddress = "0x57D3932Ed4C082DE446d07A2814173427aF114FE"
  let contract = new ethers.Contract(jackContractAddress, JackOLantern.abi, _provider)
  setJackContract(contract)
}, [setJackContract])

const componentDidMount = useCallback(async() => {
    await loadProvider().then(async(res) => {
        await loadDaiContract(res)
        await loadPmknToken(res)
        await loadPmknFarmContract(res)
        await loadJackContract(res)
    })
    setInit(true)
}, [
    loadProvider, 
    loadDaiContract, 
    loadPmknToken, 
    loadPmknFarmContract, 
    loadJackContract,
    setInit
])

useEffect(() => {
    if(init === false){
      componentDidMount()
    }
}, [componentDidMount, daiContract, init])

/**
 * @notice userDidMount functions
 */

const loadUser = useCallback(async() => {
  let accounts = provider.getSigner()
  let account = await accounts.getAddress()
  return account
}, [provider])

const loadNetwork = useCallback(async() => {
  let netId = await provider.getNetwork()
  setNetworkId(netId["name"])
}, [provider, setNetworkId])

const loadEthBalance = useCallback(async(user) => {
  let balance = await provider.getBalance(user)
  setEthBalance(balance)
}, [provider, setEthBalance])

const loadDaiBalance = useCallback(async(user) => {
  let balance = await daiContract.balanceOf(user)
  setDaiBalance(balance.toString())
}, [daiContract, setDaiBalance])

const loadPmknBalance = useCallback(async(user) => {
  let balance = await pmknTokenContract.balanceOf(user)
  setPmknBalance(balance.toString())
}, [pmknTokenContract, setPmknBalance])

const loadStakingBalance = useCallback(async(user) => {
  let balance = await pmknFarmContract.stakingBalance(user)
  setStakingBalance(balance.toString())
}, [setStakingBalance, pmknFarmContract])

const loadPmknYield = useCallback(async(user) => {
  let balance = await pmknFarmContract.calculateYieldTotal(user)
  setPmknYield(balance.toString())
}, [setPmknYield, pmknFarmContract])

const loadPmknUnrealizedYield = useCallback(async(user) => {
  let balance = await pmknFarmContract.pmknBalance(user)
  setPmknUnrealizedYield(balance.toString())
}, [setPmknUnrealizedYield, pmknFarmContract])


const userDidMount = useCallback(async() => {
  await loadUser().then(res => {
      setUserAddress(res)
      loadEthBalance(res)
      loadDaiBalance(res)
      loadPmknBalance(res)
      loadStakingBalance(res)
      loadPmknYield(res)
      loadPmknUnrealizedYield(res)
  })
  await loadNetwork()
}, [
  loadUser, 
  loadNetwork, 
  loadEthBalance, 
  loadDaiBalance,
  loadPmknBalance,
  loadStakingBalance,
  setUserAddress,
  loadPmknYield,
  loadPmknUnrealizedYield
])

useEffect(() => {
  if(userAddress === "" && init === true){
    userDidMount()
  }
}, [userDidMount, init, userAddress])

/**
* @notice Events ----------------------------------------->
*/

useEffect(() => {
  if(userAddress !== ""){
      pmknFarmContract.on("Stake", async(userAddress) => {
          loadDaiBalance(userAddress)
          loadStakingBalance(userAddress)
      });

      pmknFarmContract.on("Unstake", async(userAddress) => {
          loadDaiBalance(userAddress)
          loadStakingBalance(userAddress)
      })

      pmknFarmContract.on("YieldWithdraw", async(userAddress) => {
          loadPmknUnrealizedYield(userAddress)
          loadPmknYield(userAddress)
          loadPmknBalance(userAddress)
      })

      pmknFarmContract.on("MintNFT", async(userAddress) => {
        loadPmknBalance(userAddress)
      })
  }

  if(stakingBalance > 0){
      let interval = null
      interval = setInterval(() => {
          loadPmknYield(userAddress)
      }, 20000)
  return () => clearInterval(interval)
  }

}, [
  pmknFarmContract, 
  userAddress, 
  stakingBalance,
  loadDaiBalance, 
  loadStakingBalance,
  loadPmknUnrealizedYield,
  loadPmknYield,
  loadPmknBalance
])

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
