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
  $("textarea").prop("disabled", !state);
  $("button").prop("disabled", !state);
}

window.App = {
  updateHasToken: async function() {
    $("#currentAccount").text(currentAccount)
    contractInstance.balances.call(currentAccount).then(res => {
      setBadge($("#token"), res);
    });
  },
  updateCurrentAccount: async function() {
    $("#currentAccount").text(currentAccount)
    App.updateIsOwner();
    App.updateHasToken();
  },
  updateIsOwner: async function() {
    var owner = await contractInstance.owner.call();
    setBadge($("#owner"), owner === window.currentAccount);
    // Only interact with form if you're an owner
    makeFormInteractable(owner === window.currentAccount);
  },
  eventWatchers: async function() {
    let tokensGivenEvent = contractInstance.TokensGiven({}, {
      fromBlock: 0,
      toBlock: "latest"
    });
    setInterval(function() {
      if (web3.eth.accounts[0] !== currentAccount) {
        currentAccount = web3.eth.accounts[0];
        App.updateCurrentAccount();
      }
    }, 100);
    tokensGivenEvent.watch((err, _) => {
      if (err != null) {
        console.error("Error waching for tokens given: " + err.message);
      }
      App.updateHasToken();
    })
  },
  start: async function() {
    Contract.setProvider(web3.currentProvider);
    window.contractInstance = await Contract.deployed();

    web3.eth.getAccounts(async function(err, accounts) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      } else if (accounts.length == 0) {
        alert("You have no Ethereum wallets.");
        return;
      } else {
        window.currentAccount = accounts[0];
        App.updateHasToken();
      }

    });

    App.eventWatchers();
  }
}

function verifyAddress(address) {
  return address.match(/^0x[a-zA-Z0-9]{40}$/g) != null;
}

$("button").click(() => {
  //TODO: output window
  var targetAddresses = $("textarea").val().split('\n');
  for (var i = 0; i < targetAddresses.length; i++) {
    if (!verifyAddress(targetAddresses[i])) {
      alert("Address " + targetAddresses[i] + " is invalid.");
      return;
    }
  }
  console.log("Sending transaction...");
  window.contractInstance.giveTokenBulk.estimateGas(targetAddresses,
                                                    {
                                                      from: window.currentAccount,
                                                      gasPrice: 2000000000
                                                    }).then(_gas => {
    return window.contractInstance.giveTokenBulk(targetAddresses,
                                                 {
                                                   from: window.currentAccount,
                                                   gasPrice: 2000000000,
                                                   gas: _gas
                                                 });
  }).then(() => {
    console.log("Transaction succesful.")
  }).catch(err => {
    console.error("Transaction unsuccesful: " + err.message);
  });
})

$(function() {
  App.start();
})
