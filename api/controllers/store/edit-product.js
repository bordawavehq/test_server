module.exports = {
  friendlyName: "Edit product",

  description: "",

  inputs: {
    productTitle: {
      type: "string",
      description: "Product Title",
      required: true,
    },

    productDescription: {
      type: "string",
      description: "Product Description",
      required: true,
    },

    productFeatures: {
      type: "string",
      description: "Product Features",
      required: true,
    },

    serviceType: {
      type: "string",
      description: "Service Type",
      isIn: ["spotify", "apple", "youtube", "shazam", "audiomack"],
    },

    price: {
      type: "number",
      description: "Price in USD",
      required: true,
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
  },

  fn: async function (inputs, exits) {
    const { req, res } = this;
    const { id } = req.params;
    const {
      productTitle,
      productDescription,
      productFeatures,
      serviceType,
      price,
    } = inputs;

    if (!id) {
      throw "invalid";
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
        url: "https://img.icons8.com/fluency/500/shazam.png",
      },
    };

    const productImage = logos[serviceType].url;

    try {
      await Product.updateOne({ id }).set({
        productTitle,
        productDescription,
        productFeatures,
        productImage,
        price,
      });

      return res.redirect("/store");
    } catch (error) {
      return res.serverError(error);
    }
  },
};
