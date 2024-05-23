/**
 * Telegram.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    owner: {
      model: "user",
      unique: true,
    },

    telegramUserName: {
      type: "string",
      description: "Telegram Username, e.g. @timmyisanerd",
    },

    telegramChatId: {
      type: "string",
      description: "Telegram User Custom ID",
    },

    isVerified: {
      type: "boolean",
      description: "Telegram/Email Verification Status",
      defaultsTo: false,
    },
  },
};
