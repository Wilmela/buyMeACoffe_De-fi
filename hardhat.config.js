require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  paths: {
    artifacts: "./src/smart_contract/artifacts",
    cache: "./src/smart_contract/cache",
    tests: "./src/smart_contract/test",
    sources: "./src/smart_contract/contracts",
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    
  },
};
