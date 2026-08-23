import { state } from "./state.js";
import { renderChart } from "./chart.js";

function renderExpenses(tableBody, category = "All") {
  console.log("renderExpenses called, expenses:", state.expenses);

  tableBody.innerHTML = "";

  if (state.expenses.length === 0) {
    const emptyRow = document.createElement("tr");
    emptyRow.innerHTML = `
      <td colspan="5" class="empty-state">
        📭 No expenses yet.<br>
        <span>Start by adding your first expense above.</span>
      </td>
    `;
    tableBody.appendChild(emptyRow);
    renderChart();
    return;
  }

  const filteredExpenses =
    category === "All"
      ? state.expenses
      : state.expenses.filter(exp => exp.category === category);

  filteredExpenses.forEach((exp, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${exp.title}</td>
      <td>₹${exp.amount}</td>
      <td>${exp.date}</td>
      <td>${exp.category}</td>
      <td>
        <button class="btn small edit-btn" data-index="${index}">Edit</button>
        <button class="btn small delete-btn" data-index="${index}">Delete</button>
      </td>
    `;


    tableBody.appendChild(row);
  });

  renderChart();
}

function updateSummary(totalSpentEl, budgetEl, remainingEl, warningEl) {
  const total = state.expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const remaining = state.monthlyBudget - total;

  totalSpentEl.innerText = `₹${total}`;
  budgetEl.innerText = `₹${state.monthlyBudget}`;
  remainingEl.innerText = `₹${remaining}`;

  remainingEl.classList.remove("over-budget");
  warningEl.innerText = "";

  if (state.monthlyBudget > 0 && remaining < 0) {
    remainingEl.classList.add("over-budget");
    warningEl.innerText = "⚠️ Budget exceeded!";
  }
}


export { renderExpenses, updateSummary };
