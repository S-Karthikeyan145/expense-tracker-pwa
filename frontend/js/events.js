import { state, saveData, clearDB } from "./state.js";
import { renderExpenses, updateSummary } from "./ui.js";

let undoTimeout = null;
let editingIndex = null;


function setupEvents(el) {

  if (state.dbError) {
    alert(
      "⚠️ Storage error detected.\n\n" +
      "Your browser blocked local storage.\n" +
      "The app is running in read-only mode."
    );

    el.addBtn.disabled = true;
    el.setBudgetBtn.disabled = true;
    el.resetDataBtn.disabled = true;
  }


  function toggleNetworkButtons() {
    const disabled = !navigator.onLine;

    el.exportCsvBtn.disabled = disabled;
    el.backupJsonBtn.disabled = disabled;
    el.importJsonBtn.disabled = disabled;
  }

  window.addEventListener("online", toggleNetworkButtons);
  window.addEventListener("offline", toggleNetworkButtons);

  toggleNetworkButtons();

  
  // ---------------- ADD EXPENSE ----------------
  el.addBtn.addEventListener("click", () => {
    const t = el.titleInput.value.trim();
    const a = Number(el.amountInput.value);
    const d = el.dateInput.value;
    const c = el.categoryInput.value;

    if (!t || !a || !d || !c) {
      alert("Fill all fields");
      return;
    }

    state.expenses.push({
      title: t,
      amount: a,
      date: d,
      category: c
    });

    saveData();

    renderExpenses(el.tableBody);
    updateSummary(
      el.totalSpentEl,
      el.budgetEl,
      el.remainingEl,
      el.warningEl
    );

    const today = new Date().toISOString().split("T")[0];
    el.titleInput.value = "";
    el.amountInput.value = "";
    el.dateInput.value = today;
    el.categoryInput.value = "";

  });

  // ---------------- SET BUDGET ----------------
  el.setBudgetBtn.addEventListener("click", () => {
    const v = Number(el.budgetInput.value);
    if (!v) {
      alert("Invalid budget");
      return;
    }

    state.monthlyBudget = v;
    saveData();
    updateSummary(
      el.totalSpentEl,
      el.budgetEl,
      el.remainingEl,
      el.warningEl
    );

    el.budgetInput.value = "";
  });

  // ---------------- TABLE ACTIONS ----------------
  el.tableBody.addEventListener("click", e => {
    const btn = e.target;
    const index = Number(btn.dataset.index);

    // DELETE
    if (btn.classList.contains("delete-btn")) {
      // editingIndex = null; //When you click Delete, we should exit edit mode first //{optional}

      state.lastDeletedExpense = state.expenses[index];
      state.lastDeletedIndex = index;

      state.expenses.splice(index, 1);
      saveData();
      renderExpenses(el.tableBody);
      updateSummary(el.totalSpentEl, el.budgetEl, el.remainingEl, el.warningEl);

      showUndo(el.undoContainer);
      return;
    }

    // EDIT
    if (btn.classList.contains("edit-btn")) {
      editingIndex = index;
      const row = el.tableBody.children[index];
      const exp = state.expenses[index];

      row.innerHTML = `
        <td>
          <input type="text" id="editTitle" value="${exp.title}">
        </td>
        <td>
          <input type="number" id="editAmount" value="${exp.amount}">
        </td>
        <td>
          <input type="date" id="editDate" value="${exp.date}">
        </td>
        <td>
          ${exp.category}
        </td>
        <td>
          <button class="btn small save-btn">Save</button>
          <button class="btn small ghost cancel-btn">Cancel</button>
        </td>
      `;

    }

    // SAVE
    if (btn.classList.contains("save-btn")) {
      const row = el.tableBody.children[editingIndex];

      const t = row.querySelector("#editTitle").value.trim();
      const a = Number(row.querySelector("#editAmount").value);
      const d = row.querySelector("#editDate").value;

      if (!t || !a || !d) return alert("Fill all fields");

      state.expenses[editingIndex] = {
        title: t,
        amount: a,
        date: d,
        category: state.expenses[editingIndex].category
      };
      saveData();
      editingIndex = null;

      renderExpenses(el.tableBody);
      updateSummary(el.totalSpentEl, el.budgetEl, el.remainingEl, el.warningEl);
    }

    // CANCEL
    if (btn.classList.contains("cancel-btn")) {
      editingIndex = null;
      renderExpenses(el.tableBody);
    }
  });


  // ---------------- UNDO ----------------
  el.undoBtn.addEventListener("click", () => {
    if (
      state.lastDeletedExpense !== null &&
      state.lastDeletedIndex !== null
    ) {
      state.expenses.splice(
        state.lastDeletedIndex,
        0,
        state.lastDeletedExpense
      );

      saveData();
      renderExpenses(el.tableBody);
      updateSummary(
        el.totalSpentEl,
        el.budgetEl,
        el.remainingEl,
        el.warningEl
      );
    }

    clearTimeout(undoTimeout);
    hideUndo(el.undoContainer);
  });

  // ---------------- CATEGORY FILTER ----------------
  el.categoryFilter.addEventListener("change", () => {
    renderExpenses(el.tableBody, el.categoryFilter.value);
  });

  // ---------------- EXPORT CSV ----------------
  el.exportCsvBtn.addEventListener("click", () => {
    exportToCSV(state.expenses);
  });

  // ---------------- BACKUP JSON ----------------
  el.backupJsonBtn.addEventListener("click", () => {
    backupToJSON();
  });

  // ---------------- IMPORT JSON ----------------
  el.importJsonBtn.addEventListener("click", () => {
    el.importJsonInput.click();
  });

  el.importJsonInput.addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;

    importFromJSON(file, el);
    e.target.value = ""; // reset input
  });

  // ---------------- RESET DATA ----------------
  el.resetDataBtn.addEventListener("click", () => {
    resetAllData(el);
  });


}

// ---------------- UNDO HELPERS ----------------
function showUndo(container) {
  container.classList.remove("hidden");

  clearTimeout(undoTimeout);
  undoTimeout = setTimeout(() => {
    hideUndo(container);
  }, 5000);
}

function hideUndo(container) {
  container.classList.add("hidden");
  state.lastDeletedExpense = null;
  state.lastDeletedIndex = null;
}



// ---------------- CSV EXPORT ----------------
function exportToCSV(expenses) {
  if (!expenses.length) {
    alert("No expenses to export");
    return;
  }

  const headers = ["Title", "Amount", "Date", "Category"];

  const rows = expenses.map(exp => [
    exp.title,
    exp.amount,
    exp.date,
    exp.category
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map(row => row.join(","))
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "expenses.csv";
  link.click();

  URL.revokeObjectURL(url);
}

// ---------------- JSON BACKUP ----------------
function backupToJSON() {
  const backupData = {
    version: "1.0",
    createdAt: new Date().toISOString(),
    data: {
      expenses: state.expenses,
      monthlyBudget: state.monthlyBudget
    }
  };

  const blob = new Blob(
    [JSON.stringify(backupData, null, 2)],
    { type: "application/json" }
  );

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "expense-backup.json";
  link.click();

  URL.revokeObjectURL(url);
}


// ---------------- JSON IMPORT ----------------
function importFromJSON(file, el) {
  const reader = new FileReader();

  reader.onload = e => {
    try {
      const parsed = JSON.parse(e.target.result);

      // ---------- BASIC VALIDATION ----------
      if (
        !parsed ||
        !parsed.data ||
        !Array.isArray(parsed.data.expenses) ||
        typeof parsed.data.monthlyBudget !== "number"
      ) {
        alert("Invalid backup file");
        return;
      }

      const confirmOverwrite = confirm(
        "This will overwrite your current data.\n\nContinue?"
      );

      if (!confirmOverwrite) return;

      // ---------- APPLY DATA ----------
      state.expenses = parsed.data.expenses;
      state.monthlyBudget = parsed.data.monthlyBudget;

      saveData();

      // ---------- REFRESH UI ----------
      renderExpenses(el.tableBody);
      updateSummary(
        el.totalSpentEl,
        el.budgetEl,
        el.remainingEl,
        el.warningEl
      );

      alert("✅ Data imported successfully");
    } catch (err) {
      alert("Failed to read JSON file");
      console.error(err);
    }
  };

  reader.readAsText(file);
}

// ---------------- RESET ALL DATA ----------------
async function resetAllData(el) {
  const confirmReset = confirm(
    "⚠️ This will permanently delete ALL expenses and budget data.\n\nThis action cannot be undone.\n\nDo you want to continue?"
  );

  if (!confirmReset) return;

  // Clear IndexedDB
  await clearDB();

  // Reset memory
  state.expenses = [];
  state.monthlyBudget = 0;
  state.lastDeletedExpense = null;
  state.lastDeletedIndex = null;

  // Refresh UI
  renderExpenses(el.tableBody);
  updateSummary(
    el.totalSpentEl,
    el.budgetEl,
    el.remainingEl,
    el.warningEl
  );

  alert("✅ All data has been reset safely");
}



export { setupEvents };
