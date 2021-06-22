// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "@chainlink/contracts/src/v0.8/dev/VRFConsumerBase.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./JackOLantern.sol";
import "./PmknToken.sol";

/// @title Lottery
/// @author Andrew Fleming
/// @notice This contract adds a lottery feature to the PmknFarm contract that uses
///         the NFT tokenId as the "ticket." This contract uses Chainlink's VRF to 
///         achieve verifiable randomness for the winning number
/// @dev Basic iteration of a lottery feature in the PmknFarm dApp. PmknFarm's mintNFT
///      function includes a transfer invokation which funds the lotteryPool. The internal
///      validateWinner function uses ERC721 Enumerable's tokenOfOwnerByIndex function to
///      iterate and validate the user holds the winning tokenId number

contract Lottery is Ownable, VRFConsumerBase {

    uint256 private lotteryPool;
    uint256 public lotteryCount;
    uint256 internal fee;
    bytes32 internal keyHash;

    JackOLantern public jackOLantern;
    PmknToken public pmknToken;
    IERC20 public linkToken;
    
    // lotteryCount => winningNumber
    mapping(uint256 => uint256) public winningNumber;
    // requestId => lotteryCount
    mapping(bytes32 => uint256) public requestIdToCount;

    event LotteryStart(uint256 indexed _lotteryCount, bytes32 indexed _requestId);
    event NumberReceived(bytes32 indexed _requestId, uint256 indexed _winningNumber);
    event LotteryClaim(address indexed winner, uint256 indexed amount);
    event WithdrawLink(address indexed from, uint256 indexed amount);

    /// @notice Sets the necessary contract instances, addresses, and values for
    ///         Chainlink's VRF
    /// @dev Params from _coorAddress to _keyHash necessary for Chainlink's VRF. Preceding
    ///      params used for contract instances
    constructor(
        JackOLantern _jackOLantern,
        PmknToken _pmknToken,
        IERC20 _linkToken,
        address _coorAddress,
        address _linkAddress,
        uint256 _fee,
        bytes32 _keyHash
        ) VRFConsumerBase (
            _coorAddress,
            _linkAddress
        ) {
        jackOLantern = _jackOLantern;
        pmknToken = _pmknToken;
        linkToken = _linkToken;
        fee = _fee;
        keyHash = _keyHash;
    }
    
    /// @notice Starts the lottery
    /// @dev The getRandomNumber function call returns a requestId from invoking the
    ///      requestRandomness function. The requestIdToCount mapping uses the requestId
    ///      as a key to point to the current lotteryCount. The lotteryCount increments by
    ///      thereafter
    function getWinningNumber() public onlyOwner {
        bytes32 requestId = getRandomNumber();
        requestIdToCount[requestId] = lotteryCount;
        emit LotteryStart(lotteryCount, requestId);
        lotteryCount++;
    }

    /// @notice Adds extra obscurity regarding the random number, perhaps not needed?
    /// @dev Remove and incorporate a simple uint variable to save gas. Put the requestRandomness
    ///      call in the getWinningNumber function
    function getRandomNumber() internal returns(bytes32 requestId){
        uint256 userSeed = uint256(keccak256(abi.encodePacked(blockhash(block.number - 1))));
        return requestRandomness(keyHash, fee, userSeed);
    }

    /// @notice Chainlink's VRF returns a call to this function with the requestId and random
    ///         number
    /// @dev Takes the totalSupply of JackOLantern NFTs as the divisor and uses Chainlink's 
    ///      returned number as the dividend. The winningNumber mapping takes the requestIdToCount
    ///      mapping as an argument which uses the _requestId as its argument and points to the
    ///      modulus of the random number and total tokenIds 
    /// @param _requestId The return value used to track the VRF call with the returned uint
    /// @param _randomness The verifiable random number returned from Chainlink's VRF API
    function fulfillRandomness(bytes32 _requestId, uint256 _randomness) internal override {
        uint256 totalIds = jackOLantern.getTotalSupply();
        uint256 winningNum = _randomness % totalIds;
        winningNumber[requestIdToCount[_requestId]] = winningNum;
        emit NumberReceived(_requestId, winningNum);
    }

    /// @notice Adds PMKN to the lotteryPool
    /// @dev The PmknFarm contract primarily calls this function within its mintNFT function
    /// @param from The sender of the tx
    /// @param pmkn The total amount of Pmkn sent
    function addToLotteryPool(address from, uint256 pmkn) public {
        require(pmkn > 0, "Cannot add zero");
        lotteryPool += pmkn;
        pmknToken.transferFrom(from, address(this), pmkn);
    }

    /// @notice An internal function that verifies the user's NFT tokenId matches the 
    ///         winning lottery number
    /// @dev This function fetches the amount of JACK NFTs held by the user. Then, the
    ///      logic iterates the tokenIds and returns true if the tokenId matches the 
    ///      winning number
    /// @param user The address of the user
    function validateWinner(
        address user 
        ) internal 
        returns(bool)
        {
        uint256 totalNfts = jackOLantern.balanceOf(user);
        uint256 winNum = winningNumber[lotteryCount - 1];
        for(uint256 i; i < totalNfts; i++){
            if(jackOLantern.tokenOfOwnerByIndex(user, i) == winNum){
                return true;
            }
        }
    }

    /// @notice Function that allows the user with the winning NFT tokenId to claim
    ///         the lotteryPool winnings
    /// @dev Uses the internal validateWinner function to verify thath the user holds 
    ///      the winning tokenId number. Assigns the toTransfer to hold the lotteryPool
    ///      balance. Resets the lotteryPool balance to zero (following the checks, effects,
    ///      interactions pattern) before transferring the toTranfer amount to the user
    function claimLottoWinnings() public {
        require(
            validateWinner(msg.sender) &&
            lotteryPool > 0,
            "You either did not win or nothing in lotteryPool"
            );
        uint256 toTransfer = lotteryPool;
        lotteryPool = 0;
        pmknToken.transfer(msg.sender, toTransfer);
        emit LotteryClaim(msg.sender, toTransfer);
    }

    /// @notice Withdraws LINK to the owner
    /// @dev Chainlink's VRF requires LINK to call the VRF. This function adds LINK
    ///      for said function call
    function withdrawLink() public onlyOwner {
        uint256 toTransfer = linkToken.balanceOf(address(this));
        linkToken.transfer(msg.sender, toTransfer);
        emit WithdrawLink(msg.sender, toTransfer);
    }

    /// @notice Fetches the LINK balance of the contract
    /// @dev Getter function for fetching the LINK balance of the Lottery contract
    function getLinkBalance() public view returns(uint256){
        return linkToken.balanceOf(address(this));
    }
}
