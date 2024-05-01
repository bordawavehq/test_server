const { format } = require("date-fns");

module.exports = {
  friendlyName: "Buy product",

  description: "",

  inputs: {
    products: {
      type: "json",
      description: "All Products From Cart",
    },
    totalPrice: {
      type: "number",
      description: "Total Price in USD",
    },
    discountAmount: {
      type: "number",
      description: "Discount amountin USD",
    },
  },

  exits: {},

  fn: async function (inputs) {
    const { req, res } = this;
    const { products, totalPrice, discountAmount } = inputs;

    const productCheck = products.map(async (product) => {
      const productRecord = await Product.findOne({ id: product.id });
      if (!productRecord) {
        return res.notFound({
          message: "Missing Product Purchased... Flawed Transaction...",
        });
      }
    });

    await Promise.all(productCheck);
    const today = new Date();

    try {
      const order = await Order.create({
        purchasedProducts: products,
        amountPaid: totalPrice - discountAmount,
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
