module.exports = {
  friendlyName: "View store",

  description: 'Display "Store" page.',

  exits: {},

  fn: async function () {
    const { req, res } = this;

    const user = await User.findOne({ id: req.me.id });

    const allProducts = await Product.find({}).populate("reviews");

    // Respond with view.
    return res.view("pages/store", {
      products: allProducts,
      user
    });
  },
};
