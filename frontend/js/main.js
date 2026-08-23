// ================= AUTH GUARD =================
const isLoggedIn = localStorage.getItem("auth_session");

if (!isLoggedIn) {
  // Prevent unauthenticated access
  if (!window.location.pathname.endsWith("login.html")) {
    window.location.replace("login.html");
  }
}


if (!navigator.onLine) {
  console.log("📴 App started offline");
}


// ================= IMPORTS (MUST BE FIRST) =================
import { loadData } from "./state.js";
import { renderExpenses, updateSummary } from "./ui.js";
import { setupEvents } from "./events.js";

// ================= PWA INSTALL =================
let deferredPrompt = null;

const installBtn = document.getElementById("installBtn");

if (installBtn) {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.classList.remove("hidden");
  });

  installBtn.addEventListener("click", async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;

    if (choice.outcome === "accepted") {
      console.log("✅ PWA installed");
    }

    deferredPrompt = null;
    installBtn.classList.add("hidden");
  });
}

// ================= APP INIT =================
const el = {
  titleInput: document.getElementById("expenseTitle"),
  amountInput: document.getElementById("expenseAmount"),
  dateInput: document.getElementById("expenseDate"),
  addBtn: document.getElementById("addExpenseBtn"),
  tableBody: document.getElementById("expenseTableBody"),
  categoryInput: document.getElementById("expenseCategory"),

  totalSpentEl: document.getElementById("totalSpent"),
  budgetEl: document.getElementById("monthlyBudget"),
  remainingEl: document.getElementById("remainingAmount"),
  warningEl: document.getElementById("budgetWarning"),
  budgetInput: document.getElementById("budgetInput"),
  setBudgetBtn: document.getElementById("setBudgetBtn"),
  undoBtn: document.getElementById("undoBtn"),
  undoContainer: document.getElementById("undoContainer"),
  categoryFilter: document.getElementById("categoryFilter"),
  exportCsvBtn: document.getElementById("exportCsvBtn"),
  backupJsonBtn: document.getElementById("backupJsonBtn"),
  importJsonBtn: document.getElementById("importJsonBtn"),
  importJsonInput: document.getElementById("importJsonInput"),
  resetDataBtn: document.getElementById("resetDataBtn")

};

// ================= APP START =================
window.addEventListener("DOMContentLoaded", async () => {
  const skeleton = document.getElementById("skeletonLoader");

  await loadData();

    if (window.state?.dbError) {
      const banner = document.getElementById("dbErrorBanner");
      if (banner) banner.classList.remove("hidden");
    }

  renderExpenses(el.tableBody);
  updateSummary(
    el.totalSpentEl,
    el.budgetEl,
    el.remainingEl,
    el.warningEl
  );

  setupEvents(el);

  // Remove skeleton after UI is ready
  if (skeleton) skeleton.remove();
});

// ================= LOGOUT =================
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("auth_session");

    // Clear history entry
    window.location.replace("login.html");
  });
}




// ================= AUTO DATE =================
const today = new Date().toISOString().split("T")[0];
if (el.dateInput && !el.dateInput.value) {
  el.dateInput.value = today;
}


// ================= THEME TOGGLE =================
const themeToggle = document.getElementById("themeToggle");

if (themeToggle && localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  themeToggle.textContent = "☀️";
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    themeToggle.textContent = isDark ? "☀️" : "🌙";
  });
}

// ================= SERVICE WORKER =================
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/frontend/service-worker.js")
    .then(() => console.log("✅ Service Worker registered"))
    .catch(err => console.error("❌ SW failed", err));
}


// ================= NETWORK STATUS =================
const networkBanner = document.getElementById("networkStatus");

function updateNetworkStatus() {
  if (!networkBanner) return;

  if (navigator.onLine) {
    networkBanner.classList.add("hidden");
  } else {
    networkBanner.classList.remove("hidden");
  }
}

window.addEventListener("online", updateNetworkStatus);
window.addEventListener("offline", updateNetworkStatus);

// Initial check
updateNetworkStatus();


// ================= ONBOARDING =================
const onboarding = document.getElementById("onboardingHint");
const dismissBtn = document.getElementById("dismissOnboarding");

const HAS_SEEN_ONBOARDING = "expense_onboarding_seen";

if (onboarding && !localStorage.getItem(HAS_SEEN_ONBOARDING)) {
  onboarding.classList.remove("hidden");
}

if (dismissBtn) {
  dismissBtn.addEventListener("click", () => {
    localStorage.setItem(HAS_SEEN_ONBOARDING, "true");
    onboarding.classList.add("hidden");
  });
}


// ================= BACKGROUND SYNC REQUEST =================
window.addEventListener("online", async () => {
  if (
    "serviceWorker" in navigator &&
    "SyncManager" in window &&
    localStorage.getItem("pending_sync") === "true"
  ) {
    try {
      const reg = await navigator.serviceWorker.ready;
      await reg.sync.register("expense-sync");
      console.log("📡 Background sync registered");
    } catch (err) {
      console.warn("Background sync failed", err);
    }
  }
});
