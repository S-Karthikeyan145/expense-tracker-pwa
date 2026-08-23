import { saveToDB, loadFromDB, clearDB } from "./db.js";

const APP_VERSION = 1;
const SYNC_FLAG = "pending_sync";


// ---------- GLOBAL APP STATE ----------
const state = {
  expenses: [],
  monthlyBudget: 0,

  lastDeletedExpense: null,
  lastDeletedIndex: null,

  dbError: false
};

// ---------- SAVE ----------
async function saveData() {
  await saveToDB("expenses", state.expenses);
  await saveToDB("monthlyBudget", state.monthlyBudget);
  await saveToDB("appVersion", APP_VERSION);

  // Mark pending sync (future cloud support)
  localStorage.setItem(SYNC_FLAG, "true");
}


// ---------- LOAD ----------
async function loadData() {
  try {
    const savedExpenses = await loadFromDB("expenses");
    const savedBudget = await loadFromDB("monthlyBudget");
    const savedVersion = await loadFromDB("appVersion");

    if (savedVersion !== APP_VERSION) {
      console.warn("🔁 App version changed, migration needed");
      // migration hook (future)
      await saveToDB("appVersion", APP_VERSION);
    }


    if (Array.isArray(savedExpenses)) {
      state.expenses = savedExpenses;
    }

    if (typeof savedBudget === "number") {
      state.monthlyBudget = savedBudget;
    }
  } catch (err) {
    console.error("❌ IndexedDB load failed", err);
    state.dbError = true;
  }
}


export {
  state,
  saveData,
  loadData,
  clearDB
};
