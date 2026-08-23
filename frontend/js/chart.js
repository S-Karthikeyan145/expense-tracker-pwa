import { state } from "./state.js";

let chart = null;

function renderChart() {
  const canvas = document.getElementById("expenseChart");
  if (!canvas) return;

  // ---------- GROUP EXPENSES BY CATEGORY ----------
  const categoryTotals = {};

  state.expenses.forEach(exp => {
    if (!categoryTotals[exp.category]) {
      categoryTotals[exp.category] = 0;
    }
    categoryTotals[exp.category] += exp.amount;
  });

  const labels = Object.keys(categoryTotals);
  const values = Object.values(categoryTotals);

  // ---------- DESTROY OLD CHART ----------
  if (chart) chart.destroy();

  // ---------- EMPTY STATE ----------
  if (labels.length === 0) return;

  // ---------- CREATE DOUGHNUT CHART ----------
  chart = new Chart(canvas, {
    type: "doughnut",
    data: {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: [
            "#6366f1", // Food
            "#22c55e", // Travel
            "#f97316", // Rent
            "#ec4899", // Shopping
            "#eab308", // Utilities
            "#64748b"  // Other
          ]
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false, // 🔥 THIS IS IMPORTANT
      plugins: {
        legend: {
          position: "bottom"
        }
      }
    }
  });
}

export { renderChart };
