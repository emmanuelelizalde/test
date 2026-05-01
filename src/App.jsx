import { useEffect, useState } from "react";

function InventoryDashboard() {
  const [inventory, setInventory] = useState([]);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [status, setStatus] = useState("");

  const auditEvents = [
    {
      scene_id: "arduino_kit_01",
      item: "Arduino Kit",
      event_type: "VERIFIED",
      confidence: 0.94,
      recommended_action: "No action needed",
    },
    {
      scene_id: "usb_cable_01",
      item: "USB Cable",
      event_type: "UNCERTAIN",
      confidence: 0.72,
      recommended_action: "Manual review required",
    },
    {
      scene_id: "figma_license_01",
      item: "Figma License",
      event_type: "DISCREPANCY",
      confidence: 0.91,
      recommended_action: "Review inventory record",
    },
  ];

  function fetchInventory() {
    fetch("http://localhost:4000/inventory")
      .then((res) => res.json())
      .then((data) => setInventory(data))
      .catch((error) => console.error("Fetch error:", error));
  }

  useEffect(() => {
    fetchInventory();
  }, []);

  function handleSubmit(e) {
    e.preventDefault();

    fetch("http://localhost:4000/inventory", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        category,
        quantity: Number(quantity),
        status,
      }),
    })
      .then(() => {
        setName("");
        setCategory("");
        setQuantity("");
        setStatus("");

        fetchInventory();
      })
      .catch((error) => console.error("Post error:", error));
  }

  const totalItems = inventory.reduce(
    (sum, item) => sum + Number(item.quantity),
    0
  );

  const lowStockItems = inventory.filter((item) => Number(item.quantity) < 5);

  const itemsByCategory = inventory.reduce((groups, item) => {
    groups[item.category] =
      (groups[item.category] || 0) + Number(item.quantity);

    return groups;
  }, {});

  return (
    <div>
      <h1>Inventory Dashboard</h1>

      <section>
        <h2>Add Inventory Item</h2>

        <form onSubmit={handleSubmit}>
          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <input
            placeholder="Quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />

          <input
            placeholder="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          />

          <button type="submit">Add Item</button>
        </form>
      </section>

      <section>
        <h2>Inventory Summary</h2>

        <p>Total Items: {totalItems}</p>
        <p>Low Stock Items: {lowStockItems.length}</p>

        <h3>Items by Category</h3>

        <ul>
          {Object.entries(itemsByCategory).map(([category, count]) => (
            <li key={category}>
              {category}: {count}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Declared Inventory</h2>

        <table border="1">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {inventory.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>{item.quantity}</td>
                <td>{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2>Observed Inventory / Shelf Analysis</h2>

        <table border="1">
          <thead>
            <tr>
              <th>Scene</th>
              <th>Item</th>
              <th>ML Status</th>
              <th>Confidence</th>
              <th>Recommended Action</th>
            </tr>
          </thead>

          <tbody>
            {auditEvents.map((event, index) => (
              <tr key={index}>
                <td>{event.scene_id}</td>
                <td>{event.item}</td>
                <td>{event.event_type}</td>
                <td>{event.confidence}</td>
                <td>{event.recommended_action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default function App() {
  return <InventoryDashboard />;
}