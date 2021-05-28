import React, { useContext } from "react"

export const ContractContext = React.createContext({
    init: '',
    setInit: () => {},
    networkId: "",
    setNetworkId: () => {},
    provider: {},
    setProvider: () => {},
    daiContract: {},
    setDaiContract: () => {},
    pmknTokenContract: {},
    setPmknTokenContract: () => {},
    pmknFarmContract: {},
    setPmknFarmContract: () => {},
})

export const ContractProvider = ContractContext.Provider
export const useContract = () => useContext(ContractContext)