module.exports = {
  friendlyName: "Edit product",

  description: "",

  inputs: {
    id: {
      type: "string",
      required: true,
    },

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

    customServiceType: {
      type: "string",
      description: "Custom Service Type",
    },

    productImage: {
      type: "string",
      description: "Product Image URL",
    },

    deliveryETA: {
      type: "number",
      description: "Time Of Delivery in Days.",
    },

    price: {
      type: "number",
      description: "Price in USD",
    },
  },

  exits: {
    success: {
      statusCode: 200,
      description: "Successfully Added Product",
    },
    invalid: {
      statusCode: 400,
      description: "Bad Request",
    },
    failed: {
      statusCode: 500,
      description: "Server Error",
    },
  },

  fn: async function (inputs, exits) {
    const { res } = this;
    const {
      id,
      productTitle,
      productDescription,
      detailedProductDescription,
      productFeatures,
      serviceType,
      customServiceType,
      price,
      deliveryETA,
      productImage,
    } = inputs;

    sails.log.debug(inputs);

    if (serviceType === "custom") {
      try {
        await Product.updateOne({ id }).set({
          productTitle,
          productDescription,
          detailedProductDescription: detailedProductDescription
            ? encodeURIComponent(detailedProductDescription)
            : detailedProductDescription,
          productFeatures,
          serviceType: customServiceType,
          productImage,
          price,
          deliveryETA,
        });

        return res.status(200).json({ message: "Successfully edited product" });
      } catch (error) {
        sails.log.error(error);

        return res.serverError(error);
      }
    }

    const logos = {
      spotify: {
        url: "https://img.icons8.com/ios-filled/500/spotify.png",
      },
      apple: {
        url: "https://img.icons8.com/ios-filled/500/mac-os.png",
      },
      youtube: {
        url: "https://img.icons8.com/color/500/youtube-squared.png",
      },
      shazam: {
        url: "https://img.icons8.com/fluency/500/shazam.png",
      },
      audiomack: {
        url: "https://img.icons8.com/color/500/audiomack.png",
      },
      "smart-contract": {
        url: "https://img.icons8.com/color/500/ethereum.png",
      },
      website: {
        url: "https://img.icons8.com/clouds/100/domain.png",
      },
      "crypto-projects": {
        url: "https://img.icons8.com/fluency/96/cryptocurrency.png",
      },
      "targeted-ads": {
        url: "https://img.icons8.com/clouds/100/commercial.png",
      },
      "bit-bread-artist-grant": {
        url: "https://img.icons8.com/ios-filled/100/money-bag-euro.png",
      },
      "hq-songs": {
        url: "https://img.icons8.com/fluency/500/apple-music.png",
      },
      "hq-distros": {
        url: "https://img.icons8.com/fluency/500/apple-music.png",
      },
      "software-bot-development": {
        url: "https://img.icons8.com/nolan/100/bot.png",
      },
      "social-media-ads": {
        url: "https://img.icons8.com/bubbles/100/social-media-marketing.png",
      },
      "air-play": {
        url: "https://img.icons8.com/ios-filled/500/mac-os.png",
      },
      "itunes-music": {
        url: "https://img.icons8.com/color/500/itunes.png",
      },
    };

    const presetLogo = logos[serviceType].url;

    try {
      await Product.updateOne({ id }).set({
        productTitle,
        productDescription,
        detailedProductDescription: encodeURIComponent(
          detailedProductDescription
        ),
        productFeatures,
        productImage: presetLogo,
        price,
        deliveryETA,
      });

      return exits.success();
    } catch (error) {
      sails.log.error(error);
      return exits.failed(error);
    }
  },
};
