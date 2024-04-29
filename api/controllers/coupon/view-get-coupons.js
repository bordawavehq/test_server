module.exports = {
  friendlyName: "View get coupons",

  description: 'Display "Get coupons" page.',

  exits: {

  },

  fn: async function () {
    const { res } = this;

    const coupons = await Coupon.find({});

    return res.view("pages/coupon/get-coupons", {
      coupons,
    });
  },
};
