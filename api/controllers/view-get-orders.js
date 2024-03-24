module.exports = {
  friendlyName: "View get orders",

  description: 'Display "Get orders" page.',

  exits: {},

  fn: async function () {
    const { req, res } = this;

    const orders = await Order.find({ owner: req.me.id });

    return res.view("pages/get-orders", {
      orders,
    });
  },
};
