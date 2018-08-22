var Token = artifacts.require("./Token.json");

module.exports = function(deployer) {
  deployer.deploy(Token);
};
