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
      isIn: [
        "spotify",
        "apple",
        "youtube",
        "shazam",
        "audiomack",
        "smart-contract",
        "website",
        "crypto-projects",
        "targeted-ads",
        "bit-bread-artist-grant",
        "hq-songs",
        "hq-distros",
        "software-bot-development",
        "social-media-ads",
        "air-play",
        "itunes-music",
      ],
    },

    deliveryETA:{
      type:'string',
      description:"Time Of Delivery in Days",
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
