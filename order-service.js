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

    // Create the order only if the customer and product are valid.
    const data = req.body;
    orders.push(data);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /orders/:orderId: Get order details.
app.get("/orders/:orderId", (req, res) => {
  try {
    const orderId = parseInt(req.params.orderId, 10);
    const data = orders.find((order) => order.orderId === orderId);

    if (data) {
      res.json(data);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /orders/:orderId: Update an order.
app.put("/orders/:orderId", async (req, res) => {
  try {
    const data = req.body;
    const orderId = parseInt(req.params.orderId);
    const index = orders.findIndex((order) => {
      return order.orderId === orderId;
    });

    if (index !== -1) {
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

      if (productRes.status !== 200 || customerRes.status !== 200) {
        return res
          .status(500)
          .json({ error: "Failed to retrieve product or customer id" });
      }

      orders[index] = { ...orders[index], ...req.body };
      res.status(200).json({ message: "Order successfully updated" });
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /orders/:orderId: Delete an order.
app.delete("/orders/:orderId", (req, res) => {
  try {
    const orderId = parseInt(req.params.orderId);
    const index = orders.findIndex((order) => {
      return order.orderId === orderId;
    });

    if (index !== -1) {
      orders.splice(index, 1);
      res.status(200).json({ message: "Order successfully deleted" });
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Order service running on port ${port}`);
});
