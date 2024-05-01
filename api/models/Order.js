/**
 * Order.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    purchasedProducts: {
      type: "json",
      description: "Ordered Products",
    },

    transactionId: {
      type: "string",
      description: "generated transaction id",
    },

    orderDate: {
      type: "string",
    },

    status: {
      type: "string",
      isIn: ["processing", "completed", "canceled"],
      defaultsTo: "processing",
    },

    amountPaid: {
      type: "number",
      description: "Amount Paid in USD",
    },

    owner: {
      model: "user",
    },
  },
};
