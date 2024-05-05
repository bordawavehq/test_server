const nodemailer = require("nodemailer");

module.exports = {
  friendlyName: "Send email",

  description: "Sends an email using Nodemailer",

  inputs: {
    to: {
      description: "The recipient email address",
      type: "string",
      required: true,
      isEmail: true,
    },
    subject: {
      description: "The email subject",
      type: "string",
      required: true,
    },
    html: {
      description: "The email body in plain html format",
      type: "string",
      required: true,
    },
  },

  exits: {
    success: {
      description: "All done.",
    },
  },

  fn: async function ({ to, subject, html }) {
    let transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    let info = await transporter.sendMail({
      from: `"Audiobaze Store" <support@audiobaze.store>`,
      to: to,
      subject: subject,
      html: html,
    });

    return info;
  },
};
