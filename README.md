# Expense Tracker PWA

A clean, offline-first **Expense Tracker Progressive Web App (PWA)** that helps users manage expenses and monthly budgets. The application stores data locally using **IndexedDB**, allowing expense data to remain available even when offline.

## ✨ Features

* 📊 Track total expenses and remaining monthly budget
* 💰 Set and update a monthly budget
* ➕ Add expenses with title, amount, date, and category
* ✏️ Edit existing expenses
* 🗑️ Delete expenses with an **Undo** option
* 🔎 Filter expenses by category
* 📈 Visualize spending with an interactive doughnut chart
* 📥 Export expense data as CSV
* 💾 Create JSON backups
* 📤 Import previously saved JSON backups
* 🔄 Reset all locally stored expense data
* 📴 Offline-first functionality using a Service Worker
* 📱 Installable as a Progressive Web App
* 🌙 Dark mode support
* 🔐 Demo login with a client-side session
* 💽 Persistent local storage using IndexedDB
* 📡 Network status indication
* 👋 First-time onboarding experience
* 🦴 Loading skeleton during application initialization
* ☁️ Basic architecture prepared for future cloud synchronization

## 🛠️ Tech Stack

### Frontend

* HTML5
* CSS3
* JavaScript (ES Modules)
* Chart.js
* IndexedDB
* Service Workers
* Web App Manifest

### Backend

* Python
* Flask

## 📁 Project Structure

```text
expense-tracker-pwa/
│
├── backend/
│   ├── app.py
│   ├── config.py
│   ├── database.py
│   ├── requirements.txt
│   └── test.py
│
├── frontend/
│   ├── css/
│   │   └── style.css
│   │
│   ├── icons/
│   │   ├── icon-192.png
│   │   └── icon-512.png
│   │
│   ├── js/
│   │   ├── chart.js
│   │   ├── db.js
│   │   ├── events.js
│   │   ├── main.js
│   │   ├── state.js
│   │   ├── sync.js
│   │   └── ui.js
│   │
│   ├── dashboard.html
│   ├── index.html
│   ├── login.html
│   ├── manifest.json
│   ├── offline.html
│   └── service-worker.js
│
├── .gitignore
├── .hintrc
└── README.md
```

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/S-Karthikeyan145/expense-tracker-pwa.git
```

### 2. Open the project

```bash
cd expense-tracker-pwa
```

### 3. Install backend dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 4. Run the backend

```bash
python app.py
```

## 📴 Offline-First Architecture

The application is designed with an offline-first approach.

### Service Worker

The Service Worker caches core application assets such as:

* HTML pages
* CSS files
* JavaScript modules
* PWA manifest
* Application icons

When a network request is unavailable, cached resources can be used to keep the application accessible.

### IndexedDB

Expense data and monthly budget information are stored locally using IndexedDB.

This allows the application to:

* Preserve expense data locally
* Continue working without an internet connection
* Restore data after reopening the application

## 📊 Expense Analytics

The application uses **Chart.js** to visualize expense totals grouped by category.

Supported categories include:

* 🍔 Food
* 🚕 Travel
* 🏠 Rent
* 🛍️ Shopping
* 💡 Utilities
* 📦 Other

## 💾 Data Backup

Users can create a local JSON backup containing:

* Expenses
* Monthly budget
* Backup metadata

The application can also import valid backup files and restore the saved data.

## 🔐 Authentication

The project includes a simple demo login flow using a client-side session.

> **Note:** This is a portfolio demonstration and does not store user credentials or provide production-grade authentication.

## 🔮 Future Improvements

Potential future enhancements include:

* Cloud synchronization
* User authentication with a backend
* Multi-device data synchronization
* Expense categories and custom labels
* Monthly spending reports
* Advanced analytics
* Recurring expenses
* Cloud backup and restore
* Backend API integration

## 👨‍💻 Author

**Karthikeyan Samala**

* GitHub: [S-Karthikeyan145](https://github.com/S-Karthikeyan145)
* LinkedIn: [Karthikeyan Samala](https://www.linkedin.com/in/karthikeyan-samala/)

---

⭐ If you found this project interesting, consider giving the repository a star.
