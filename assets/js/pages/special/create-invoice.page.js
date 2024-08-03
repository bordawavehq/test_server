parasails.registerPage("create-invoice", {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    syncing: false,

    // Server error state for the form
    cloudError: "",

    // Form data
    formData: {},

    // For tracking client-side validation errors in our form.
    // > Has property set to `true` for each invalid property in `formData`.
    formErrors: {
      /* … */
    },

    // A set of validation rules for our form.
    // > The form will not be submitted if these are invalid.
    formRules: {},
    todayDate: new Date().toISOString().split("T")[0],
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function () {
    //…
  },
  mounted: async function () {
    this.setMinimumDate();
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    setId: function (id) {
      this.formData.id = id;
    },

    verifyPayment: async function (id) {
      try {
        const response = await fetch(`/store/invoice/verify/${id}`);

        if (response.status === 200) {
          alert("Payment Status Set To Paid... Refreshing Now");
          window.location.reload();
        }
      } catch (error) {
        console.log(error);
        alert("Something Went Wrong... Please Try Again Later");
      }
    },

    setMinimumDate: function () {
      const today = new Date().toISOString().split("T")[0];
      document.getElementById("issueDate").setAttribute("min", today);
      document.getElementById("dueDate").setAttribute("min", today);
    },

    submittedForm: async function () {
      // Redirect to the logged-in dashboard on success.
      // > (Note that we re-enable the syncing state here.  This is on purpose--
      // > to make sure the spinner stays there until the page navigation finishes.)
      this.syncing = true;

      if(this.cloudError === ""){
        alert("Successfully Processed Invoice and Delivered to Client")
        window.location.href = "/store/spotify-chart/requests";
      }
    },
  },
});
