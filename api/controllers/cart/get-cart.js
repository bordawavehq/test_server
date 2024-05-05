const Cart = require("../../models/Cart");

module.exports = {
  friendlyName: "Get cart",

  description: "",

  inputs: {},

  exits: {},

  fn: async function (inputs) {
    const { req, res } = this;

    const cartRecord = await Cart.findOne({ owner: req.me.id });

    if (!cartRecord) {
      try {
        const newCartRecord = await Cart.create({
          cart: [],
          owner: req.me.id,
        }).fetch();

        return res.status(200).json({ cart: newCartRecord.cart });
      } catch (error) {
        sails.log.error(error);
        return res.status(500).json(error);
      }
    }

    return res.status(200).json({ cart: cartRecord.cart });
  },
};
