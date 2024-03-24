module.exports = {
  friendlyName: "View get order",

  description: 'Display "Get order" page.',

  exits: {},

  fn: async function () {
    const { req, res } = this;

    const order = await Order.findOne({ owner: req.me.id });

    if (!order) {
      return res.notFound();
    }

    return res.view("pages/get-order", {
      order,
    });
  },
};
