
export const ERROR_MESSAGES = {
  NETWORK: "Network error. Please check your internet connection 🌐.",
  COUNTRIES: " Failed to load countries ❌.",
  CITIES: " Failed to load cities ❌.",
  METHODS: " Failed to load calculation methods ⚠️.",
  PRAYER_TIMES: " Failed to fetch prayer times ⚠️.",
  UNKNOWN: " Something went wrong. Please try again later ⚠️.",
};

export function showErrorInTable(el, msg) {
  if (!el) return;
  el.innerHTML = `
    <tr>
      <td colspan="2" class="error-cell">${msg}</td>
    </tr>
  `;
}

export function showBanner(msg) {
  const banner = document.createElement("div");
  banner.textContent = msg;
  banner.className = "error-banner";
  document.body.prepend(banner);

  setTimeout(() => banner.remove(), 5000);
}

export function logError(source, err) {
  console.error(`[${source}]`, err);
}
