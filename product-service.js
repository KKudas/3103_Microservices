const express = require("express");
const app = express();
const port = 3001;

app.use(express.json());

let products = [];

// POST /products: Add a new product.
app.post("/products", (req, res) => {
  try {
    const data = req.body;
    products.push(data);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: "There was an error adding a new product" });
  }
});

// GET /products/:productId: Get product details by ID.
app.get("/products/:productId", (req, res) => {
  try {
    const productId = parseInt(req.params.productId, 10);
    const item = products.find((product) => product.productId === productId);

    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "There was an error fetching the product" });
  }
});

// PUT /products/:productId: Update a product.
app.put("/products/:productId", (req, res) => {
  try {
    const productId = parseInt(req.params.productId, 10);
    const index = products.findIndex((product) => {
      return product.productId === productId;
    });

    if (index !== -1) {
      products[index] = { ...products[index], ...req.body };
      res.status(200).json({ message: "Product successfully updated" });
    } else {
      res
        .status(500)
        .json({ error: "There was an error updating the product" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /products/:productId: Delete a product.
app.delete("/products/:productId", (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ error: "There was an error deleting the product" });
  }
});

app.listen(port, () => {
  console.log(`Product Service running on port ${port}`);
});
