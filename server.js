// Libs
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

// Constants
const { MONGO_URL, MONGO_PASSWORD, MONGO_USER, PORT } = require("./constants");

// Controllers
const {
  setupWallet,
  getWallet,
  getAllWallets,
} = require("./src/controllers/wallet.controller");

// Models
const {
  walletTransaction,
  getTransactions,
} = require("./src/controllers/transaction.controller");

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
  })
);
app.use(bodyParser.json());

// MongoDB connection URI and database name
const uri = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_URL}`;

// API to get all Wallets
app.get("/wallets", getAllWallets);

// API endpoint to setup a new wallet
app.post("/setup", setupWallet);

// API endpoint to credit/debit amount to the wallet
app.post("/transact/:walletId", walletTransaction);

// API endpoint to fetch transactions for a wallet
app.get("/transactions", getTransactions);

// API endpoint to get wallet details
app.get("/wallet/:id", getWallet);

// Connect to MongoDB
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");

    // Start the server after successful database connection
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
  });
