/**
 * Wallet.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    owner:{
      model:'user'
    },

    address:{
      type:'string',
      description:"Wallet Address"
    },

    blockchain:{
      type:'string',
      description:"Blockchain the wallet address it originates"
    },
  },

};

