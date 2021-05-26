import React, { useState, useEffect, useCallback } from "react"
import styled from "styled-components";
import { ethers } from "ethers"

import PmknFarm from "../abis/PmknFarm.json"
import PmknToken from "../abis/PmknToken.json"
import ERC20 from "../abis/ERC20.json"

import NavBar from "./NavBar"
import MainCard from "./MainCard"

const Container = styled.div`
    height: 100%;
    width: 100%;
    background-color: #2b2e35;
`;

export default function Main() {

    const [userAddress, setUserAddress] = useState('')
    const [networkId, setNetworkId] = useState('')
    const [ethBalance, setEthBalance] = useState('')
    const [daiBalance, setDaiBalance] = useState('')
    const [pmknBalance, setPmknBalance] = useState('')
    const [stakingBalance, setStakingBalance] = useState('')

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    
    const daiAddress = "0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa"
    const daiContract = new ethers.Contract(daiAddress, ERC20.abi, provider);

    const pmknFarmAddress = "0xe671dE15B075F4ac74dC37bd467e8A73B68Fb0FE"
    const pmknFarmContract = new ethers.Contract(pmknFarmAddress, PmknFarm.abi, provider)

    const pmknTokenAddress = "0x2216Fd2A05b603c14d01290cDe48e652944c4853"
    const pmknTokenContract = new ethers.Contract(pmknTokenAddress, PmknToken.abi, provider)
    
    /**
     * @notice Getters
     */

    const loadUser = useCallback(async() => {
        let account = await signer.getAddress()
        return account
    }, [signer])

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
    }, [daiContract])

    const loadPmknBalance = useCallback(async(user) => {
        let balance = await pmknTokenContract.balanceOf(user)
        setPmknBalance(balance.toString())
    }, [pmknTokenContract, setPmknBalance])

    const loadStakingBalance = useCallback(async(user) => {
        let balance = await pmknFarmContract.stakingBalance(user)
        setStakingBalance(balance)
    }, [setStakingBalance, pmknFarmContract])


    const componentDidMount = useCallback(async() => {
        await loadUser().then(res => {
            setUserAddress(res)
            loadEthBalance(res)
            loadDaiBalance(res)
            loadPmknBalance(res)
            loadStakingBalance(res)
        })
        await loadNetwork()
    }, [
        loadUser, 
        loadNetwork, 
        loadEthBalance, 
        loadDaiBalance,
        loadPmknBalance,
        loadStakingBalance
    ])

    useEffect(() => {
        if(userAddress === ''){
            componentDidMount()
        }
    }, [componentDidMount, userAddress])

    return(
        <>
        <NavBar 
            userAddress={userAddress}
            networkId={networkId}
            ethBalance={ethBalance}
            />
        <Container>
            <MainCard 
            dai={daiBalance}
            pmkn={pmknBalance}
            stkBalance={stakingBalance}
            />
        </Container>
        </>
    )
}
