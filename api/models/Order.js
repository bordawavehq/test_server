/**
 * Order.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    purchasedProduct: {
      type: "json",
      description: "Product that it's order was made",
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
      isIn: ["processing", "completed"],
    },

    owner: {
      model: "user",
    },
  },
};
