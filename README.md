# Wallet Management Backend

Container : http://13.211.169.168:8000/

This is the backend part of the wallet management application built using Express.js and MongoDB with Mongoose. It provides the API endpoints for managing wallets and transactions.

## Prerequisites

- Node.js (version 18.12.1)
- Express (version 4.18.2)

## Getting Started

1. Clone the repository:
git clone <repository-url>


2. Install dependencies:
cd backend
npm install


3. Configure the MongoDB connection:
- Open the `constants.js` file.
- Set the `MONGO_URL`, `MONGO_USER`, and `MONGO_PASSWORD` variables to the appropriate values for your MongoDB configuration.

4. Start the server:
   npm start


5. The backend API will be running at `http://localhost:8000`.

## API Endpoints

- `POST /setup`: Set up a new wallet with an initial balance.
- `POST /transact/:walletId`: Credit or debit amounts to the wallet.
- `GET /transactions`: Fetch the recent transactions on a wallet.
- `GET /wallet/:id`: Get detailed information about a wallet.
- `GET /wallets`: Get all wallets.
- `GET /transactions/export` : Fetches and forms the csv file from json and returns to client.

## Technologies Used

- Express.js
- MongoDB with Mongoose


