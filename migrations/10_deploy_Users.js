const Users = artifacts.require("Users");

module.exports = function(_deployer) {
  _deployer.deploy(Users);
};
