const axios = require("axios");
const { parseISO, format } = require("date-fns");

module.exports = {
  friendlyName: "Find eth payment",

  description: "",

  inputs: {
    chatId: {
      type: "string",
      description: "Telegram Chat ID",
    },
    buyerWallet: {
      type: "string",
      description: "ETH Wallet Address",
    },
    txHash: {
      type: "string",
      description: "Tx Hash",
    },
  },

  exits: {
    success: {
      description: "All done.",
    },
  },

  fn: async function ({ chatId, buyerWallet, txHash }) {
    const companyWallet = "0xF2255c5F4dd0a2dfC4B65bab08EE27CA58333362";
    const API_KEY = "XJRSJ2T3QI44NC2TP1MJNQ8PB7J515DPIM";
    const testnet = "https://api-sepolia.etherscan.io/api";
    const mainnet = "https://api.etherscan.io/api";
    const endpoint = `${testnet}?module=account&action=txlist&address=${companyWallet}&startblock=0&endblock=99999999&sort=desc&apikey=${API_KEY}`;

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
      const transaction = transactions.find((transaction) => {
        if (
          txhash === transaction.hash &&
          transaction.from === buyerAddress.toLowerCase()
        ) {
          return transaction;
        }
      });

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
    sails.log.debug(transaction);

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
        `This Transaction has already been verified and your balance updated😉`
      );

      return;
    }

    await sails.helpers.sendMessage(
      chatId,
      `Transaction Located ✅\ntx:${transaction.hash}📃\n💎${weiToEth(
        transaction.value
      )} ETH/ ${await sails.helpers.getEthPrice(
        weiToEth(transaction.value)
      )}\nYou paid the above amount to ${companyWallet}`
    );

    const newTransactionRecord = await Transaction.create({
      hash: transaction.hash,
      blockchain: "ETH",
      amount: {
        dollars: await sails.helpers.getEthPrice(weiToEth(transaction.value)),
        crypto: weiToEth(transaction.value),
      },
      from: buyerWallet.toLowerCase(),
      to: companyWallet,
    });

    await sails.helpers.sendMessage(
      chatId,
      `Successfully Created Tx Receipt📝\nTransaction Hash: ${
        newTransactionRecord.hash
      }\nBlockchain :${newTransactionRecord.blockchain}\nAmount: $${
        newTransactionRecord.amount.dollars
      }/${newTransactionRecord.amount.crypto}\nFrom: ${
        newTransactionRecord.from
      }\nTo: ${newTransactionRecord.to}\nDate: ${format(
        parseISO(newTransactionRecord.createdAt),
        "PPpp"
      )}`
    );
    return transaction;
  },
};
