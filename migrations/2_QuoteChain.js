var QuoteChain = artifacts.require("./QuoteChain.sol");

module.exports = function(deployer) {
  deployer.deploy(QuoteChain, "Testing");
};
