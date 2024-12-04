const express = require("express");
const { addExpense, getExpenses, analyzeSpending, scheduleSummary } = require("../controllers/expenses");

const router = express.Router();

// Routes
router.post("/expenses", addExpense); // Add expense
router.get("/expenses", getExpenses); // Get expenses
router.get("/expenses/analysis", analyzeSpending); // Analyze spending

module.exports = router;
