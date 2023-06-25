const mongoose = require("mongoose");
const { Transaction } = require("../models/transaction.model");
const { Wallet } = require("../models/wallet.model");

const walletTransaction = async (req, res) => {
  const { walletId } = req.params;
  const { amount, description } = req.body;

  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    const opts = { session };

    const wallet = await Wallet.findById(walletId, null, opts).exec();

    if (!wallet) {
      throw new Error("Wallet not found");
    }

    const newBalance = parseFloat((wallet.balance + amount).toFixed(4));

    const transaction = new Transaction({
      walletId: wallet._id,
      amount: parseFloat(amount.toFixed(4)),
      balance: newBalance,
      description,
      type: amount >= 0 ? "CREDIT" : "DEBIT",
    });

    wallet.balance = newBalance;

    const updatedWallet = await wallet.save(opts);

    if (!updatedWallet) {
      throw new Error('Failed to update wallet');
    }
    await Promise.all([transaction.save(opts), wallet.save(opts)]);

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      balance: transaction.balance,
      transactionId: transaction._id,
    });
  } catch (error) {
    console.error("Error processing transaction:", error);
    res.status(500).json({ error: "Failed to process transaction" });
  }
};

const getTransactions = (req, res) => {
  const { walletId, skip, limit } = req.query;

  Transaction.find({ walletId })
    .sort("-date")
    .skip(parseInt(skip) * parseInt(limit))
    .limit(parseInt(limit))
    .exec()
    .then((transactions) => {
      res.status(200).json(transactions);
    })
    .catch((error) => {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ error: "Failed to fetch transactions" });
    });
};

module.exports = { walletTransaction, getTransactions };
