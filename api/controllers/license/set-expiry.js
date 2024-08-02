const { format } = require("date-fns");

module.exports = {
  friendlyName: "Set expiry",

  description: "",

  inputs: {
    customerId: {
      type: "string",
      required: true,
    },
    expiryDate: {
      type: "json",
      required: true,
    },
  },

  exits: {},

  fn: async function (inputs) {
    const { customerId, expiryDate } = inputs;

  },
};
