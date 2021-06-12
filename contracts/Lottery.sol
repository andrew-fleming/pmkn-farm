// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "hardhat/console.sol";

import "@chainlink/contracts/src/v0.8/dev/VRFConsumerBase.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./JackOLantern.sol";

contract Lottery is Ownable, VRFConsumerBase {

    uint256 public linkBalance;
    uint256 public lotteryCount;
    uint256 internal fee;
    bytes32 internal keyHash;

    JackOLantern jackOLantern;
    
    // lotteryCount => boolean
    mapping(uint256 => uint256) public winningNumber;
    // requestId => lotteryCount
    mapping(bytes32 => uint256) requestIdToCount;

    constructor(
        JackOLantern _jackOLantern,
        address _coorAddress,
        address _linkAddress,
        uint256 _fee,
        bytes32 _keyHash
        ) VRFConsumerBase (
            _coorAddress,
            _linkAddress
        ) {
        jackOLantern = _jackOLantern;
        fee = _fee;
        keyHash = _keyHash;
    }
    
    function getWinningNumber() public onlyOwner {
        bytes32 requestId = getRandomNumber();
        requestIdToCount[requestId] = lotteryCount;
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
    }

    function withdrawLink() public onlyOwner {
        uint256 toTransfer = LINK.balanceOf(address(this));
        LINK.transfer(msg.sender, toTransfer);
    }

    function getLinkBalance() public view onlyOwner returns(uint256){
        return LINK.balanceOf(address(this));
    }

}