import React, { useEffect, useCallback } from "react"
import styled from "styled-components";
import { ethers } from "ethers"

import PmknFarm from "../abis/PmknFarm.json"
import PmknToken from "../abis/PmknToken.json"
import ERC20 from "../abis/ERC20.json"

import NavBar from "./NavBar"
import MainCard from "./MainCard"

import { useUser } from '../context/UserContext'
import { useContract } from '../context/ContractContext'

const Container = styled.div`
    height: 100%;
    width: 100%;
    background-color: #2b2e35;
`;

export default function Main() {

    /**
     * @notice Imported user state
     */
    const {
        userAddress, 
        setUserAddress,
        setEthBalance,
        setDaiBalance,
        setPmknBalance,
        stakingBalance,
        setStakingBalance,
        setPmknYield,
        setPmknUnrealizedYield,
    } = useUser();

    /**
     * @notice Imported contract state
     */
    const {
        init, 
        setInit,
        setNetworkId,
        provider,
        setProvider,
        daiContract,
        setDaiContract,
        pmknTokenContract,
        setPmknTokenContract,
        pmknFarmContract,
        setPmknFarmContract,
    } = useContract();

    /**
     * @notice componentDidMount functions
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
        let pmknTokenAddress = "<INSERT_PMKN_TOKEN_ADDRESS_HERE>" 
        let contract = new ethers.Contract(pmknTokenAddress, PmknToken.abi, _provider)
        setPmknTokenContract(contract)
    }, [setPmknTokenContract])

    const loadPmknFarmContract = useCallback(async(_provider) => {
        let pmknFarmAddress = "<INSERT_PMKN_FARM_ADDRESS_HERE>"
        let contract = new ethers.Contract(pmknFarmAddress, PmknFarm.abi, _provider)
        setPmknFarmContract(contract)
    }, [setPmknFarmContract])

    const componentDidMount = useCallback(async() => {
        await loadProvider().then(async(res) => {
            await loadDaiContract(res)
            await loadPmknToken(res)
            await loadPmknFarmContract(res)
        })
        setInit(true)
    }, [
        loadProvider, 
        loadDaiContract, 
        loadPmknToken, 
        loadPmknFarmContract, 
        setInit
    ])

    useEffect(() => {
        if(init === false){
            componentDidMount()
        }
    }, [componentDidMount, daiContract, init])
    
    /**
     * @notice UserDidMount functions
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
        if(userAddress === '' && init === true){
            userDidMount()
        }
    }, [userDidMount, init, userAddress])

   /**
    * @notice Events ----------------------------------------->
    */

    useEffect(() => {
        if(userAddress !== ''){
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

    return(
        <>
        <NavBar />
        <Container>
            <MainCard />
        </Container>
        </>
    )
}
