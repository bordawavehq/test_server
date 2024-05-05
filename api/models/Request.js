/**
 * Request.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    owner: {
      type: "json",
      description: "Creator Of Custom Order",
    },
    request: {
      type: "string",
      description: "Custom Requested Service",
      required: true,
    },
    serviceType: {
      type: "string",
      description: "Type of Service",
      required: true,
    },
    deliveryETA: {
      type: "string",
      description: "No of Days (ETA)",
      required: true,
    },
    budget: {
      type: "number",
      description: "Budget for Custom Order",
      required: true,
    },
  },
};
