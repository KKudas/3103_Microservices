const express = require("express");
const app = express();
const port = 3002;

app.use(express.json());

let customers = [];

// POST /customers: Add a new customer.
app.post("/customers", (req, res) => {
  try {
    const data = req.body;
    customers.push(data);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: "There was an error adding a new customer" });
  }
});

// GET /customers/:customerId: Get customer details by ID.
app.get("/customers/:customerId", (req, res) => {
  try {
    const customerId = parseInt(req.params.customerId, 10);
    const data = customers.find(
      (customer) => customer.customerId === customerId
    );

    if (data) {
      res.json(data);
    } else {
      res.status(404).json({ message: "Customer not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "There was an error fetching the customer" });
  }
});

// PUT /customers/:customerId: Update customer information.
app.put("/customers/:customerId", (req, res) => {
  try {
    const customerId = parseInt(req.params.customerId, 10);
    const index = customers.findIndex((customer) => {
      return customer.customerId === customerId;
    });

    if (index !== -1) {
      customers[index] = { ...customers[index], ...req.body };
      res.status(200).json({ message: "User successfully updated" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "There was an error updating the customer" });
  }
});

// DELETE /customers/:customerId: Delete a customer.
app.delete("/customers/:customerId", (req, res) => {
  try {
    const customerId = parseInt(req.params.customerId, 10);
    const index = customers.findIndex((customer) => {
      return customer.customerId === customerId;
    });

    if (index !== -1) {
      customers.splice(index, 1);
      res.status(200).json({ message: "Customer successfully deleted" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "There was an error deleting the customer" });
  }
});

app.listen(port, () => {
  console.log(`User service running on port ${port}`);
});
