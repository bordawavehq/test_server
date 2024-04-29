/**
 * Coupon.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    coupon: {
      type: "string",
      description: "Random generated Coupon Code",
    },
    type: {
      type: "string",
      isIn: ["custom", "auto-generated"],
    },
    discountAmount: {
      type: "number",
      description: "Discount Amount",
      defaultsTo: 0,
    },
    noOfUsesLeft: {
      type: "number",
      description: "No of Coupon Uses left",
      required: true,
    },
  },
};
