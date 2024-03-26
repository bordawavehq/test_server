module.exports = {
  friendlyName: "View get orders",

  description: 'Display "Get orders" page.',

  exits: {},

  fn: async function () {
    const { req, res } = this;

    try {
      if (req.me.isSuperAdmin) {
        const orders = await Order.find({}).populate('owner');

        return res.view("pages/get-orders", {
          orders,
        });
      } else {
        const orders = await Order.find({ owner: req.me.id }).populate("owner");
        
        return res.view("pages/get-orders", {
          orders,
        });
      }
    } catch (error) {
      return res.serverError();
    }
  },
};
