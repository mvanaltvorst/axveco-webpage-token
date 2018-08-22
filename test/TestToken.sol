pragma solidity ^0.4.24;
import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Token.sol";

contract TestToken {
    address owner;
    Token token = Token(DeployedAddresses.Token());

    constructor() {
        owner = msg.sender;
    }

    function testSameOwner() public {
        address expected = owner;
        address tokens_owner = token.owner();
        Assert.equal(tokens_owner, expected, "The owner isn't the address we expected.");
    }
}
