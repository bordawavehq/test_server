const { addDays, format } = require("date-fns");

module.exports = {
  friendlyName: "Activate License for One User",

  description: "Activate Audiobaze License to last for 30 days",

  inputs: {
    licenseKey: {
      type: "string",
      required: true,
      unique: true,
      description: "License Key for activating Audiobaze service for 30 days",
      example: "2$28a8eabna301089103-13948134nad",
    },
  },

  exits: {
    success: {
      description: "License Key Successfully Activated",
      statusCode: 200,
    },
    failure: {
      description: "License Key Activation Failed",
      statusCode: 500,
    },
    invalid: {
      description: "Invalid License Key",
      statusCode: 500,
    },
    used: {
      descriptiion: "Used License Key",
    },
    alreadyActivated: {
      description: "License already activated",
    },
  },

  fn: async function ({ licenseKey }, exits) {
    // License Activation & Expiry Date
    const activationDate = new Date();
    const expiryDate = addDays(activationDate, 30);

    const licenseRecord = await License.findOne({
      licenseKey,
      keyStatus: "unactivated",
    });

    if (!licenseRecord) {
      return exits.invalid();
    }

    if (licenseRecord.keyStatus === "activated") {
      return exits.alreadyActivated();
    }

    try {
      const license = await License.updateOne({
        licenseKey,
        keyStatus: "unactivated",
      }).set({
        keyStatus: "activated",
        currentKeyUser: this.req.me.emailAddress,
      });

      const user = await User.updateOne({ id: this.req.me.id }).set({
        activeSubscription: true,
      });

      await Sub.create({
        licenseData: license,
        owner: user.id,
        activationDate: format(activationDate, "dd/MM/yyyy"),
        expiryDate: format(expiryDate, "dd/MM/yyyy"),
      }).fetch();

      return exits.success();
    } catch (error) {
      return exits.failure({ error: error });
    }
  },
};
