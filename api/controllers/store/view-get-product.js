module.exports = {
  friendlyName: "View get product",

  description: 'Display "Get product" page.',

  exits: {},

  fn: async function () {
    const { req, res } = this;
    const { id } = req.params;

    const product = await Product.findOne({ id });

    if (product) {
      return res.notFound();
    }

    return res.view("pages/get-product", {
      product,
    });
  },
};
