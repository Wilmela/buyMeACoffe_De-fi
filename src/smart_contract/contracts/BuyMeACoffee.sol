// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import 'hardhat/console.sol';

contract BuyMeACoffee{
    address payable public owner;
    uint256 private tipAmount = 0.01 ether;

    uint256 private tipCount;

    struct Note {
        address payable from;
        address payable to;
        uint256 amount;
        string message;
        uint256 timestamp;
    }

    event Tipped(
        address indexed from,
        address indexed to,
        uint256 amount,
        string message,
        uint256 timestamp
        );

    Note[] private notes;

    constructor() {
        owner = payable(msg.sender);
    }

    function getTipAmount() public view returns (uint){
        return tipAmount;
    }
    
    function tipMe( string memory _message ) public payable {
        require(tipAmount > 0 , "Tip must be greaterthan 0");
        require(msg.value == tipAmount, "An amount must be stated");

        tipCount += 1;

        notes.push(Note(payable(msg.sender),payable( address(this)), tipAmount, _message, block.timestamp));

        emit Tipped(msg.sender, address(this), tipAmount, _message, block.timestamp);
    }

    function withdrawEth() public{
        require(owner == msg.sender, "You can only withdraw from your account");
        require(owner.send(address(this).balance));

        payable(owner).transfer(address(this).balance);

    }

    function getAllNotes () public view returns(Note[] memory){
        return notes;
    }

    function getTipCount () public view returns(uint256){
        return tipCount;
    }

}
