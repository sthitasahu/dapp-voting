//SPDX-License-Identifier:UNLICENSED
pragma solidity ^0.8.28;
import "hardhat/console.sol";

contract WavePortal{
    uint256 totalWaves;
    uint256 private seed;

    event NewWave(address indexed from,string message,uint256 timestamp);

    struct Wave{
        address Waver;
        string message;
        uint256 timestamp;
    }
    Wave[] waves;


    mapping(address=>uint256) lastWavedAt;

    constructor() payable{
        console.log("I am a smart contract.Wave at me");
        
     }
    
    function wave(string memory _message) public{

        require(block.timestamp-lastWavedAt[msg.sender]>5 minutes,
                "Wait for 15 minutes to wave at me again");

        //update the last time for the current user
        lastWavedAt[msg.sender]=block.timestamp;

        totalWaves+=1;
        console.log("%s has waved!",msg.sender);

        waves.push(Wave(msg.sender,_message,block.timestamp));

        //set a new seed for the current user
        seed=(block.timestamp+block.prevrandao+seed)%100;
        console.log("Random # generated: %d",seed);
        
        
        if (seed<=50){
               console.log("%s won!", msg.sender);

            
            uint256 prizeAmount = 0.00001 ether;
            require(
                prizeAmount <= address(this).balance,
                "Trying to withdraw more money than the contract has."
            );
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to withdraw money from contract.");
        }

        
       

        //emit a newWave event
        emit NewWave(msg.sender,_message,block.timestamp);

       
    }


    function getAllWaves() public view returns (Wave[] memory){
        return waves;
    }


    function getTotalWaves() public view returns (uint256){
        
        return totalWaves;
    }
}