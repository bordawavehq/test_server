module.exports = {
  friendlyName: "Sync cart",

  description: "",

  inputs: {
    cart: {
      type: "json",
      description: "Array of Products in Carts",
    },
  },

  exits: {},

  fn: async function ({ cart }) {
    const { req, res } = this;

    // Check for Existing Cart Record
    const cartRecord = await Cart.findOne({ owner: req.me.id });

    if (!cartRecord) {
      try {
        sails.log.info("Created New Cart Record...");
        await Cart.create({ cart, owner: req.me.id });

        return res.status(200).json({
          message: "Successfully stored cart server side",
        });
      } catch (error) {
        sails.log.error(error);
        return res.serverError(error);
      }
    }

    try {
      sails.log.info("Updating Cart Record...");
      await Cart.updateOne({ owner: req.me.id }).set({
        cart,
      });

      return res
        .status(200)
        .json({ message: "Successfully stored cart server side" });
    } catch (error) {
      sails.log.error(error);
      return res.serverError(error);
    }
  },
};
