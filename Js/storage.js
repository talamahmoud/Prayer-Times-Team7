const STORAGE_KEY = "prayer-times-app";

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    console.error("Failed to save to localStorage");
  }
}

function clearState() {
  localStorage.removeItem(STORAGE_KEY);
}

export function getSelection() {
  return loadState();
}

export function setSelection({
  continent,
  country,
  city,
  method,
  adhan,
  timeFormat,
}) {
  const current = loadState();
  const newState = {
    ...current,
    ...(continent !== undefined && { continent }),
    ...(country !== undefined && { country }),
    ...(city !== undefined && { city }),
    ...(method !== undefined && { method }),
    ...(adhan !== undefined && { adhan }),
    ...(timeFormat !== undefined && { timeFormat }),
  };

  saveState(newState);
}

export function resetSelection() {
  clearState();
}
