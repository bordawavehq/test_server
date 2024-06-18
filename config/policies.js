/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {
  "*": "is-logged-in",

  // Bypass the `is-logged-in` policy for:
  "entrance/*": true,
  "account/logout": true,
  "view-homepage-or-redirect": true,
  "view-faq": true,
  "view-contact": true,
  "legal/view-terms": true,
  "legal/view-privacy": true,
  "deliver-contact-form-message": true,
  "key/generate-license": "is-super-admin",
  "bot/profile/get-user": "is-bot-user",
  "bot/orders/get-orders": "is-bot-user",
  "bot/auth/bot-login": true,
  "bot/telegram/parse-command": true,
  "system/status": true,
};
