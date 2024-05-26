/**
 * Receipt.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    owner:{
      model:"user"
    },
    
    hash: {
      type: "string",
      description: "Blockchain Transaction Hash",
    },

    blockchain: {
      type: "string",
      description: "Blockchain",
    },

    amount: {
      type: "json",
      description: "Amount of Funds Transfered",
      example: `{crypto:0.423ETH, dollars: '$34232'}`,
    },

    from: {
      type: "string",
      description: "Buyer's Wallet Address",
    },

    to: {
      type: "string",
      description: "Company's receiving Wallet",
    },
  },
};

