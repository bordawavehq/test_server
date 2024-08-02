module.exports = {


  friendlyName: 'View daily chart',


  description: 'Display "Daily chart" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/special/daily-chart'
    }

  },


  fn: async function () {

    // Respond with view.
    return {};

  }


};
