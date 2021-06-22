import React, { useContext } from "react"

export const ContractContext = React.createContext({
    init: "",
    setInit: () => {},
    networkId: "",
    setNetworkId: () => {},
    provider: {},
    setProvider: () => {},
    daiContract: {},
    setDaiContract: () => {},
    linkContract: {},
    setLinkContract: () => {},
    pmknTokenContract: {},
    setPmknTokenContract: () => {},
    pmknFarmContract: {},
    setPmknFarmContract: () => {},
    lotteryContract: {},
    setLotteryContract: () => {},
    isLotteryOpen: false,
    setIsLotteryOpen: () => {},
    isNFTOpen: false,
    setIsNFTOpen: () => {},
    isOwnerOpen: false,
    setIsOwnerOpen: () => {},
    lotteryBalance: "",
    setLotteryBalance: () => {},
    linkBalance: "",
    setLinkBalance: () => {},
    lotteryCount: "",
    setLotteryCount: () => {},
    owner: "",
    setOwner: () => {},
    winningNumber: "",
    setWinningNumber: () => {}
})

export const ContractProvider = ContractContext.Provider
export const useContract = () => useContext(ContractContext)