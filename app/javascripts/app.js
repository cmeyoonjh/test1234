// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import myToken_artifacts from '../../build/contracts/MyToken.json'


// MetaCoin is our usable abstraction, which we'll use through the code below.
var MyToken = contract(myToken_artifacts);

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;

window.App = {
  start: function() {
    var self = this;

    // Bootstrap the MetaCoin abstraction for Use.
      MyToken.setProvider(web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      accounts = accs;
      account = accounts[1];

      self.totalSupply(); // 총 발행량
      self.refreshBalance(); //수익이더
      self.halt(); //오픈상태
    });
  }, //start
    halt:function(){
      var self = this;
      MyToken.deployed().then(function (instance) {
        var token = instance;
        return token.getHalt();
      }).then(function (value) {
        if(value){
            document.getElementById("openCheck").innerHTML = "OPEN";
        }else{
            document.getElementById("openCheck").innerHTML = "CLOSE";
        }
      }).catch(function (e) {
        console.log(e);
        self.setStatus("Error getting Halt")
      })
    },
    changeOwner:function(){
        var self = this;
        self.setStatus("ownerChange transaction... (please wait)");
        MyToken.deployed().then(function(instance) {
            var token = instance;
            return token.acceptOwnership({from: '0x95491136C7dE7f6a4763abDdc66D4A0839E40638'});
        }).then(function() {
            self.setStatus("ChangeOwner Transaction complete!");
        }).catch(function (e) {
            console.log(e);
            self.setStatus("Error changeOwner; see log.");
        })
    },
    haltChange: function(){
      var self = this;
      self.setStatus("haltChange transaction... (please wait)");

      MyToken.deployed().then(function (instance) {
          var token = instance;
          //alert(document.getElementById("openCheck").text);

         if(document.getElementById("openCheck").text=="OPEN"){
            return token.stop({from: '0x95491136C7dE7f6a4763abDdc66D4A0839E40638'});
          }else{
            return token.start({from: '0x95491136C7dE7f6a4763abDdc66D4A0839E40638'});
          }
      }).then(function() {
          self.setStatus("Change Transaction complete!");
          self.halt();
      }).catch(function (e) {
          console.log(e);
          self.setStatus("Error getting Halt Change");
      })
    },

    totalSupply: function(){
      var self = this;
      MyToken.deployed().then(function(instance) {
          var token = instance;
          //return token.getTotalSupply();
          return token.getMsgSender();
      }).then(function(value){
          document.getElementById("totalSupply_").innerHTML = value;
      }).catch(function (e) {
          console.log(e);
          self.setStatus("Error getting Supply; see log.");
      })
    },//totalSupply


  setStatus: function(message) {
    var status = document.getElementById("status");
    status.innerHTML = message;
  }, //setStatus

  refreshBalance: function() {
    var self = this;

    var token;
    MyToken.deployed().then(function(instance) {
      token = instance;
      return instance.getEtherWallet();
    }).then(function(value) {
      var balance_element = document.getElementById("etherWallet");
      balance_element.innerHTML = parseInt(value)/1000000000000000000;
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error getting refreshBalance; see log.");
    });
  }, //refreshBalance

  sendEther: function() {
    var self = this;

    var amount = parseInt($("#amount").val());

    this.setStatus("Initiating transaction... (please wait)");

    var token;
    MyToken.deployed().then(function(instance) {
      token = instance;
      return token.sendEther(amount);
    }).then(function() {
      self.setStatus("Transaction complete!");
      self.refreshBalance();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error sending ether; see log.");
    });
  }// sendEther
};

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
  }

  App.start();
});
