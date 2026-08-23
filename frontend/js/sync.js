// ================= CLOUD SYNC PLACEHOLDER =================

// This file will later handle:
// - Uploading local data to cloud
// - Resolving conflicts
// - Pulling remote updates

async function pushToCloud(payload) {
  // Placeholder — no backend yet
  console.log("☁️ pushToCloud called", payload);
  return true;
}

async function pullFromCloud() {
  // Placeholder
  console.log("☁️ pullFromCloud called");
  return null;
}

export {
  pushToCloud,
  pullFromCloud
};
