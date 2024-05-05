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

    detailedProductDescription: {
      type: "string",
      description: "detailed Product Description",
    },

    productFeatures: {
      type: "string",
      description: "Product Features",
    },

    serviceType: {
      type: "string",
      description: "Service Type",
    },

    deliveryETA: {
      type: "number",
      description: "Time Of Delivery in Days",
      required: true,
    },

    productImage: {
      type: "string",
      description: "Product Image URL",
    },

    price: {
      type: "number",
      description: "Price in USD",
    },

    reviews: {
      collection: "review",
      via: "product",
    },
  },
};
