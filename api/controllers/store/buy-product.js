const { format } = require("date-fns");

module.exports = {
  friendlyName: "Buy product",

  description: "",

  inputs: {},

  exits: {},

  fn: async function (inputs) {
    const { req, res } = this;
    const { id } = req.params;

    if (!id) {
      return res.badRequest();
    }

    const purchasedProduct = await Product.findOne({ id });

    if (!purchasedProduct) {
      return res.notFound();
    }
    const today = new Date();

    try {
      const order = await Order.create({
        purchasedProduct,
        transactionId: await sails.helpers.strings.random("url-friendly"),
        orderDate: format(today, "dd/MM/yyyy"),
        owner: req.me.id,
      }).fetch();

      return res.redirect(`/order/transaction/${order.id}`);
    } catch (error) {
      return res.serverError(error);
    }
  },
};
