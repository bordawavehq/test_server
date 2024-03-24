/**
 * Product.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    productTitle: {
      type: "string",
      description: "Product Title",
    },

    productDescription: {
      type: "string",
      description: "Product Description",
    },

    productFeatures: {
      type: "string",
      description: "Product Features",
    },

    serviceType: {
      type: "string",
      description: "Service Type",
      isIn: ["spotify", "apple", "youtube", "shazam", "audiomack"],
    },

    productImage: {
      type: "string",
      description: "Product Image URL",
    },

    price: {
      type: "number",
      description: "Price in USD",
    },
  },
};
