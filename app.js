const express = require("express");
const axios = require("axios");
const app = express();
const PORT = 3000;

let exchangeRates = {};
const API_URL =
  "https://v6.exchangerate-api.com/v6/8e086937a5a3278bb65f2e54/latest/USD";

async function fetchExchangeRates() {
  try {
    const response = await axios.get(API_URL);
    exchangeRates = response.data.conversion_rates;
    console.log("Exchange rates updated.");
  } catch (error) {
    console.error("Error fetching exchange rates:", error);
  }
}

fetchExchangeRates();

setInterval(fetchExchangeRates, 24 * 60 * 60 * 1000);

app.get("/get", (req, res) => {
  const { from, to } = req.query;

  if (!from || !to) {
    return res
      .status(400)
      .json({ error: 'Please provide both "from" and "to" query parameters.' });
  }

  const fromRate = exchangeRates[from];
  const toRate = exchangeRates[to];

  if (!fromRate || !toRate) {
    return res.status(400).json({ error: "Invalid currency code provided." });
  }

  const conversionRate = toRate / fromRate;
  res.json({ from, to, rate: conversionRate });
});

app.get("/currencies", (req, res) => {
  res.json({ currencies: Object.keys(exchangeRates) });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});