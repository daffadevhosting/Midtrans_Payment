const express = require("express");
const bodyParser = require("body-parser");
const midtransClient = require("midtrans-client");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.server_key
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

// Tambahkan rute utama untuk menangani permintaan ke halaman utama
app.get("/", (req, res) => {
    res.send("Welcome to the Midtrans Payment API");
});

module.exports = app;