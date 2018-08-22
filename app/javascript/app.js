import {
  default as TruffleContract
} from 'truffle-contract';
import contract_artifacts from '../../build/contracts/Token.json';
import {
  default as Web3
} from 'web3';
import $ from "jquery";

var Contract = TruffleContract(contract_artifacts);

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
// setBadge($("#token"), true);
// setBadge($("#owner"), true);

window.Interface = {
  start: async function() {
    Contract.setProvider(web3.currentProvider);
    contractInstance = window.contractInstance = await Contract.deployed();

    web3.eth.getAccounts(async function(err, accounts) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      } else if (accounts.length == 0) {
        alert("You have no Ethereum wallets.");
        return;
      } else {
        currentAccount = window.currentAccount = accounts[0];
        console.log(currentAccount);
        $("#currentAccount").text(currentAccount)
      }

    });
    var balance = await contractInstance.balances.call(window.currentAccount);
    setBadge($("#token"), balance);
    console.log(balance);

    var owner = await contractInstance.owner();
    setBadge($("#owner"), owner.equals(window.currentAccount));
  }
}

$(function() {
  Interface.start();
})
