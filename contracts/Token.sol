pragma solidity ^0.4.24;


contract Token {
    address public owner; // owner is able to create tokens
    mapping (address => bool) public balances; // true if user has Axveco token, false if not

    event TokensGiven();

    constructor() public {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner of the contract is allowed to do that.");
        _;
    }

    function giveToken(address target) public onlyOwner {
        balances[target] = true;
        emit TokensGiven();
    }

    function giveTokenBulk(address[] targets) public onlyOwner {
      for (uint i = 0; i < targets.length; i++) {
        balances[targets[i]] = true;
      }
      emit TokensGiven();
    }
}
