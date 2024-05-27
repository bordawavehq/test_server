module.exports = {
  friendlyName: "Get eth amount",

  description: "",

  inputs: {
    ethUSD: {
      type: "number",
      description: "Amount of Ethereum in USD",
      required: true,
    },
    priceData: {
      type: "json",
      description: "Price Data",
      required: true,
    },
  },

  exits: {
    success: {
      outputFriendlyName: "Eth amount",
    },
  },

  fn: async function ({ ethUSD, priceData }, exits) {
    let tokenAmount;
    const { ethusd: currentTokenPrice } = priceData.result;
    tokenAmount = ethUSD / parseFloat(currentTokenPrice);
    return exits.success(tokenAmount);
  },
};
