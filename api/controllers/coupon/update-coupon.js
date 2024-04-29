module.exports = {
  friendlyName: "Update coupon",

  description: "",

  inputs: {
    discountAmount: {
      type: "number",
      description: "Discount Amount",
      defaultsTo: 0,
    },
    noOfUsesLeft: {
      type: "number",
      description: "No of Coupon Uses left",
    },
  },

  exits: {
    notFound: {
      statusCode: 404,
      description: "Coupon not found",
    },
  },

  fn: async function (inputs) {
    const { req, res } = this;
    const { discountAmount, noOfUsesLeft } = inputs;
    const { id } = req.params;

    if (!id) {
      return res.badRequest();
    }

    const coupon = await Coupon.findOne({ id });

    if (!coupon) {
      return res.notFound();
    }

    try {
      await Coupon.updateOne({ id }).set({
        discountAmount,
        noOfUsesLeft,
      });

      return res.redirect("/coupon");
    } catch (error) {
      sails.log.error(error);
    }
  },
};
