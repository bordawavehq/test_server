module.exports = {
  friendlyName: "View edit product",

  description: 'Display "Edit product" page.',

  exits: {},

  fn: async function () {
    const { req, res } = this;
    const { id } = req.params;

    if (!id) {
      return res.badRequest();
    }

    const product = await Product.findOne({ id });

    if (!product) {
      return res.notFound();
    }

    return res.view("pages/edit-product", {
      product,
    });
  },
};
