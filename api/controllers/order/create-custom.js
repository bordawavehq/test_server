module.exports = {
  friendlyName: "Create custom",

  description: "Create Custom Order",

  inputs: {
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

  exits: {
    failed: {
      statusCode: 500,
      description: "Something went wrong creating custom order",
    },
    success: {
      statusCode: 200,
      description: "Successfully created custom order",
    },
  },

  fn: async function (inputs, exits) {
    const { req } = this;
    const { request, serviceType, deliveryETA, budget } = inputs;

    try {
      const userRecord = await User.findOne({ id: req.me.id });

      const sanitizedUserRecord = _.omit(userRecord, ["password"]);

      const newCustomRecord = await Custom.create({
        owner: sanitizedUserRecord,
        request: encodeURIComponent(request),
        serviceType,
        deliveryETA,
        budget,
      }).fetch();

      return exits.success(newCustomRecord);
    } catch (error) {
      sails.log.error(error);
      return exits.failed({ message: "Failed " });
    }
  },
};
