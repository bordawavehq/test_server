const axios = require("axios");

module.exports = {
  friendlyName: "Parse command",

  description:
    "This Action is implemented to parse and understand bot logic and perform actions across the audiobaze store",

  fn: async function () {
    const { req } = this;
    const update = req.body;
    sails.log.info(`Received Update from Bot... 🤖`);
    sails.log.info(update);

    const botCommandList = [
      "/start",
      "/dashboard",
      "start",
      "dashboard",
      "hello",
      "hi",
      "/help",
      "help",
      "email",
      "verifyemail",
      "verifytoken",
      "store",
      "/store",
      "orders",
      "/orders",
      "setadmin",
      "setwallet",
      "/setwallet",
      "verifytx",
      "/verifytx",
      "mywallets",
      "/mywallets",
      "balance",
      "/balance",
      "/mytransactions",
      "mytransactions",
      "payfororder",
      "/payfororder",
      "/custom",
      "custom",
    ];

    const inlineKeyboard = {
      inline_keyboard: [
        [
          { text: "Button 1", callback_data: "button1" },
          { text: "Button 2", callback_data: "button2" },
        ],
      ],
    };

    function isValidCommand(command, botCommandList) {
      for (i = 0; i < botCommandList.length; i++) {
        if (command.toLowerCase().includes(botCommandList[i].toLowerCase())) {
          return true;
        }
      }

      return false;
    }

    async function validateUser(chatId) {
      try {
        const telegramRecord = await Telegram.findOne({
          telegramChatId: chatId,
          isVerified: true,
        });

        if (!telegramRecord) {
          await sails.helpers.sendMessage(
            chatId,
            `Sorry You can't access that for the following reasons\n1. You are new here! \n2. You are not on Audiobaze's System as a Verfied User\n \nPlease provide your verification token in the format below\ne.g. verifytoken:SD2F1S`
          );
        }

        return;
      } catch (error) {
        sails.log.error(error);
        return;
      }
    }

    function getTx(input) {
      const keyword = "verifytx:";
      const keywordIndex = input.indexOf(keyword);

      if (keywordIndex === -1) {
        // The keyword "verifytx:" was not found in the input string
        return null;
      }

      // Extract the text after the keyword
      const startIndex = keywordIndex + keyword.length;
      const result = input.substring(startIndex).trim();

      return result;
    }

    function getPayForOrderTx(input) {
      const keyword = "payfororder:";
      const keywordIndex = input.indexOf(keyword);

      if (keywordIndex === -1) {
        // The keyword "verifytx:" was not found in the input string
        return null;
      }

      // Extract the text after the keyword
      const startIndex = keywordIndex + keyword.length;
      const result = input.substring(startIndex).trim();

      return result;
    }

    const verifyETHhash = async (txhash) => {
      const test_net = "https://api-sepolia.etherscan.io";
      const main_net = "https://api.etherscan.io";
      const apiKey = process.env.ETHEXPLORER_KEY;
      const endpoint = `${main_net}/api?module=transaction&action=gettxreceiptstatus&txhash=${txhash}&apikey=${apiKey}`;
      try {
        const response = await axios.get(endpoint);
        const data = response.data;
        if (data.result.status === "1") {
          return true;
        }

        return false;
      } catch (error) {
        sails.log.error(error);
        return false;
      }
    };

    async function findEthPayment(chatId, buyerWallet, txHash) {
      const companyWallet = "0xF2255c5F4dd0a2dfC4B65bab08EE27CA58333362";
      const API_KEY = process.env.ETHEXPLORER_KEY;
      const testnet = "https://api-sepolia.etherscan.io/api";
      const mainnet = "https://api.etherscan.io/api";
      const endpoint = `${mainnet}?module=account&action=txlist&address=${companyWallet}&startblock=0&endblock=99999999&sort=desc&apikey=${API_KEY}`;

      function weiToEth(wei) {
        const weiBigInt = BigInt(wei);
        // Define the conversion factor (10^18)
        const conversionFactor = BigInt("1000000000000000000");

        // Perform the conversion
        const eth = Number(weiBigInt) / Number(conversionFactor);

        return eth;
      }

      await sails.helpers.sendMessage(
        chatId,
        `Reviewing Etherscan Transaction... 📃`
      );

      const getTransactions = async () => {
        try {
          const response = await axios.get(endpoint);
          const data = response.data;
          if (data.result.length === 0) {
            return null;
          }
          return data.result;
        } catch (error) {
          return null;
        }
      };

      const findPayment = (txhash, buyerAddress) => {
        const transaction = transactions.find(
          (transaction) =>
            transaction.hash === txhash &&
            transaction.from === buyerAddress.toLowerCase() &&
            transaction.isError === "0" &&
            transaction.txreceipt_status === "1" &&
            transaction.contractAddress === ""
        );

        return transaction;
      };

      const transactions = await getTransactions();
      if (!transactions) {
        await sails.helpers.sendMessage(
          chatId,
          `Failed to find any transaction records between your wallet address and Audiobaze Stores`
        );
        return null;
      }

      const transaction = findPayment(txHash, buyerWallet);

      if (!transaction) {
        await sails.helpers.sendMessage(
          chatId,
          `Search through Etherscan complete\nTransaction Between Audiobaze and your Wallet Unavailable\nFailed to find txHash: ${txHash} ❌`
        );

        return null;
      }

      const cryptoTransactionRecord = await Transaction.findOne({
        hash: transaction.hash,
        from: buyerWallet.toLowerCase(),
        to: companyWallet,
      });

      if (cryptoTransactionRecord) {
        await sails.helpers.sendMessage(
          chatId,
          `This Transaction has been verified and your balance updated😉`
        );

        return;
      }

      const amountInDollars = await sails.helpers.getEthPrice(
        weiToEth(transaction.value)
      );

      await sails.helpers.sendMessage(
        chatId,
        `Transaction Located ✅\ntx:${transaction.hash}📃\n💎${weiToEth(
          transaction.value
        )} ETH/$${amountInDollars.toFixed(
          2
        )}\nYou paid the above amount to ${companyWallet}`
      );

      await Transaction.create({
        hash: transaction.hash,
        blockchain: "ETH",
        amount: {
          dollars: await sails.helpers.getEthPrice(weiToEth(transaction.value)),
          crypto: weiToEth(transaction.value),
        },
        from: buyerWallet.toLowerCase(),
        to: companyWallet,
      });

      return transaction;
    }

    async function verifyTronHash(txHash) {
      try {
        const response = await axios.get(
          `https://apilist.tronscanapi.com/api/transaction-info?hash=${txHash}`,
          {
            headers: {
              "TRON-PRO-API-KEY": process.env.TRONEXPLORER_KEY,
            },
          }
        );

        const data = response.data;

        if (!data) {
          return null;
        }

        if (data.contractRet !== "SUCCESS") {
          return null;
        }

        return data["tokenTransferInfo"];
      } catch (error) {
        throw Error(error);
      }
    }

    const commandParser = () => {
      if (update.message) {
        return {
          type: "private",
          command: update.message.text,
          chat: {
            id: update.message.chat.id,
            firstName: update.message.chat.first_name,
            username: update?.message?.chat?.username,
          },
        };
      }
      if (update.callback_query) {
        return {
          type: "button_click",
          chat: {
            id: update.callback_query.message.chat.id,
            firstName: update.callback_query.from.first_name,
            username: update.callback_query.from.username,
          },
          data: update.callback_query.data,
        };
      }

      return {
        type: "unspecified",
        command: "unknown",
        chat: {
          id: update.message.chat.id,
          firstName: update.message.chat.first_name,
          username: update?.message?.chat?.username,
        },
      };
    };

    const emailExtract = (emailAddress) => {
      const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
      const email = emailAddress.match(emailRegex);
      return email;
    };

    function generateKey() {
      var key = "";
      var charset = "ABCDEFGHIJKLMONPQRSTUVWXYZ0123456789";

      for (var i = 0; i < 6; i++)
        key += charset.charAt(Math.floor(Math.random() * charset.length));
      return key;
    }

    async function getUser(chatId) {
      const telegramRecord = await Telegram.findOne({ telegramChatId: chatId });
      if (!telegramRecord) {
        sails.log.error(`User Telegram Record Not Found ❌`);
        await sails.helpers.sendMessage(
          chatId,
          `There was a problem extracting your user record ❌\nPlease make sure your account is verified and try again...`
        );
        return null;
      }
      const userRecord = await User.findOne({ id: telegramRecord.owner });

      if (!userRecord) {
        sails.log.error(`User Record Not Found ❌`);
        await sails.helpers.sendMessage(
          chatId,
          `There was a problem extracting your user record ❌\nPlease make sure your account is verified and try again...`
        );
        return null;
      }

      const sanitizedUser = _.omit(userRecord, ["password"]);
      return sanitizedUser;
    }

    const { type, command, chat } = commandParser();

    const isValid = isValidCommand(command, botCommandList);

    if (!isValid) {
      await sails.helpers.sendMessage(
        update.message.chat.id,
        `Ah Sorry! 😥 I can't seem to make sense of that... Could you try /help to get a list of commands?
          `
      );

      return;
    }

    if (type === "private" && (command === "hello" || command === "hi")) {
      await sails.helpers.sendMessage(
        chat.id,
        `Hi There! I'm your Audiobaze Store Assistant 😊 \nI'm here to assist you with your Audiobaze Operations which includes Purchases, Submitting Reviews on Products, Receipts, submitting Custom Requests etc\nTo Get a list of Commands send /help`
      );
    }

    if (type === "private" && (command === "/help" || command === "help")) {
      await sails.helpers.sendMessage(
        chat.id,
        `Oh! You need some help with the command list? 😅 I gotchu \n/start - Start Audiobaze Store\n/dashboard - Get Dashboard Information\n/help - Get Bot Command List\n/store - Get Audiobaze Products\n/verifytoken - Verify Email Address Token\n/setwallet - Set a new wallet address\n/verifytx - verify crypto transactions\n/mywallets - see your wallets\n/orders - see your audiobaze orders\n/balance - Check your current balance\n/mytransactions - Check Your Transactions\n/payfororder - pay for order from your audiobaze balance\n/help - get command list\n
        Commands are to be used the exact same way as described by the bot.

      
        An Alternative is to use the Store Right here in Telegram\nTap/Click here https://t.me/audiobaze_admin_bot/audiobaze_store`
      );
    }

    if (type === "private" && (command === "/start" || command === "start")) {
      const telegramUserRecord = await Telegram.findOne({
        telegramChatId: update.message.from.id,
      });
      if (!telegramUserRecord) {
        await sails.helpers.sendMessage(
          chat.id,
          `Oh Hello! You are kind of new here aren't you?😬\nI can tell cause I have no records of you verifying your audiobaze account... \nPlease provide the verification token in the format below\ne.g. verifytoken:SDHH23\nDon't have a verification token on your dashboard? Provide your email to the bot in the format below\nemail:support@audiobaze.store  If you don't have an Audiobaze Account?\nCreate one on https://t.me/audiobaze_admin_bot/audiobaze_store`
        );

        return;
      }

      await sails.helpers.sendMessage(
        chat.id,
        `Oh Hi There! I remember you!\nYou are a verified Audiobaze User! How can I help you today?\nTo See a list of commands, Click/Tap /help 😊`
      );
    }

    if (type === "private" && command.includes("/custom")) {
      function extractCustomOrder(input) {
        const regex = /custom:(.+)/;
        const match = regex.exec(input);

        if (match && match[1]) {
          return match[1];
        } else {
          return null; // Return null if no match is found or if the matched string is empty
        }
      }

      try {
        await validateUser(chat.id);
        const user = await getUser(chat.id);
        const order = extractCustomOrder(command);

        if (!order) {
          await sails.helpers.sendMessage(
            chat.id,
            `Seems you are trying to submit a custom order...\nThis command submits a custom order to an admin, please make sure you are as descriptive as possible\nSubmit your order using the custom: command followed by your request\ne.g. custom:"I need a crypto trading site, my budget is $1000."`
          );

          return;
        }

        const admins = await User.find({ isSuperAdmin: true });

        if (admins.length === 0) {
          await sails.helpers.sendMessage(
            chat.id,
            `There are currently no admins available to take your request... Please try again later!`
          );

          return;
        }

        const adminTelegrams = await Promise.all(
          admins.map(async (admin) => {
            const telegram = await Telegram.findOne({ owner: admin.id });
            if (!telegram) {
              return null;
            }

            return telegram;
          })
        );

        sails.log.debug("Admin Telegrams", adminTelegrams);

        const nullExists = adminTelegrams.find((admin) => admin === null);

        if (nullExists) {
          await sails.helpers.sendMessage(
            chat.id,
            `There are currently no admins available to take your request... Please try again later!`
          );

          return;
        }

        for (var i = 0; i < adminTelegrams.length; i++) {
          if (!adminTelegrams[i]) {
            continue;
          }

          await sails.helpers.sendMessage(
            adminTelegrams[i].telegramChatId,
            `${user.fullName} just made a custom order request\nEmail Address: ${user.emailAddress}\nTelegram Username: ${chat.username}\nCustom Order:${order}`
          );
        }

        await sails.helpers.sendMessage(
          chat.id,
          `Your Custom Order has been submited. An Admin will contact you shortly...`
        );

        return;
      } catch (error) {
        sails.log.error(error);
        await sails.helpers.sendMessage(
          chat.id,
          `There was a problem processing that request... ❌`
        );

        return;
      }
    }

    if (type === "private" && command.includes("dashboard")) {
      const telegramRecord = await Telegram.findOne({
        telegramChatId: chat.id,
        isVerified: true,
      });

      if (!telegramRecord) {
        await sails.helpers.sendMessage(
          chat.id,
          `Sorry 😅\nYou don't seem to have a verified account on Audiobaze\nHow about we fix that?\nCould you verify account using the verifytoken commnand? \ne.g.verifytoken:DH22AS\nOr you could request for a token by providing your email address\ne.g. email:support@audiobaze.store`
        );

        return;
      }

      const userRecord = await User.findOne({
        id: telegramRecord.owner,
      })
        .populate("subscriptions")
        .populate("orders");

      if (!userRecord) {
        await sails.helpers.sendMessage(
          chat.id,
          `🤒 Uhh Bad News!\nI can't seem to find your Account Records on our system... Please contact Admin to help fix this.`
        );
        return;
      }

      if (userRecord && userRecord.isSuperAdmin) {
        try {
          const [unactivated, totalNoOfUsers, activated, unactivatedUsers] =
            await Promise.all([
              License.find({ keyStatus: "unactivated" }),
              User.find({ isSuperAdmin: false }),
              License.find({ keyStatus: "activated" }),
              User.find({ isSuperAdmin: false, activeSubscription: false }),
            ]);

          await sails.helpers.sendMessage(
            chat.id,
            `Hello Admin ${userRecord.fullName}\nEmailAddress: ${userRecord.emailAddress}\nUnactivated License Keys 🔑: ${unactivated.length}\nTotal No. Of Users: ${totalNoOfUsers.length}\nActivated License 🔑: ${activated.length}\nUnactivated Users: ${unactivatedUsers.length}`
          );
          return;
        } catch (error) {
          sails.log.error(error);
        }
      }

      await sails.helpers.sendMessage(
        chat.id,
        `Hi There! ${userRecord.fullName}\nEmail Address: ${
          userRecord.emailAddress
        }\nYour Account Status:Verified✅\nActive Subscription: ${
          userRecord.activeSubscription
            ? "You have an active Subscription"
            : "You have no active subscription❌"
        }\nAccount Balance 💵: $${userRecord.balance.toFixed(2)}`
      );
      return;
    }

    if (type === "private" && command.includes("email")) {
      const isEmail = emailExtract(command);

      if (!isEmail) {
        await sails.helpers.sendMessage(
          chat.id,
          `Uhhh 😅\nYou seem to be trying to verify your email address? I'm not so sure that's a valid email, please confirm and try again.`
        );

        return;
      }

      const userRecord = await User.findOne({
        emailAddress: isEmail,
      });

      if (!userRecord) {
        await sails.helpers.sendMessage(
          chat.id,
          `Sorry😬 Can't seem to find a User Account that has that Email Address, Please confirm and try again.`
        );

        return;
      }

      const telegramAccountRecord = await Telegram.findOne({
        owner: userRecord.id,
      });

      if (telegramAccountRecord && telegramAccountRecord.isVerified) {
        await sails.helpers.sendMessage(
          chat.id,
          `Hi ${userRecord.fullName}!\nYour Audiobaze Account is already verified`
        );

        return;
      }

      async function processVerification() {
        try {
          await User.updateOne({ id: userRecord.id }).set({
            emailProofToken: generateKey(),
          });

          await sails.helpers.sendMessage(
            chat.id,
            `Setting Up Telegram Account Record... 📝`
          );

          setTimeout(async () => {
            await sails.helpers.sendMessage(
              chat.id,
              `Generating Verification Key... 🔑`
            );
          }, 2000);

          setTimeout(async () => {
            await sails.helpers.sendMessage(
              chat.id,
              `Hello ${userRecord.fullName}!\nFound Your Email: ${isEmail}\nA verification token is currently available on your Audiobaze Dashboard,\nTap/Click here https://t.me/audiobaze_admin_bot/audiobaze_store to login to your dashboard\nPlease provide the token\ne.g. verifytoken:12345678`
            );
          }, 3000);
        } catch (error) {
          sails.log.error(error);
        }
      }

      if (!userRecord.emailProofToken) {
        if (!telegramAccountRecord) {
          try {
            await Telegram.create({
              owner: userRecord.id,
              telegramUserName: chat.username ? chat.username : null,
            });

            await processVerification();

            return;
          } catch (error) {
            sails.log.error(error);
            return;
          }
        }

        await processVerification();
      } else {
        await sails.helpers.sendMessage(
          chat.id,
          `I just looked through our database and found I already sent a verification token to your dashboard... Could you take a look to confirm? 😊\nOpen up your dashboard here\nTap/Click here https://t.me/audiobaze_admin_bot/audiobaze_store\nVerify your token using verifytoken:token\ne.g. verifytoken:AC130B1`
        );
      }
    }

    if (type === "private" && command.includes("verifytoken")) {
      await sails.helpers.sendMessage(chat.id, `Verification in progress...`);
      function extractToken(token) {
        try {
          const regex = /verifytoken:(.*)/;
          const match = token.match(regex);
          return match[1];
        } catch (error) {
          return false;
        }
      }

      try {
        const token = extractToken(command);

        if (!token) {
          setTimeout(async () => {
            await sails.helpers.sendMessage(
              chat.id,
              `😶Email Proof Token you just provided is invalid, could you confirm it's the right one and try again?\nProvide your verification token like this /verifytoken:2SD221`
            );
          }, 2000);

          return;
        }

        const userRecord = await User.findOne({ emailProofToken: token });

        if (!userRecord) {
          setTimeout(async () => {
            await sails.helpers.sendMessage(
              chat.id,
              `😶Email Proof Token you just provided is invalid, could you confirm it's the right one and try again?`
            );
          }, 2000);

          return;
        }

        const telegramRecord = await Telegram.findOne({ owner: userRecord.id });

        if (telegramRecord && telegramRecord.isVerified) {
          await sails.helpers.sendMessage(
            chat.id,
            `Hi ${userRecord.fullName}!\nYour Audiobaze Account is already verified`
          );

          return;
        }

        await User.updateOne({ id: userRecord.id }).set({
          emailProofToken: "",
        });

        await Telegram.updateOne({ owner: userRecord.id }).set({
          telegramChatId: chat.id,
          isVerified: true,
        });

        if (userRecord.isSuperAdmin) {
          await sails.helpers.sendMessage(
            chat.id,
            `Hello Admin, Your Account is now verified ✅`
          );

          return;
        }

        await sails.helpers.sendMessage(
          chat.id,
          `You have successfully verified your Audiobaze Account 😊\nTo view your account information\nTap/Click  /dashboard`
        );
        return;
      } catch (error) {
        sails.log.error(error);
        return;
      }
    }

    if (type === "private" && command.includes("store")) {
      try {
        await sails.helpers.sendMessage(chat.id, `Loading Up Store 🛒`);

        const products = await Product.find({});

        if (products.length === 0) {
          setTimeout(async () => {
            await sails.helpers.sendMessage(
              chat.id,
              `Seems we don't have products listed right now... 😅\nCould you check again sometime later? `
            );
          }, 3000);
          return;
        }

        function isURIEncoded(str) {
          try {
            return decodeURIComponent(str) !== str;
          } catch (error) {
            return false;
          }
        }

        const productList = products.map(async (product, index) => {
          setTimeout(async () => {
            await sails.helpers.sendPhoto(
              chat.id,
              product.productImage,
              `PRODUCT No.${index + 1}\n\n${product.productTitle}\n${
                product.productDescription
              }\n${
                isURIEncoded(product.detailedProductDescription)
                  ? decodeURIComponent(product.detailedProductDescription)
                  : product.detailedProductDescription
              }\nFeatures: ${product.productFeatures}\nPrice: $${
                product.price
              }\nETA: ${
                product.deliveryETA
              } Days\nAdd to Cart 🛒 : https://t.me/audiobaze_admin_bot/audiobaze_store`
            );
          }, 2000);
        });

        Promise.all(productList);
        return;
      } catch (error) {
        sails.log.error(error);
      }
    }

    if (type === "private" && command.includes("orders")) {
      try {
        await validateUser(chat.id);

        const telegramRecord = await Telegram.findOne({
          telegramChatId: chat.id,
          isVerified: true,
        });

        const userRecord = await User.findOne({
          id: telegramRecord.owner,
        }).populate("orders");

        if (!userRecord) {
          await sails.helpers.sendMessage(
            chat.id,
            `There seems to be a problem pulling your records from the database ❌.. Please try again later...`
          );

          return;
        }

        if (userRecord && userRecord.isSuperAdmin) {
          const orders = Order.find({});

          if (orders.length === 0) {
            await sails.helpers.sendMessage(chat.id, ``);

            return;
          }

          return;
        }

        const orders = userRecord.orders;

        if (orders.length === 0) {
          await sails.helpers.sendMessage(
            chat.id,
            `There are no records of you making a purchase on the Audiobaze Store\nYou can view products we currently have available using /store or login to your Audiobaze Dashboard https://t.me/audiobaze_admin_bot/audiobaze_store`
          );

          return;
        }

        await sails.helpers.sendMessage(
          chat.id,
          `Hello ${userRecord.fullName}!\nYou have the following Orders in Records 😊`
        );

        const records = orders.map(async (order) => {
          function transactionStatus(status) {
            if (status === "processing") {
              return "Processing ⌛";
            }

            if (status === "completed") {
              return "Successful✅";
            }

            if (status === "canceled") {
              return "Canceled ❌";
            }
          }
          const products = await order.purchasedProducts;

          const productList = await products.map((product, i) => {
            return `Product No.${i + 1}\n${product.productTitle}\n${
              product.productDescription
            }\nETA: ${product.deliveryETA} Days\nCost:$${
              product.price
            }\nQuantity: ${product.quantity}`;
          });

          await sails.helpers.sendMessage(
            chat.id,
            `ORDERED PRODUCTS\n${productList.join("\n\n")}\n\nTransaction ID: ${
              order.transactionId
            }\nDate of Transaction: ${
              order.orderDate
            }\nStatus: ${transactionStatus(order.status)}\nPrice:$${
              order.amountPaid
            }\n\nSet Your Paying Wallet Address: using /setwallet\nTo verify transaction if payment made /verifytx:TransactionID `
          );
        });

        Promise.all(records);
        return;
      } catch (error) {
        sails.log.error(error);
        return;
      }
    }

    if (type === "private" && command.includes("setadmin")) {
      const email = emailExtract(command);

      if (!email) {
        await sails.helpers.sendMessage(
          chat.id,
          `Hello! You just submitted an invalid Email Address... Please confirm and try again ❌`
        );

        return;
      }

      try {
        const adminRecord = await User.findOne({
          emailAddress: email,
          isSuperAdmin: true,
        });

        if (!adminRecord) {
          await sails.helpers.sendMessage(
            chat.id,
            `Unauthorized Action ❌\nYou're not an Admin Account on the Audiobaze System`
          );

          return;
        }

        if (adminRecord.emailProofToken) {
          await sails.helpers.sendMessage(
            chat.id,
            `I already sent your verification token to your dashboard! 😁\nLogin to your dashboard to view your verification token`
          );

          return;
        }

        await sails.helpers.sendMessage(chat.id, `Processing ⌛`);

        const telegramRecord = await Telegram.findOne({
          owner: adminRecord.id,
        });

        if (!telegramRecord) {
          await Telegram.create({
            owner: adminRecord.id,
            telegramUserName: chat.username ? chat.username : null,
          });

          await sails.helpers.sendMessage(
            chat.id,
            `Parsing Through Telegram Records ⌛`
          );
        }

        await User.updateOne({ emailAddress: email }).set({
          emailProofToken: generateKey(),
        });

        await sails.helpers.sendMessage(
          chat.id,
          `Generating Confirmation Token 🔑`
        );

        setTimeout(async () => {
          await sails.helpers.sendMessage(
            chat.id,
            `Hello ${adminRecord.fullName}!\nFound Your Email: ${adminRecord.emailAddress}\nA verification token is currently available on your Audiobaze Dashboard,\nTap/Click here https://t.me/audiobaze_admin_bot/audiobaze_store to login to your dashboard\nPlease provide the token\ne.g. verifytoken:12345678`
          );
        }, 2000);
      } catch (error) {
        sails.log.error(error);
        return;
      }
    }

    if (type === "private" && command.includes("setwallet")) {
      function extractWalletAddress(inputText) {
        const pattern = /setwallet:\s*([a-zA-Z0-9]+)/;
        const match = inputText.match(pattern);
        if (match && match[1]) {
          return match[1];
        }
        return null;
      }

      function detectWalletAddress(address) {
        const patterns = {
          BTC: /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/,
          LTC: /^[LM3][a-km-zA-HJ-NP-Z1-9]{26,33}$/,
          ETH: /^(0x)?[0-9a-fA-F]{40}$/,
          TRON: /^T[1-9A-HJ-NP-Za-km-z]{33}$/,
        };

        // Check BTC
        if (patterns.BTC.test(address)) {
          return "BTC";
        }

        // Check LTC
        if (patterns.LTC.test(address)) {
          return "LTC";
        }

        // Check ETH
        if (patterns.ETH.test(address)) {
          return "ETH";
        }

        // Check Tron
        if (patterns.TRON.test(address)) {
          return "TRON";
        }

        return "Unknown";
      }

      await validateUser(chat.id);
      const walletAddress = await extractWalletAddress(command);

      if (!walletAddress) {
        await sails.helpers.sendMessage(
          chat.id,
          `There was a bit of an issue storing your wallet address, could you wait a moment and try again ❌\nMake sure you are providing your wallet address the right way\ne.g./setwallet:0xe7776De78740f28a96412eE5cbbB8f90896b11A5`
        );

        return;
      }

      const walletType = detectWalletAddress(walletAddress);

      if (walletType === "Unknown") {
        await sails.helpers.sendMessage(
          chat.id,
          `There was a bit of an issue storing your wallet address, could you wait a moment and try again ❌\nMake sure you are providing your wallet address the right way\ne.g./setwallet:0xe7776De78740f28a96412eE5cbbB8f90896b11A5\nWe only accept Wallet Address of the following blockchains\nBTC, LTC, ETC & TRON.`
        );

        return;
      }

      // Find User Record
      const tgUser = await Telegram.findOne({ telegramChatId: chat.id });

      // Create new Wallet Record
      try {
        const walletRecord = await Wallet.findOne({
          address: walletAddress,
          blockchain: walletType,
          owner: tgUser.owner,
        });

        if (walletRecord) {
          await sails.helpers.sendMessage(
            chat.id,
            `You are already have ${walletType} : ${walletAddress} set up on the audiobaze platform`
          );

          return;
        }

        const telegramUserRecord = await Telegram.findOne({
          telegramChatId: chat.id,
        });

        await Wallet.create({
          owner: telegramUserRecord.owner,
          address: walletAddress,
          blockchain: walletType,
        });

        await sails.helpers.sendMessage(
          chat.id,
          `New Wallet\nType ${walletType} \nAddress ${walletAddress} stored in Audiobaze.`
        );
        return;
      } catch (error) {
        sails.log.error(error);
        return;
      }
    }

    if (type === "private" && command.includes("verifytx")) {
      await validateUser(chat.id);
      const user = await getUser(chat.id);
      const wallets = await Wallet.find({ owner: user.id });

      if (wallets.length === 0) {
        await sails.helpers.sendMessage(
          chat.id,
          `You have no wallet addresses set for us to watch...`
        );
        return;
      }

      const hash = getTx(command);

      if (!hash) {
        await sails.helpers.sendMessage(
          chat.id,
          `Failed to Extract Transaction Hash❌\nMake sure you have the transaction hash in your command\ne.g. verifytx:0xb96306a1477dc8e070b4fd1587b7accc058e9698aff64bf9fb606c7e2effc2ef`
        );
        return;
      }

      for (i = 0; i < wallets.length; i++) {
        const { address, blockchain } = wallets[i];
        if (blockchain === "ETH") {
          const isValidHash = await verifyETHhash(hash);

          if (!isValidHash) {
            await sails.helpers.sendMessage(
              chat.id,
              `Hash Validation on Etherscan 💎 Failed ❌`
            );
          }
          function weiToEth(wei) {
            const weiBigInt = BigInt(wei);
            // Define the conversion factor (10^18)
            const conversionFactor = BigInt("1000000000000000000");

            // Perform the conversion
            const eth = Number(weiBigInt) / Number(conversionFactor);

            return eth;
          }

          const transaction = await findEthPayment(chat.id, address, hash);

          if (transaction) {
            try {
              const transactionBalance = await sails.helpers.getEthPrice(
                weiToEth(transaction.value)
              );
              const newBalance = user.balance + transactionBalance;
              const newUser = await User.updateOne({ id: user.id }).set({
                balance: newBalance,
              });

              await sails.helpers.sendMessage(
                chat.id,
                `Hello User\nYour Transaction has been confirmed and your Audiobaze Store Wallet Balance is $${newUser.balance.toFixed(
                  2
                )}`
              );

              return;
            } catch (error) {
              sails.log.error(error);
              await sails.helpers.sendMessage(
                chat.id,
                `Eish ❌\nThere seems to be some problem updating transactions`
              );
            }
          }

          await sails.helpers.sendMessage(
            chat.id,
            `I couldn't verify this transaction on ${blockchain} with the Wallet Address:${address}... ${
              wallets.length > 1
                ? i !== wallets.length - 1
                  ? "Will attempt other blockchains of wallets you have stored"
                  : "I have tried all wallets you have stored on audiobaze store"
                : ""
            }`
          );
        }
        if (blockchain === "TRON") {
          const transaction = await verifyTronHash(hash);

          if (!transaction) {
            await sails.helpers.sendMessage(
              chat.id,
              `I couldn't verify this transaction on ${blockchain} with the Wallet Address:${address}... ${
                wallets.length > 1
                  ? i !== wallets.length - 1
                    ? "Will attempt other blockchains of wallets you have stored"
                    : "I have tried all wallets you have stored on audiobaze store"
                  : ""
              }`
            );
          }

          sails.log.debug(transaction);

          if (transaction) {
            const {
              to_address,
              from_address,
              amount_str,
              symbol,
              contract_address,
              name,
              type,
              tokenType,
            } = transaction;

            if (
              from_address !== address ||
              to_address !== "TCbRcFoB1AykKW4bD11xGHdM29QoLKQdAw"
            ) {
              await sails.helpers.sendMessage(
                chat.id,
                `Transaction Hash doesn't have record of a transaction from your wallet address to Audiobaze Store's Wallet Address❌`
              );
            }

            if (
              symbol === "USDT" &&
              from_address === address &&
              to_address === "TCbRcFoB1AykKW4bD11xGHdM29QoLKQdAw" &&
              contract_address === "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t" &&
              name === "Tether USD" &&
              type === "Transfer" &&
              tokenType === "trc20"
            ) {
              const amountPaid = parseInt(amount_str) / 1000000;
              const newBalance = user.balance + amountPaid;

              const transactionRecord = await Transaction.findOne({
                hash,
                from: from_address,
                to: "TCbRcFoB1AykKW4bD11xGHdM29QoLKQdAw",
              });

              if (transactionRecord) {
                await sails.helpers.sendMessage(
                  chat.id,
                  `This Transaction has already been verified and your balance updated😉`
                );

                return;
              }

              const newUser = await User.updateOne({ id: user.id }).set({
                balance: newBalance,
              });

              await Transaction.create({
                hash,
                blockchain,
                amount: {
                  dollars: amountPaid,
                  crypto: "NA",
                },
                from: from_address,
                to: "TCbRcFoB1AykKW4bD11xGHdM29QoLKQdAw",
              });

              await sails.helpers.sendMessage(
                chat.id,
                `Successfully located transaction on ${blockchain}!\nAmount Paid: ${amountPaid}\nTxHash:${hash}
                  `
              );

              await sails.helpers.sendMessage(
                chat.id,
                `Hello User\nYour Transaction has been confirmed and your Audiobaze Store Wallet Balance is $${newUser.balance.toFixed(
                  2
                )}`
              );

              return;
            }
          }
        }
        if (blockchain === "BTC") {
          await sails.helpers.sendMessage(
            chat.id,
            `Transaction Verification for ${blockchain} is in development, verify transactions on this chain with the Audiobaze Admin`
          );
        }
        if (blockchain === "LTC") {
          await sails.helpers.sendMessage(
            chat.id,
            `Transaction Verification for ${blockchain} is in development, verify transactions on this chain with the Audiobaze Admin`
          );
        }
      }
    }

    if (type === "private" && command.includes("mywallets")) {
      await validateUser(chat.id);
      const user = await getUser(chat.id);

      if (!user) {
        await sails.helpers.sendMessage(
          chat.id,
          `There was a problem finding the audiobaze account your telegram is linked to... Please Try Again Later`
        );

        return;
      }

      const wallets = await Wallet.find({ owner: user.id });
      if (wallets.length === 0) {
        await sails.helpers.sendMessage(
          chat.id,
          `You have no wallets set up for audiobaze transactions\nSet a new wallet using the /setwallet command\ne.g. /setwallet:0xD583D6b6Ef2e98deE911A327F935F02276B2C581`
        );

        return;
      }

      await sails.helpers.sendMessage(
        chat.id,
        `Looking through our database... Wallet${
          wallets.length > 1 ? "(s)" : ""
        } Located`
      );

      const walletProcess = wallets.map(async (wallet) => {
        await sails.helpers.sendMessage(
          chat.id,
          `Wallet Address: ${wallet.address}\nBlockchain:${wallet.blockchain}`
        );
      });

      setTimeout(async () => {
        await Promise.all(walletProcess);
      }, 2000);

      return;
    }

    if (type === "private" && command.includes("balance")) {
      try {
        await validateUser(chat.id);
        const user = await getUser(chat.id);

        await sails.helpers.sendMessage(
          chat.id,
          `Hello ${
            user.fullName
          }\nYour Current Account Balance: $${user.balance.toFixed(
            2
          )}\nTo make payment for Audiobaze Products, use the /payfororder: command.`
        );

        return;
      } catch (error) {
        return;
      }
    }

    if (type === "private" && command.includes("mytransactions")) {
      await validateUser(chat.id);
      const user = await getUser(chat.id);
      const wallets = await Wallet.find({ owner: user.id });

      if (wallets.length === 0) {
        await sails.helpers.sendMessage(
          chat.id,
          `You have no wallets set up for audiobaze transactions\nSet a new wallet using the /setwallet command\ne.g. /setwallet:0xD583D6b6Ef2e98deE911A327F935F02276B2C581`
        );

        return;
      }

      await sails.helpers.sendMessage(
        chat.id,
        `Looking through Audiobaze Store for Transactions.`
      );

      const walletSearch = wallets.map(async (wallet) => {
        const transactions = await Transaction.find({
          from: wallet.address.toLowerCase(),
          blockchain: wallet.blockchain,
        });

        if (transactions.length === 0) {
          await sails.helpers.sendMessage(
            chat.id,
            `There are no transactions found between this wallet and Audiobaze Stores`
          );

          return;
        }

        const transactionsMessageBody = transactions.map(
          (transaction, index) => {
            return `Transaction No.${index + 1}\nTx: ${
              transaction.hash
            }\nAmount: $${transaction.amount.dollars.toFixed(2)}/${
              transaction.amount.crypto
            } ${transaction.blockchain}💎\nFrom: ${transaction.from}\nTo: ${
              transaction.to
            }\nTransaction Confirmed ✅`;
          }
        );

        await sails.helpers.sendMessage(
          chat.id,
          `Transactions Found 📝\n${
            wallet.blockchain
          } Blockchain\n${transactionsMessageBody.join("\n\n")}`
        );
      });

      await Promise.all(walletSearch);
      return;
    }

    if (type === "private" && command.includes("/payfororder")) {
      await validateUser(chat.id);
      const user = await getUser(chat.id);
      const txId = getPayForOrderTx(command);

      if (!txId) {
        await sails.helpers.sendMessage(
          chat.id,
          `Failed To Get Order Tx\nPlease try again ❌\nCommand should include the Tx ID\ne.g. /payfororder:SDAS22121212`
        );

        return;
      }

      const order = await Order.findOne({
        transactionId: txId,
        owner: user.id,
        status: "processing",
      });

      if (!order) {
        await sails.helpers.sendMessage(
          chat.id,
          `Failed to find an order in processing state with that Tx ID, please try again later... ❌`
        );

        return;
      }

      // Attempt Payment
      const costOfOrder = order.amountPaid;

      if (costOfOrder > user.balance) {
        const remainder = user.balance - costOfOrder;

        await sails.helpers.sendMessage(
          chat.id,
          `You have insufficient balance ❌\nYou are currently $${Math.abs(
            remainder
          ).toFixed(
            2
          )} short on this transaction\nMake Payment to any of the wallets below and then use the /verifytx:Txhash command to verify the Transaction\n\nAudiobaze Wallets\nETH (ERC20): 0x30f98Bb3fEe1D1Dc1552F132E6E9E5BFB506123f`
        );

        return;
      }

      await sails.helpers.sendMessage(
        chat.id,
        `Order Found\nTx: ${order.transactionId}\nProcessing Order... 📝`
      );

      // Update User & Order Record
      try {
        const remainder = user.balance - costOfOrder;
        const updatedUser = await User.updateOne({
          id: user.id,
        }).set({
          balance: remainder,
        });

        const updatedOrder = await Order.updateOne({
          id: order.id,
        }).set({
          status: "completed",
        });

        const receipt = await Receipt.create({
          owner: user.id,
          products: updatedOrder.purchasedProducts,
          amountPaid: costOfOrder,
        }).fetch();

        const products = receipt.products.map((product, i) => {
          return `Product No.${i + 1}\n${product.productTitle}\nService Type:${
            product.serviceType
          }\nETA: ${product.deliveryETA}\nPrice: ${
            product.quantity * product.price
          }\nQuantity: ${product.quantity}`;
        });

        await sails.helpers.sendMessage(
          chat.id,
          `Successfully Generated Receipt 📝\n\n ${
            updatedUser.fullName
          }\n ${products.join("\n\n")} \nTotal Paid: $${receipt.amountPaid}`
        );
      } catch (error) {
        sails.log.error(error);

        await sails.helpers.sendMessage(
          chat.id,
          `There was a server error processing this order\n
          Failed To Generate Receipt ❌`
        );
      }
    }
  },
};
