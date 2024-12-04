const fs = require("fs");
const path = require("path");

const expensesFilePath = path.join(__dirname, "../data/expenses.json");
const summaryFilePath = path.join(__dirname, "../data/summary.json");

function generateSummary(type) {
  const expenses = JSON.parse(fs.readFileSync(expensesFilePath, "utf8"));

  const summary = expenses.reduce((acc, exp) => {
    const period = new Date(exp.date).toISOString().slice(0, 10); // Daily summary key
    acc[period] = acc[period] || { total: 0 };
    acc[period].total += exp.amount;
    return acc;
  }, {});

  fs.writeFileSync(summaryFilePath, JSON.stringify({ type, summary }, null, 2));
  console.log(`Generated ${type} summary.`);
}

module.exports = { generateSummary };
