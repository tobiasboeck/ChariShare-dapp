require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.4",
      },
      {
        version: "0.8.0",
      },
      { version: "0.8.22" },
      { version: "0.8.24" },
      // Add other versions as needed
    ],
  },
  networks: {
    poa: {
      url: "https://instructoruas-21530.morpheuslabs.io",
      chainId: parseInt(1311),
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
