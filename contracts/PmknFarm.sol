// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./PmknToken.sol";
import "./JackOLantern.sol";

/// @title Pmkn Farm
/// @author Andrew Fleming
/// @notice This contract creates a simple yield farming dApp that rewards users for
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
    // userAddress => pmknBalance
    mapping(address => uint256) public pmknBalance;

    string public name = "Pmkn Farm";

    IERC20 public daiToken;
    PmknToken public pmknToken;
    JackOLantern public jackOLantern;

    uint256 private nftPrice;

    event Stake(address indexed from, uint256 amount);
    event Unstake(address indexed from, uint256 amount);
    event YieldWithdraw(address indexed to, uint256 amount);

    constructor(
        IERC20 _daiToken,
        PmknToken _pmknToken,
        JackOLantern _jackOLantern,
        uint256 _nftPrice
        ) {
            daiToken = _daiToken;
            pmknToken = _pmknToken;
            jackOLantern = _jackOLantern;
            nftPrice = _nftPrice;
        }

    /// @notice Locks the user's DAI within the contract
    /// @dev If the user already staked DAI, the 
    /// @param amount Quantity of DAI the user wishes to lock in the contract
    function stake(uint256 amount) public {
        require(
            amount > 0 &&
            daiToken.balanceOf(msg.sender) >= amount, 
            "You cannot stake zero tokens");

        if(isStaking[msg.sender] == true){
            uint256 toTransfer = calculateYieldTotal(msg.sender);
            pmknBalance[msg.sender] += toTransfer;
        }

        daiToken.transferFrom(msg.sender, address(this), amount);
        stakingBalance[msg.sender] += amount;
        startTime[msg.sender] = block.timestamp;
        isStaking[msg.sender] = true;
        emit Stake(msg.sender, amount);
    }

    /// @notice Retrieves funds locked in contract and sends them back to user
    /// @dev The yieldTransfer variable transfers the calculatedYieldTotal result to pmknBalance
    ///      in order to save the user's unrealized yield
    /// @param amount The quantity of DAI the user wishes to receive
    function unstake(uint256 amount) public {
        require(
            isStaking[msg.sender] = true &&
            stakingBalance[msg.sender] >= amount, 
            "Nothing to unstake"
        );
        uint256 yieldTransfer = calculateYieldTotal(msg.sender);
        uint256 balTransfer = amount;
        amount = 0;
        stakingBalance[msg.sender] -= balTransfer;
        daiToken.transfer(msg.sender, balTransfer);
        pmknBalance[msg.sender] += yieldTransfer;
        if(stakingBalance[msg.sender] == 0){
            isStaking[msg.sender] = false;
        }
        emit Unstake(msg.sender, balTransfer);
    }

    /// @notice Helper function for determining how long the user staked
    /// @dev Kept visibility public for testing
    /// @param user The user
    function calculateYieldTime(address user) public view returns(uint256){
        uint256 end = block.timestamp;
        uint256 totalTime = end - startTime[user];
        return totalTime;
    }

    /// @notice Calculates the user's yield while using a 86400 second rate (for 100% returns in 24 hours)
    /// @dev Solidity does not compute fractions or decimals; therefore, time is multiplied by 10e18
    ///      before it's divided by the rate. rawYield thereafter divides the product back by 10e18
    /// @param user The user
    function calculateYieldTotal(address user) public view returns(uint256) {
        uint256 time = calculateYieldTime(user) * 10**18;
        uint256 rate = 86400;
        uint256 timeRate = time / rate;
        uint256 rawYield = (stakingBalance[user] * timeRate) / 10**18;
        return rawYield;
    } 

    /// @notice Transfers accrued PMKN yield to the user
    /// @dev The if conditional statement checks for a stored PMKN balance. If it exists, the
    ///      the accrued yield is added to the accruing yield before the PMKN mint function is called
    function withdrawYield() public {
        uint256 toTransfer = calculateYieldTotal(msg.sender);

        require(
            toTransfer > 0 ||
            pmknBalance[msg.sender] > 0,
            "Nothing to withdraw"
            );
            
        if(pmknBalance[msg.sender] != 0){
            uint256 oldBalance = pmknBalance[msg.sender];
            pmknBalance[msg.sender] = 0;
            toTransfer += oldBalance;
        }

        startTime[msg.sender] = block.timestamp;
        pmknToken.mint(msg.sender, toTransfer);
        emit YieldWithdraw(msg.sender, toTransfer);
    } 

    /// @notice
    /// @dev 
    /// @param user g
    /// @param tokenURI g
    function mintNFT(address user, string memory tokenURI) public {
        require(
            pmknToken.balanceOf(msg.sender) >= nftPrice, 
            "Not enough PMKN"
        );
        pmknToken.transferFrom(msg.sender, address(this), nftPrice);
        jackOLantern.mintItem(user, tokenURI);
    }
}