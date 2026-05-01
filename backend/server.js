const express = require("express");

const app = express();
const PORT = 4000;
const cors = require("cors");
const fs = require("fs");

app.use(cors());

// lets Express read JSON from POST requests
app.use(express.json());

// temporary in-memory data storage
let inventory = [
  {
    id: 1,
    name: "Arduino Kit",
    category: "Hardware",
    quantity: 5,
    status: "Available"
  },
  {
    id: 2,
    name: "Figma License",
    category: "Software",
    quantity: 20,
    status: "Available"
  }
];

// GET /inventory = return all items
app.get("/inventory", (req, res) => {
  res.json(inventory);
});

app.get("/export-csv", (req, res) => {
  // Step 1: CSV header
  let csv = "id,name,category,quantity,status\n";

  // Step 2: loop through inventory
  inventory.forEach((item) => {
    csv += `${item.id},${item.name},${item.category},${item.quantity},${item.status}\n`;
  });

  // Step 3: write file
  fs.writeFileSync("../analysis/inventory.csv", csv);

  // Step 4: respond
  res.send("CSV exported!");
});

// POST /inventory = add a new item
app.post("/inventory", (req, res) => {
  const { name, category, quantity, status } = req.body;

  const newItem = {
    id: inventory.length + 1,
    name,
    category,
    quantity,
    status,
  };

  inventory.push(newItem);

  res.json({ message: "item added successfully" });
});

app.get("/test", (req, res) => {
  res.send("Updated server file is running");
});

// start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});