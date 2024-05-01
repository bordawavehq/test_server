module.exports = {
  friendlyName: "Create coupon",

  description: "",

  inputs: {
    coupon: {
      type: "string",
      description: "Random generated Coupon Code",
    },
    type: {
      type: "string",
      isIn: ["custom", "auto-generated"],
    },
    discountAmount: {
      type: "number",
      description: "Discount Amount",
      defaultsTo: 0,
    },
    noOfUsesLeft: {
      type: "number",
      description: "No of Coupon Uses left",
      required: true,
    },
  },

  exits: {
    success: {
      statusCode: 200,
      description: "Successfully created coupon",
    },
    failed: {
      statusCode: 500,
      description: "Failed to Create Coupon",
    },
    alreadyExisting: {
      statusCode: 409,
      description: "Coupon Code with already existing in record",
    },
  },

  fn: async function (inputs, exits) {
    const { res } = this;
    const { discountAmount, noOfUsesLeft, coupon, type } = inputs;

    function generateKey() {
      var key = "";
      var charset = "ABCDEFGHIJKLMONPQRSTUVWXYZ0123456789";

      for (var i = 0; i < 8; i++)
        key += charset.charAt(Math.floor(Math.random() * charset.length));
      return key;
    }

    sails.log.info(coupon);

    if (coupon) {
      // Existing Coupon Check
      const existingRecord = await Coupon.findOne({
        coupon: coupon.toUpperCase(),
      });

      if (existingRecord) {
        return exits.alreadyExisting();
      }
    }

    try {
      if (type === "auto-generated") {
        await Coupon.create({
          coupon: generateKey(),
          discountAmount,
          noOfUsesLeft,
          type,
        });
      }

      if (type === "custom") {
        await Coupon.create({
          coupon: coupon.toUpperCase(),
          discountAmount,
          noOfUsesLeft,
          type,
        });
      }

      return res.redirect("/coupons");
    } catch (error) {
      sails.log.error(error);

      return exits.failed({ message: "Failed to Create Coupons" });
    }
  },
};
