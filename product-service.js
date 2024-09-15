const express = require("express");
const app = express();
const port = 3001;

app.use(express.json());

let products = [];

// POST /products: Add a new product.
app.post("/products", (req, res) => {
  const data = req.body;
  products.push(data);
  res.status(201).json(data);
});

// GET /products/:productId: Get product details by ID.
app.get("/products/:productId", (req, res) => {
  const productId = parseInt(req.params.productId, 10);
  const item = products.find((product) => product.productId === productId);

  if (item) {
    res.json(item);
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});

// PUT /products/:productId: Update a product.
app.put("/products/:productId", (req, res) => {
  const productId = parseInt(req.params.productId, 10);
  const index = products.findIndex((product) => {
    return product.productId === productId;
  });

  if (index !== -1) {
    products[index] = { ...products[index], ...req.body };
    res.status(200).json({ message: "Product successfully updated" });
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});

// DELETE /products/:productId: Delete a product.
app.delete("/products/:productId", (req, res) => {
  const productId = parseInt(req.params.productId, 10);
  const index = products.findIndex((product) => {
    return product.productId === productId;
  });

  if (index !== -1) {
    products.splice(index, 1);
    res.status(200).json({ message: "Product successfully deleted" });
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});

//health check if online
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`Product Service running on port ${port}`);
});
