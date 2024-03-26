module.exports = {
  friendlyName: "View transaction process",

  description: 'Display "Transaction process" page.',

  exits: {},

  fn: async function () {
    const { req, res } = this;
    const { id } = req.params;

    if (!id) {
      return res.badRequest();
    }
    
    const order = await Order.findOne({ id }).populate("owner");

    if(!order){
      return res.notFound()
    }

    return res.view("pages/transaction-process", { order });
  },
};
