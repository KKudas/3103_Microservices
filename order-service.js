const express = require("express");
const axios = require("axios");
const app = express();
const port = 3003;

app.use(express.json());

let orders = [];

// POST /orders: Create a new order. This service will:
app.post("/orders", async (req, res) => {
  try {
    const productId = parseInt(req.body.productId);
    const customerId = parseInt(req.body.customerId);

    const productReq = await axios.get(
      `http://localhost:3001/products/${productId}`
    );
    const customerReq = await axios.get(
      `http://localhost:3002/customers/${customerId}`
    );

    const [customerRes, productRes] = await Promise.all([
      customerReq,
      productReq,
    ]);

    // Verify that the customer exists by communicating with the Customer Service.
    // Verify that the product exists by communicating with the Product Service.
    if (productRes.status !== 200 || customerRes.status !== 200) {
      return res
        .status(500)
        .json({ error: "Failed to retrieve product or customer id" });
    }

    const data = req.body;
    orders.push(data);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Create the order only if the customer and product are valid.

// GET /orders/:orderId: Get order details.
app.get("/orders/:orderId", (req, res) => {
  const orderId = parseInt(req.params.orderId, 10);
  const data = orders.find((order) => order.orderId === orderId);

  if (data) {
    res.json(data);
  } else {
    res.status(404).json({ message: "Order not found" });
  }
});

// PUT /orders/:orderId: Update an order.

// DELETE /orders/:orderId: Delete an order.

app.listen(port, () => {
  console.log(`Order service running on port ${port}`);
});
