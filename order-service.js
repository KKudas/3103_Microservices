const express = require("express");
const axios = require("axios");
const app = express();
const port = 3003;

app.use(express.json());

let orders = [];

// POST /orders: Create a new order. This service will:
app.post("/orders", async (req, res) => {
  const data = req.body;
  const prodService = axios.get("localhost:3001/health");
  const customerService = axios.get("localhost:3002/health");

  const [res1, res2] = await Promise.all([prodService, customerService]);

  if (res1.data.status === "ok" && res2.data.status === "ok") {
    orders.push(data);
    res.status(201).json(data);
  } else {
    res.status(400).json({
      message: "One or both APIs failed",
      api1: response1.data,
      api2: response2.data,
    });
  }
});

// Verify that the customer exists by communicating with the Customer Service.
// Verify that the product exists by communicating with the Product Service.
// Create the order only if the customer and product are valid.

// GET /orders/:orderId: Get order details.
// app.get("/orders/:orderId", (req, res) => {});
// PUT /orders/:orderId: Update an order.

// DELETE /orders/:orderId: Delete an order.

app.listen(port, () => {
  console.log(`Order service running on port ${port}`);
});
