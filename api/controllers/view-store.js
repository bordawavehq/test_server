module.exports = {
  friendlyName: "View store",

  description: 'Display "Store" page.',

  exits: {},

  fn: async function () {
    const { req, res } = this;
    const user = await User.findOne({ id: req.me.id });

    if (!user) {
      return res.view("pages/500");
    }

    try {
      const allProducts = await Product.find({}).populate("reviews");

      // Respond with view.
      return res.view("pages/store", {
        products: allProducts,
        user,
      });
    } catch (error) {
      sails.log.error(error);
      return res.serverError(error);
    }
  },
};
