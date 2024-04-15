const axios = require("axios");

module.exports.cronjob = {
  runSystemCheck: {
    on: "ready",
    schedule: "0 */5 * * * *",
    onTick: async function () {
      sails.log.info("Currently Running System Checks...");
      const url = `https://app.audiobaze.store/cron-job`;
      try {
        const response = await axios.get(url);
        sails.log.info(response.status);
      } catch (error) {
        sails.log.error("Failed to Run Live Cron Job");
      }
    },
  },
};
