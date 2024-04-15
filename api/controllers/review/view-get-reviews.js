module.exports = {
  friendlyName: "View get reviews",

  description: 'Display "Get reviews" page.',

  exits: {},

  fn: async function () {
    const { req, res } = this;
    const { productId: id } = req.params;

    if (!id) {
      return res.notFound();
    }

    const product = await Product.findOne({ id });

    if (!product) {
      return res.notFound();
    }

    const reviews = await Review.find({ product: product.id });

    return res.view("pages/review/get-reviews", { reviews, productId: id });
  },
};
