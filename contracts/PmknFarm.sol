// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./PmknToken.sol";

contract PmknFarm {

    string public name = "Pmkn Farm";

    IERC20 public daiToken;
    PmknToken public pmknToken;

    // userAddress => stakingBalance
    mapping(address => uint256) public stakingBalance;
    // userAddress => isStaking boolean
    mapping(address => bool) public isStaking;
    // userAddress => timeStamp
    mapping(address => uint256) public startTime;
    // userAddress => pmknBalance
    mapping(address => uint256) public pmknBalance;

    constructor(
        IERC20 _daiToken,
        PmknToken _pmknToken
        ) {
            daiToken = _daiToken;
            pmknToken = _pmknToken;
        }

    function stake(uint256 amount) public {
        require(
            amount > 0 &&
            daiToken.balanceOf(msg.sender) >= amount, 
            "You cannot stake zero tokens");
        if(stakingBalance[msg.sender] > 0){
            pmknBalance[msg.sender] += calculateYieldTotal(msg.sender);
            stakingBalance[msg.sender] = 0;
        }
        daiToken.transferFrom(msg.sender, address(this), amount);
        stakingBalance[msg.sender] += amount;
        startTime[msg.sender] = block.timestamp;
        isStaking[msg.sender] = true;
    }

    function unstake() public {
        uint balance = stakingBalance[msg.sender];
        require(balance > 0, "Nothing to unstake");
        stakingBalance[msg.sender] = 0;
        daiToken.transfer(msg.sender, balance);
        isStaking[msg.sender] = false;
    }

    function calculateYieldTime(address user) public view returns(uint256){
        uint256 end = block.timestamp;
        uint256 totalTime = end - startTime[user];
        return totalTime;
    }

    function calculateYieldTotal(address user) public view returns(uint256) {
        uint256 time = calculateYieldTime(user) * 10**18;
        uint256 rate = 86400;
        uint256 timeRate = time / rate;
        uint256 rawYield = (stakingBalance[msg.sender] * timeRate) / 10**18;
        return rawYield;
    } 

    function withdrawYield() public {
        require(
            pmknBalance[msg.sender] > 0 || 
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
    } 
}