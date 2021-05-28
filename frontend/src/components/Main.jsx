import React, { useEffect, useCallback, useMemo, useState } from "react"
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
        setStakingBalance,
        setPmknYield,
        setPmknUnrealizedYield,
    } = useUser();

    /**
     * @notice Imported contract state
     */
    const {
        setNetworkId,
        //provider,
        //setProvider,
    } = useContract();

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    
    const daiAddress = "0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa"
    const daiContract = new ethers.Contract(daiAddress, ERC20.abi, provider);

    const pmknFarmAddress = "0xDf654E5BbaD6d7C5143a4Cae2e700a8996f8FBDE"
    const pmknFarmContract = new ethers.Contract(pmknFarmAddress, PmknFarm.abi, provider)

    const pmknTokenAddress = "0xbD307D0f73253FC670082a97cCA68582f3406a13"
    const pmknTokenContract = new ethers.Contract(pmknTokenAddress, PmknToken.abi, provider)
    
    /**
     * @notice Getters
     */

     //const loadProvider = async() => {
     //    let prov = new ethers.providers.Web3Provider(window.ethereum)
     //    setProvider(prov)
     //}

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




    const componentDidMount = useCallback(async() => {
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
    ])

    useEffect(() => {
        if(userAddress === ''){
            componentDidMount()
        }
    }, [componentDidMount, userAddress])


    /**
     * @notice Contract write methods
     */
    const stake = async(_amount) => {
        let signer = provider.getSigner()
        let amount = ethers.utils.parseEther(_amount)
        let tx = await daiContract.connect(signer).approve(pmknFarmAddress, amount)
        provider.waitForTransaction(tx.hash)
        .then(async() => {
            tx = await pmknFarmContract.connect(signer).stake(amount)
        })
        return tx
    }

    const unstake = async(_amount) => {
        let signer = provider.getSigner()
        let amount = ethers.utils.parseEther(_amount)
        let tx = await pmknFarmContract.connect(signer).unstake(amount)
        return tx
    }

    const withdrawYield = async() => {
        let signer = provider.getSigner()
        let tx = await pmknFarmContract.connect(signer).withdrawYield()
        return tx
    }

    return(
        <>
        <NavBar />
        <Container>
            <MainCard 
            stakeFunc={stake}
            unstakeFunc={unstake}
            withdrawYieldFunc={withdrawYield}
            />
        </Container>
        </>
    )
}
