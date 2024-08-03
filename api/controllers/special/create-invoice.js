const url = require("url");

module.exports = {
  friendlyName: "Create invoice",

  description: "",

  inputs: {
    id: {
      type: "string",
      required: true,
    },
    cost: {
      type: "number",
      required: true,
    },
    issueDate: {
      type: "string",
      description: "Issue Date",
      required: true,
    },
    dueDate: {
      type: "string",
      description: "Due Date",
    },
  },

  exits: {
    failed: {
      statusCode: 500,
      description: "Failed to Process Invoice",
    },
  },

  fn: async function ({ id, cost, issueDate, dueDate }) {
    const { res } = this;

    try {
      const invoice = await SpotifyInvoice.updateOne({ id }).set({
        cost,
        issueDate,
        dueDate,
      });

      const body = await sails.renderView("emails/request/invoice-delivery", {
        layout: false,
        songLink: invoice.songLink,
        noOfStreams: invoice.noOfStreams,
        country: invoice.country,
        user: invoice.user,
        similarArtists: invoice.similarArtists,
        cost: invoice.cost,
        issueDate: invoice.issueDate,
        dueDate: invoice.dueDate,
        status: invoice.status,
        url,
        id: invoice.id,
      });

      await sails.helpers.sendEmail(
        invoice.user.emailAddress,
        "[PAYMENT DUE] Audiobaze Store | Spotify Chart Request",
        body
      );

      await sails.helpers.sendEmail(
        "byranallen781@gmail.com",
        "[PAYMENT DUE DELIVERY] Audiobaze Store | Spotify Chart Request",
        `Hello Admin\nYou Successfully delivered an invoice to ${invoice.user.emailAddress} | ${invoice.user.fullName}`
      );

      return res
        .status(200)
        .json({ message: "Successfully Processed Invoice" });
    } catch (error) {
      sails.log.error(error);
      return res.serverError(error);
    }
  },
};
