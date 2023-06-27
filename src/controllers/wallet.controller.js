const { Wallet } = require("../models/wallet.model");
const { Transaction } = require("../models/transaction.model");

const getAllWallets = (req, res) => {
  Wallet.find()
    .then((wallets) => {
      if (!wallets?.length) {
        res.status(200).send([]);
      }
      const allWallets = wallets.map((wallet) => ({
        id: wallet._id,
        balance: wallet.balance,
        name: wallet.name,
        date: wallet.date,
      }));

      res.status(200).json(allWallets);
    })
    .catch((error) => {
      console.error("No Wallet found:", error);
      res.status(500).json({ error: "No Wallet Found" });
    });
};

function setupWallet(req, res) {
  const { balance, name } = req.body;

  const wallet = new Wallet({
    balance: parseFloat(parseInt(balance).toFixed(4)),
    name,
  });

  wallet
    .save()
    .then((savedWallet) => {
      const transaction = new Transaction({
        walletId: savedWallet._id,
        amount: savedWallet.balance,
        balance: savedWallet.balance,
        description: "Setup",
        type: "CREDIT",
      });
      return transaction.save();
    })
    .then((savedTransaction) => {
      res.status(200).json({
        id: savedTransaction.walletId,
        balance: savedTransaction.balance,
        transactionId: savedTransaction._id,
        name: req.body.name,
        date: savedTransaction.date,
      });
    })
    .catch((error) => {
      console.error("Error setting up wallet:", error);
      res.status(500).json({ error: "Failed to setup wallet" });
    });
}

const getWallet = (req, res) => {
  const { id } = req.params;

  Wallet.findById(id)
    .then((wallet) => {
      if (!wallet) {
        throw new Error("Wallet not found");
      }
      res.status(200).json({
        id: wallet._id,
        balance: wallet.balance,
        name: wallet.name,
        date: wallet.date,
      });
    })
    .catch((error) => {
      console.error("Error fetching wallet details:", error);
      res.status(500).json({ error: "Failed to fetch wallet details" });
    });
};

module.exports = { setupWallet, getWallet, getAllWallets };
