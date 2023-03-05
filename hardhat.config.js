require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require("dotenv").config();
require("@nomiclabs/hardhat-waffle");

const PRIVATE_KEY =
  process.env.GOERLI_PRIVATE_KEY ||
  "533746b20bf76abd75a22441ccc27b9e86227f8667d88af45e613b4e3405b6a4";

module.exports = {
  solidity: "0.8.17",
  networks: {
    goerli: {
      // This value will be replaced on runtime
      url:
        process.env.STAGING_QUICKNODE_KEY ||
        "https://spring-holy-shadow.ethereum-goerli.discover.quiknode.pro/ed3875bb7b8a4c2e17b4f6c44f70a9dea1663b81/",
      accounts: [PRIVATE_KEY] || "",
    },
  },
};
