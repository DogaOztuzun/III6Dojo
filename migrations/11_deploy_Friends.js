const Users = artifacts.require("Users");
const Friends = artifacts.require("Friends");

module.exports = function(_deployer) {
  _deployer.deploy(Friends, Users.address);
};
