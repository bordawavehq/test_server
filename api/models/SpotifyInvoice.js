/**
 * Invoice.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    user: {
      type: "json",
      description: "User that made the request",
    },
    songLink: {
      type: "string",
      description: "Link of Spotfy Song",
    },
    noOfStreams: {
      type: "string",
      description: "No. Of Streams",
    },
    country: {
      type: "string",
      description: "Country to Chart in",
    },
    similarArtists: {
      type: "string",
      description: "List of Similar Artists",
    },
    cost: {
      type: "number",
      defaultsTo: 0,
    },
    status: {
      type: "string",
      isIn: ["paid", "unpaid"],
      defaultsTo: "unpaid",
    },
  },
};
