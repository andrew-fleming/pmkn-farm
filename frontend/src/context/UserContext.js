import React, { useContext } from 'react'

export const UserContext = React.createContext({
    userAddress: "",
    setUserAddress: () => [],
    ethBalance: "",
    setEthBalance: () => {},
    daiBalance: "",
    setDaiBalance: () => {},
    pmknBalance: "",
    setPmknBalance: () => {},
    stakingBalance: "",
    setStakingBalance: () => {},
    pmknYield: "",
    setPmknYield: () => {},
    pmknUnrealizedYield: "",
    setPmknUnrealizedYield: () => {},
    userNFTs: "",
    setUserNFTs: () => {},
})

export const UserProvider = UserContext.Provider
export const useUser = () => useContext(UserContext)