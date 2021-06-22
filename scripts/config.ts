import { ethers } from "ethers";
import { BigNumber } from "ethers";

type DeployParams = Array<string>
type LotteryParams = Array<string | BigNumber>

/**
 * @notice PmknFarm Kovan Network
 */
export const mainConfig: DeployParams = [
    "0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa", // Dai address
]

export const lottoConfig: LotteryParams = [
    "0xa36085F69e2889c224210F603D836748e7dC0088", // Link address
    "0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9", // Coordinator
    "0xa36085F69e2889c224210F603D836748e7dC0088", // LINK address
    ethers.utils.parseEther(".1"), // VRF price
    "0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4" // KeyHash
]
