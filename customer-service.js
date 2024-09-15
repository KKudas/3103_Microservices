const express = require("express");
const app = express();
const port = 3002;

app.use(express.json());

let customers = [];

// POST /customers: Add a new customer.
app.post("/customers", (req, res) => {
  const data = req.body;
  customers.push(data);
  res.status(201).json(data);
});

// GET /customers/:customerId: Get customer details by ID.
app.get("/customers/:customerId", (req, res) => {
  const customerId = parseInt(req.params.customerId, 10);
  const data = customers.find((customer) => customer.customerId === customerId);

  if (data) {
    res.json(data);
  } else {
    res.status(404).json({ message: "Customer not found" });
  }
});

// PUT /customers/:customerId: Update customer information.
app.put("/customers/:customerId", (req, res) => {
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
});

// DELETE /customers/:customerId: Delete a customer.
app.delete("/customers/:customerId", (req, res) => {
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
});

//health check if online
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`User service running on port ${port}`);
});
