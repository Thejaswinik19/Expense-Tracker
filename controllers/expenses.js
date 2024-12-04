const fs = require("fs");
const path = require("path");
const schedule = require("node-schedule");
const { generateSummary } = require("../utils/report");

const expensesFilePath = path.join(__dirname, "../data/expenses.json");

// Load or initialize mock database
function loadExpenses() {
  if (!fs.existsSync(expensesFilePath)) fs.writeFileSync(expensesFilePath, "[]");
  return JSON.parse(fs.readFileSync(expensesFilePath, "utf8"));
}

function saveExpenses(data) {
  fs.writeFileSync(expensesFilePath, JSON.stringify(data, null, 2));
}

// Controller Functions

// Add Expense
exports.addExpense = (req, res) => {
  const { category, amount, date } = req.body;

  // Validation
  const predefinedCategories = ["Food", "Travel", "Utilities", "Entertainment"];
  if (!predefinedCategories.includes(category)) {
    return res.status(400).json({ status: "error", error: "Invalid category" });
  }
  if (amount <= 0) {
    return res.status(400).json({ status: "error", error: "Amount must be positive" });
  }

  const expenses = loadExpenses();
  const newExpense = { id: Date.now(), category, amount, date: date || new Date().toISOString() };
  expenses.push(newExpense);

  saveExpenses(expenses);
  res.json({ status: "success", data: newExpense });
};

// Get Expenses
exports.getExpenses = (req, res) => {
  const { category, startDate, endDate } = req.query;
  let expenses = loadExpenses();

  // Filtering
  if (category) expenses = expenses.filter((exp) => exp.category === category);
  if (startDate)
    expenses = expenses.filter((exp) => new Date(exp.date) >= new Date(startDate));
  if (endDate) expenses = expenses.filter((exp) => new Date(exp.date) <= new Date(endDate));

  res.json({ status: "success", data: expenses });
};

// Analyze Spending
exports.analyzeSpending = (req, res) => {
  const expenses = loadExpenses();

  const analysis = expenses.reduce(
    (acc, exp) => {
      acc.total += exp.amount;
      acc.categoryTotals[exp.category] = (acc.categoryTotals[exp.category] || 0) + exp.amount;
      return acc;
    },
    { total: 0, categoryTotals: {} }
  );

  const highestCategory = Object.entries(analysis.categoryTotals).reduce((max, curr) =>
    curr[1] > max[1] ? curr : max
  );

  res.json({
    status: "success",
    data: { totalSpent: analysis.total, highestSpendingCategory: highestCategory },
  });
};

// Schedule Summary Reports
schedule.scheduleJob("0 0 * * *", () => generateSummary("daily"));
schedule.scheduleJob("0 0 * * 0", () => generateSummary("weekly"));
schedule.scheduleJob("0 0 1 * *", () => generateSummary("monthly"));
