import React, { useContext } from "react"

export const ContractContext = React.createContext({
    networkId: "",
    setNetworkId: () => {},
    //provider: "",
    //setProvider: () => {},
    daiContractBalance: "",
    setDaiContractBalance: () => {},
})

export const ContractProvider = ContractContext.Provider
export const useContract = () => useContext(ContractContext)