module.exports = {


  friendlyName: 'View activatelicense',


  description: 'Display "Activatelicense" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/dashboard/license/activatelicense'
    }

  },


  fn: async function () {

    // Respond with view.
    return {};

  }


};
