/**
 * Sub.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    licenseData: {
      type: "json",
      description: "Activated License",
    },
    daysLeft: {
      type: "number",
      description: "No of Days left",
      defaultsTo: 30,
    },
    activationDate: {
      type: "string",
      description: "License Activation Date",
    },
    expiryDate: {
      type: "string",
      description: "License Expiry Date",
    },
    activeStatus: {
      type: "boolean",
      description: "Activation Status of Subscription",
      defaultsTo: true,
    },
    owner: {
      model: "user",
    },
  },
};
