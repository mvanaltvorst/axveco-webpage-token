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

function makeFormInteractable(state) {
  $("input").prop("disabled", !state);
}

window.Interface = {
  start: async function() {
    Contract.setProvider(web3.currentProvider);
    console.log("Getting contract...");
    contractInstance = window.contractInstance = await Contract.deployed();
    console.log("Got contract.");
    var currentAccount;

    web3.eth.getAccounts(async function(err, accounts) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      } else if (accounts.length == 0) {
        alert("You have no Ethereum wallets.");
        return;
      } else {
        currentAccount = window.currentAccount = accounts[0];
        $("#currentAccount").text(currentAccount)
        contractInstance.balances.call(currentAccount).then(res => {
          setBadge($("#token"), res);
        });
      }

    });

    var owner = await contractInstance.owner.call();
    setBadge($("#owner"), owner === window.currentAccount);
    // Only interact with form if you're an owner
    makeFormInteractable(owner === window.currentAccount);
  }
}

function verifyAddress(address) {
  // console.log(address);
  // console.log(address.test(/^0x0{20}$/g));
  return address.match(/^0x[a-zA-Z0-9]{40}$/g) != null;
}

$("button").click(() => {
  //TODO: verify input before sending to smart contract
  //TODO: output window
  var targetAddress = $("input").val();
  if (!verifyAddress(targetAddress)) {
    console.log("Invalid address.");
    return;
  }

  console.log("Sending transaction...");
  window.contractInstance.giveToken.estimateGas(targetAddress,
                                                {
                                                  from: window.currentAccount,
                                                  gasPrice: 2000000000
                                                }).then(_gas => {
    return window.contractInstance.giveToken(targetAddress,
                                             {
                                               from: window.currentAccount,
                                               gasPrice: 2000000000,
                                               gas: _gas
                                             });
  }).then(() => {
    console.log("Transaction succesful.")
  }).catch(err => {
    console.log("Transaction unsuccesful:" + err.message);
  });
})

$(function() {
  Interface.start();
})
