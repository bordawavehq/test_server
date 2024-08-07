/**
 * cloud.setup.js
 *
 * Configuration for this Sails app's generated browser SDK ("Cloud").
 *
 * Above all, the purpose of this file is to provide endpoint definitions,
 * each of which corresponds with one particular route+action on the server.
 *
 * > This file was automatically generated.
 * > (To regenerate, run `sails run rebuild-cloud-sdk`)
 */

Cloud.setup({
  /* eslint-disable */
  methods: {
    confirmEmail: { verb: "GET", url: "/email/confirm", args: ["token"] },
    logout: { verb: "GET", url: "/api/v1/account/logout", args: [] },
    updatePassword: {
      verb: "PUT",
      url: "/api/v1/account/update-password",
      args: ["password"],
    },
    updateProfile: {
      verb: "PUT",
      url: "/api/v1/account/update-profile",
      args: ["fullName", "emailAddress"],
    },
    updateBillingCard: {
      verb: "PUT",
      url: "/api/v1/account/update-billing-card",
      args: [
        "stripeToken",
        "billingCardLast4",
        "billingCardBrand",
        "billingCardExpMonth",
        "billingCardExpYear",
      ],
    },
    login: {
      verb: "PUT",
      url: "/api/v1/entrance/login",
      args: ["emailAddress", "password", "rememberMe"],
    },
    signup: {
      verb: "POST",
      url: "/api/v1/entrance/signup",
      args: ["emailAddress", "password", "fullName"],
    },
    sendPasswordRecoveryEmail: {
      verb: "POST",
      url: "/api/v1/entrance/send-password-recovery-email",
      args: ["emailAddress"],
    },
    updatePasswordAndLogin: {
      verb: "POST",
      url: "/api/v1/entrance/update-password-and-login",
      args: ["password", "token"],
    },
    deliverContactFormMessage: {
      verb: "POST",
      url: "/api/v1/deliver-contact-form-message",
      args: ["emailAddress", "topic", "fullName", "message"],
    },
    observeMySession: {
      verb: "POST",
      url: "/api/v1/observe-my-session",
      args: [],
      protocol: "io.socket",
    },
    generateLicense: {
      verb: "GET",
      url: "/api/v1/generate/license/:number",
      args: [],
    },
    activateLicense: {
      verb: "POST",
      url: "/activate/licensekey",
      args: ["licenseKey"],
    },
    setExpiry: {
      verb: "POST",
      url: "/service/expiry",
      args: ["customerId", "expiryDate"],
    },
    revokeUser: { verb: "GET", url: "/user/revoke/:id", args: [] },
    delete: { verb: "GET", url: "/user/delete/:id", args: [] },
    addProduct: {
      verb: "POST",
      url: "/store/product",
      args: [
        "productTitle",
        "productDescription",
        "detailedProductDescription",
        "productFeatures",
        "serviceType",
        "customServiceType",
        "productImage",
        "deliveryETA",
        "price",
      ],
    },
    editProduct: {
      verb: "PATCH",
      url: "/store/product/:id",
      args: [
        "id",
        "productTitle",
        "productDescription",
        "detailedProductDescription",
        "productFeatures",
        "serviceType",
        "customServiceType",
        "productImage",
        "deliveryETA",
        "price",
      ],
    },
    deleteProduct: { verb: "GET", url: "/store/product/delete/:id", args: [] },
    createCoupon: {
      verb: "POST",
      url: "/coupon/generate",
      args: ["coupon", "type", "discountAmount", "noOfUsesLeft"],
    },
    verifyCoupon: {
      verb: "POST",
      url: "/coupon/validate",
      args: ["coupon", "price"],
    },
    updateCoupon: {
      verb: "PATCH",
      url: "/coupon/update/:id",
      args: ["discountAmount", "noOfUsesLeft"],
    },
    deleteCoupon: { verb: "DELETE", url: "/coupon/:id", args: [] },
    getCart: { verb: "GET", url: "/cart", args: [] },
    syncCart: { verb: "POST", url: "/cart/sync", args: ["cart"] },
    emptyCart: { verb: "DELETE", url: "/cart", args: [] },
    createCustom: {
      verb: "POST",
      url: "/order/custom",
      args: ["request", "serviceType", "deliveryETA", "budget"],
    },
    deleteCustom: { verb: "DELETE", url: "/order/custom/:id", args: [] },
    buyProduct: {
      verb: "POST",
      url: "/order/buy",
      args: ["products", "totalPrice", "discountAmount"],
    },
    paymentAction: {
      verb: "GET",
      url: "/order/transaction/:id/:action",
      args: [],
    },
    submitReview: {
      verb: "POST",
      url: "/review",
      args: ["productId", "review"],
    },
    deleteReview: { verb: "DELETE", url: "/review/:id", args: [] },
    botLogin: {
      verb: "POST",
      url: "/api/v1/bot/auth/login",
      args: ["emailAddress", "password"],
    },
    getUser: { verb: "GET", url: "/api/v1/bot/user", args: [] },
    subCheck: { verb: "GET", url: "/api/v1/system/subscription", args: [] },
    status: { verb: "GET", url: "/cron-job", args: [] },
    parseCommand: { verb: "POST", url: "/webhook", args: [] },
    processChartRequest: {
      verb: "POST",
      url: "/store/process-spotify-chart-request",
      args: ["songLink", "noOfStreams", "country", "similarArtists"],
    },
    processRequest: {
      verb: "POST",
      url: "/store/process-request",
      args: ["songLink", "noOfStreams", "country", "similarArtists"],
    },
    createInvoice: {
      verb: "PATCH",
      url: "/store/invoice/create",
      args: ["id", "cost", "issueDate", "dueDate"],
    },
    verifyPayment: { verb: "GET", url: "/store/invoice/verify/:id", args: [] },
  },
  /* eslint-enable */
});
