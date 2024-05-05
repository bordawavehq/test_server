/**
 * Cart.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    cart:{
      type:'json',
      description:"Array of Products in Carts"
    },

    owner: {
      model: "user",
      unique: true,
    },
  },
};
