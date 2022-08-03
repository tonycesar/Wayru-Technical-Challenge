const WayruPool = artifacts.require('WayruPool.sol');

module.exports = function(deployer) {
    deployer.deploy(WayruPool);
}