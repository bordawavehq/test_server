const Cart = require("../../models/Cart");

module.exports = {
  friendlyName: "Empty cart",

  description: "",

  inputs: {},

  exits: {},

  fn: async function (inputs) {
    const { req, res } = this;

    const cartRecord = await Cart.findOne({
      owner: req.me.id,
    });

    if (!cartRecord) {
      await Cart.create({
        cart: [],
        owner: req.me.id,
      });

      return res.status(400).json({
        message: "There was no cart record to empty",
      });
    }

    try {
      await Cart.updateOne({ owner: req.me.id }).set({ cart: [] });
      
      return res.status(200).json({ message: "Successfully emptied cart" });
    } catch (error) {
      sails.log.error(error);
      return res.serverError(error);
    }
  },
};
