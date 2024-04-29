module.exports = {
  friendlyName: "View create coupon",

  description: 'Display "Create coupon" page.',

  exits: {
    
  },

  fn: async function () {
    const { req, res } = this;


    return res.view("pages/coupon/create-coupon");
  },
};
