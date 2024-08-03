const url = require('url')

module.exports = {
  friendlyName: "Process chart request",

  description: "",

  inputs: {
    songLink: {
      type: "string",
      description: "Link of Spotify Song",
      required: true,
    },
    noOfStreams: {
      type: "string",
      description: "No. Of Streams",
      required: true,
    },
    country: {
      type: "string",
      description: "Country to Chart in",
      required: true,
    },
    similarArtists: {
      type: "string",
      description: "List of Similar Artists",
      required: true,
    },
  },

  exits: {
    failed: {
      description: "Failed to proess chart request",
      statusCode: 500,
    },
  },

  fn: async function ({ songLink, noOfStreams, country, similarArtists }) {
    const { req, res } = this;

    try {
      await SpotifyInvoice.create({
        user: req.me,
        songLink,
        noOfStreams,
        country,
        similarArtists,
      });

      const emailBody = await sails.renderView("emails/request/spotify-chart", {
        layout: false,
        fullName: req.me.fullName,
        songLink,
        noOfStreams,
        country,
        similarArtists,
        url
      });

      await sails.helpers.sendEmail.with({
        to: "byranallen781@gmail.com",
        subject: "[ALERT] Spotify Chart Request",
        html: emailBody,
      });

      return res
        .status(200)
        .json({ message: "Successfully processed chart request" });
    } catch (error) {
      sails.log.error(error);

      return res.serverError(error);
    }
  },
};
