const { format } = require("date-fns");
module.exports = {
  friendlyName: "Submit review",

  description: "",

  inputs: {
    productId: {
      type: "string",
      description: "Product ID",
      required: true,
    },
    review: {
      type: "string",
      description: "Submitted Review",
      required: true,
    },
  },

  exits: {
    invalid: {
      statusCode: 400,
      description: "Bad Request",
    },
    failed: {
      statusCode: 500,
      description: "Server Error",
    },
    notFound: {
      statusCode: 404,
      description: "Record not found",
    },
    success: {
      statusCode: 200,
      description: "Succesfully submitted user review",
    },
  },

  fn: async function (inputs, exits) {
    const { req } = this;
    const today = new Date();
    const { review, productId: id } = inputs;

    if (!id) {
      return exits.invalid();
    }

    // Find Product
    const product = await Product.findOne({ id });
    // Error Handling
    if (!product) {
      return exits.notFound();
    }

    // Create Review Record
    try {
      await Review.create({
        user: req.me,
        product: product.id,
        review,
        timestamp: format(today, "dd/MM/yyyy"),
      });

      // Send Success Response
      return exits.success();
    } catch (error) {
      return exits.failed();
    }
  },
};
