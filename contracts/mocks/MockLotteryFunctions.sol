// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "@chainlink/contracts/src/v0.8/dev/VRFConsumerBase.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../JackOLantern.sol";
import "../PmknToken.sol";

contract MockLotteryFunctions is Ownable, VRFConsumerBase {

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
    event AddPmkn(address indexed from, uint256 indexed amount);
    event WithdrawLink(address indexed from, uint256 indexed amount);

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
    
    function getWinningNumber() public onlyOwner {
        bytes32 requestId = getRandomNumber();
        requestIdToCount[requestId] = lotteryCount;
        emit LotteryStart(lotteryCount, requestId);
        lotteryCount++;
    }

    function getRandomNumber() internal returns(bytes32 requestId){
        uint256 userSeed = uint256(keccak256(abi.encodePacked(blockhash(block.number - 1))));
        return requestRandomness(keyHash, fee, userSeed);
    }

    function fulfillRandomness(bytes32 _requestId, uint256 _randomness) internal override {
        uint256 totalIds = jackOLantern.getTotalSupply();
        uint256 winningNum = (_randomness % totalIds) + 1;
        winningNumber[requestIdToCount[_requestId]] = winningNum;
        emit NumberReceived(_requestId, winningNum);
    }

    function addToLotteryPool(address from, uint256 pmkn) public {
        require(pmkn > 0, "Cannot add zero");
        lotteryPool += pmkn;
        pmknToken.transferFrom(from, address(this), pmkn);
        emit AddPmkn(msg.sender, pmkn);
    }

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

    function withdrawLink() public onlyOwner {
        uint256 toTransfer = linkToken.balanceOf(address(this));
        linkToken.transfer(msg.sender, toTransfer);
        emit WithdrawLink(msg.sender, toTransfer);
    }

    function getLinkBalance() public view returns(uint256){
        return linkToken.balanceOf(address(this));
    }

    ///
    /// Test Functions
    ///

    bytes32 public __requestId = keccak256("5");

    function testGetWinningNumber0() public {
        requestIdToCount[__requestId] = lotteryCount;
        testFulfillRandomness(__requestId, 0);
        emit LotteryStart(lotteryCount, __requestId);
        lotteryCount++;
    }

    function testGetWinningNumber() public {
        requestIdToCount[__requestId] = lotteryCount;
        testFulfillRandomness(__requestId, 99);
        emit LotteryStart(lotteryCount, __requestId);
        lotteryCount++;
    }

    function testFulfillRandomness(bytes32 __RequestId, uint256 _randomness) public {
        uint256 totalIds = jackOLantern.getTotalSupply();
        uint256 winningNum = (_randomness % totalIds);
        winningNumber[requestIdToCount[__RequestId]] = winningNum;
        emit NumberReceived(__RequestId, winningNum);
    }
}