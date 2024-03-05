/**
 * License.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    licenseKey: {
      type: "string",
      required: true,
      description: "License Key Generated using random strings",
    },

    keyStatus: {
      type: "string",
      isIn: ["unactivated", "expired", "activated", "revoked"],
      defaultsTo: "unactivated",
      description: "License Key Validity Status",
    },

    currentKeyUser: {
      type: "string",
      isEmail: true,
      description: "Current Key User on the Audiobaze Platform",
    },
  },
};
