import {
  default as contract
} from 'truffle-contract';
import contract_artifacts from '../../build/contracts/Token.json';
import {
  default as Web3
} from 'web3';
import $ from "jquery";

var Contract = contract(contract_artifacts);
// var contractInstance = Contract.deployed();
// const tokenContractAddress = "0xd7787ae4eb81d944821d1296f8e661c3106289dc";

function setBadge(badge, state) {
  // Sets a badge depending on the boolean `state`
  if (state) {
    badge.text("true");
    badge.removeClass("badge-danger");
    badge.addClass("badge-success");
  } else {
    badge.text("false");
    badge.removeClass("badge-success");
    badge.addClass("badge-danger");
  }
}
// if (contract)
setBadge($("#token"), true);
setBadge($("#owner"), true);
// contractInstance.then((a) => { console.log(a); });

window.Interface = {
  start: async function() {
    Contract.setProvider(web3.currentProvider);
    contractInstance = window.contractInstance = await Contract.deployed();

    web3.eth.getAccounts(async function(err, accounts) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      } else if (accounts.length == 0) {
        alert("You have no Ethereum accounts.");
        return;
      } else {
        currentAccount = window.currentAccount = accounts[0];
        $("#currentAccount").text(currentAccount)
      }
      console.log(contractInstance.owner);

    })
  }
}

$(function() {
  Interface.start();
})
