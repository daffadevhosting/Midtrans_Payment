const express = require("express");
const bodyParser = require("body-parser");
const midtransClient = require("midtrans-client");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY
});

app.post("/api/token", async (req, res) => {
    try {
        const parameter = {
            transaction_details: {
                order_id: "ORDER-" + new Date().getTime(),
                gross_amount: req.body.amount
            }
        };
        
        const transaction = await snap.createTransaction(parameter);
        res.json({ token: transaction.token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = app;
