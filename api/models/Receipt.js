/**
 * Receipt.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    owner: {
      model: "user",
    },

    products: {
      type: "json",
      description: "Products Paid",
    },

    amountPaid: {
      type: "number",
      description: "Amount paid in $ USD",
    },
  },
};
