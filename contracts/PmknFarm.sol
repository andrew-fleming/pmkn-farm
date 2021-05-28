// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./PmknToken.sol";

/// @title Pmkn Farm
/// @author Andrew Fleming
/// @notice This contract creates a simple yeild farming dApp that rewards users for
///         locking up their DAI stablecoin with a new ERC20 token PmknToken
/// @dev The inherited PmknToken contract automatically mints PMKN when the user invokes the
///      withdrawYield function. The calculateYieldTime and calculateYieldTotal function 
///      takes care of all yield calculations. Ownership of the PmknToken contract should 
///      be transferred to the PmknFarm contract after deployment
contract PmknFarm {

    // userAddress => stakingBalance
    mapping(address => uint256) public stakingBalance;
    // userAddress => isStaking boolean
    mapping(address => bool) public isStaking;
    // userAddress => timeStamp
    mapping(address => uint256) public startTime;
    // userAddress => pmknYield
    mapping(address => uint256) public pmknYield;
    // userAddress => pmknBalance
    mapping(address => uint256) public pmknBalance;

    string public name = "Pmkn Farm";

    IERC20 public daiToken;

    PmknToken public pmknToken;

    event Stake(address from, uint256 amount);
    event Unstake(address from, uint256 amount);
    event YieldWithdraw(address to, uint256 amount);

    constructor(
        IERC20 _daiToken,
        PmknToken _pmknToken
        ) {
            daiToken = _daiToken;
            pmknToken = _pmknToken;
        }

    /// @notice Locks the  user's DAI within the contract
    /// @dev If the user already staked DAI, the 
    /// @param amount Quantity of DAI the user wishes to lock in the contract
    function stake(uint256 amount) public {
        require(
            amount > 0 &&
            daiToken.balanceOf(msg.sender) >= amount, 
            "You cannot stake zero tokens");
        //if(stakingBalance[msg.sender] > 0){
        //    pmknYield[msg.sender] += calculateYieldTotal(msg.sender);
        //}
        daiToken.transferFrom(msg.sender, address(this), amount);
        stakingBalance[msg.sender] += amount;
        startTime[msg.sender] = block.timestamp;
        isStaking[msg.sender] = true;
        emit Stake(msg.sender, amount);
    }

    /// @notice
    /// @dev
    /// @param amount The quantity of DAI the user wishes to receive
    function unstake(uint256 amount) public {
        require(
            isStaking[msg.sender] = true &&
            stakingBalance[msg.sender] >= amount, 
            "Nothing to unstake"
        );
        uint256 toTransfer = calculateYieldTotal(msg.sender);
        stakingBalance[msg.sender] -= amount;
        daiToken.transfer(msg.sender, amount);
        pmknBalance[msg.sender] += toTransfer;
        if(stakingBalance[msg.sender] == 0){
            isStaking[msg.sender] = false;
        }
        emit Unstake(msg.sender, amount);
    }

    /// @notice
    /// @dev
    /// @param user The user
    function calculateYieldTime(address user) public view returns(uint256){
        uint256 end = block.timestamp;
        uint256 totalTime = end - startTime[user];
        return totalTime;
    }

    /// @notice
    /// @dev
    /// @param user The user
    function calculateYieldTotal(address user) public view returns(uint256) {
        uint256 time = calculateYieldTime(user) * 10**18;
        uint256 rate = 86400;
        uint256 timeRate = time / rate;
        uint256 rawYield = (stakingBalance[user] * timeRate) / 10**18;
        return rawYield;
    } 

    /// @notice
    /// @dev
    function withdrawYield() public {
        require(
            pmknYield[msg.sender] > 0 || 
            startTime[msg.sender] != block.timestamp,
            "Nothing to withdraw"
            );

        uint256 toTransfer = calculateYieldTotal(msg.sender);
            
        if(pmknBalance[msg.sender] != 0){
            uint256 oldBalance = pmknBalance[msg.sender];
            pmknBalance[msg.sender] = 0;
            toTransfer += oldBalance;
        }

        startTime[msg.sender] = block.timestamp;
        pmknToken.mint(msg.sender, toTransfer);
        emit YieldWithdraw(msg.sender, toTransfer);
    } 
}