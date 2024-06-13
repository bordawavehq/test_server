const axios = require("axios");

module.exports = {
  friendlyName: "Get eth price in USD",

  description: "",

  inputs: {
    tokenAmount:{
      type:'number',
      description:"Amount of ETH"
    }
  },

  exits: {
    success: {
      outputFriendlyName: "Eth price",
    },
  },

  fn: async function ({tokenAmount}) {
    const API_KEY = process.env.ETHEXPLORER_KEY;
    const testnet = "https://api-sepolia.etherscan.io/api";
    const mainnet = "https://api.etherscan.io/api";
    const endpoint = `${mainnet}?module=stats&action=ethprice&apikey=${API_KEY}`;

    try {
      const response = await axios.get(endpoint);
      const { ethusd: currentTokenPrice } = response.data.result;
      const tokenPrice = parseFloat(currentTokenPrice) * tokenAmount;
      return tokenPrice;
    } catch (error) {
      sails.log.error(error)
      return null;
    }
  },
};
