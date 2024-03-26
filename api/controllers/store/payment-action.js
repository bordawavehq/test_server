module.exports = {
  friendlyName: "Payment action",

  description: "",

  inputs: {},

  exits: {},

  fn: async function (inputs) {
    const { req, res } = this;

    const { id, action } = req.params;

    if (!id || !action) {
      return res.badRequest();
    }

    const order = await Order.findOne({ id });

    if (!order) {
      return res.notFound();
    }

    try {
      await Order.updateOne({ id }).set({
        status: action === "confirm" ? "completed" : "canceled",
      });

      return res.redirect(`/order/transaction/${id}`);
    } catch (error) {
      return res.serverError(error);
    }
  },
};
