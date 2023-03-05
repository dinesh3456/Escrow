require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require("dotenv").config();

module.exports = {
  solidity: "0.8.17",
  networks: {
    goerli: {
      // This value will be replaced on runtime
      url:
        process.env.STAGING_QUICKNODE_KEY ||
        "https://spring-holy-shadow.ethereum-goerli.discover.quiknode.pro/ed3875bb7b8a4c2e17b4f6c44f70a9dea1663b81/",
      accounts: [process.env.PRIVATE_KEY] || "",
    },
  },
};
