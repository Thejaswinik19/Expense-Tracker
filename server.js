const express = require("express");
const bodyParser = require("body-parser");
const expenseRoutes = require("./routes/expenses");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// Routes
app.use("/api", expenseRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
