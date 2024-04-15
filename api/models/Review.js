/**
 * Review.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    product: {
      model: "product",
    },
    user: {
      type: "json",
      description: "record of user that submitted review",
    },
    review: {
      type: "string",
      description: "Customer Review About Created Product",
    },
    timestamp: {
      type: "string",
      description: "Time Review was Submitted",
    },
  },
};
