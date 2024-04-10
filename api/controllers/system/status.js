const { differenceInDays } = require("date-fns");

module.exports = {
  friendlyName: "Status",

  description: "Status system.",

  inputs: {},

  exits: {},

  fn: async function (inputs, exits) {
    const { res } = this;

    try {
      // Collect all Subscriptions
      const subscriptions = await Sub.find({});

      const checkExpiryStatus = subscriptions.map(async (subscription) => {
        // Split the date string by "/"
        const activationDateParts = subscription.activationDate.split("/");
        const expiryDateParts = subscription.expiryDate.split("/");

        // Rearrange the parts to "mm/dd/yyyy" format
        const rearrangedActivationDate = `${activationDateParts[1]}/${activationDateParts[0]}/${activationDateParts[2]}`;
        const rearrangedExpiryDate = `${expiryDateParts[1]}/${expiryDateParts[0]}/${expiryDateParts[2]}`;

        const activationDate = new Date(rearrangedActivationDate);
        const expiryDate = new Date(rearrangedExpiryDate);

        // Days Left
        const daysLeft = differenceInDays(expiryDate, activationDate);

        if (daysLeft <= 0) {
          // Update Record based on if Days Left equals zero
          await Sub.updateOne({ id: subscription.id }).set({
            daysLeft: 0,
            activeStatus: false,
          });
          // Update license
          await License.updateOne({ id: subscription.licenseData.id }).set({
            keyStatus: "expired",
          });
          // Update user
          await User.updateOne({ id: subscription.owner }).set({
            activeSubscription: false,
          });
          sails.log.info(`Subscription ${subscription.id} has expired`);
        } else {
          // Update Subscription
          await Sub.updateOne({
            id: subscription.id,
          }).set({
            daysLeft,
          });

          sails.log.info(
            `Subscription ${subscription.id} has been checked, This User has ${daysLeft} day(s) left`
          );
        }
      });

      // Run Logic
      await Promise.all(checkExpiryStatus);

      return res.status(200).json({
        message: "Project is live 🚀",
      });
    } catch (error) {
      sails.log.error(error);
      return res.serverError(error);
    }
  },
};
