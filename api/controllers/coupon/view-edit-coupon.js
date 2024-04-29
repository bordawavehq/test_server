module.exports = {
  friendlyName: "View edit coupon",

  description: 'Display "Edit coupon" page.',

  exits: {
    success: {
      viewTemplatePath: "pages/coupon/edit-coupon",
    },
  },

  fn: async function () {
    const { req, res } = this;

    const { id } = req.params;

    if (!id) {
      return res.view("404");
    }

    const coupon = await Coupon.findOne({ id });

    if (!coupon) {
      return res.view(404);
    }

    return res.view("pages/coupon/edit-coupon");
  },
};
