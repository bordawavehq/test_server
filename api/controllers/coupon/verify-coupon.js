module.exports = {
  friendlyName: "Validate coupon",

  description: "",

  inputs: {
    coupon: {
      type: "string",
      description: "Coupon Code",
    },
    price: {
      type: "string",
      description: "Price",
    },
  },

  exits: {
    exhausted: {
      statusCode: 400,
      description: "Coupon Exhausted",
    },
    success: {
      statusCode: 200,
      description: "Successfully validated coupon",
    },
    failed: {
      statusCode: 500,
      description: "Failed to Validate Coupon",
    },
  },

  fn: async function (inputs, exits) {
    const { req, res } = this;

    const { coupon, price } = inputs;

    try {
      const couponRecord = await Coupon.findOne({ coupon });

      if (!couponRecord) {
        return res.notFound({ message: "Invalid Coupon" });
      }

      if (couponRecord.noOfUsesLeft === 0) {
        return exits.exhausted({
          message: "Coupon Exhausted",
        });
      }

      const deduction = (parseInt(price) * couponRecord.discountAmount) / 100;
      const newPrice = parseInt(price) - deduction.toFixed(2);

      return exits.success({
        oldPrice: parseInt(price),
        newPrice,
        discountAmount: (parseInt(price) * couponRecord.discountAmount) / 100,
      });
    } catch (error) {
      return res.failed({
        message: "Failed to Process Discount at this timeF",
      });
    }
  },
};
