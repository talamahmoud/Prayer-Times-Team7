import {
  RESTCOUNTRIES_BASE,
  COUNTRIESNOW_CITIES,
  ALADHAN_BASE,
  ALADHAN_TIME,
} from "./config.js";
import { handleFetch } from "./utils.js";
import { ERROR_MESSAGES, logError } from "./errors.js";

const cityCache = new Map();

export async function fetchCountriesByContinent(continent) {
  if (!continent) return { error: true, message: ERROR_MESSAGES.COUNTRIES };

  try {
    const url = `${RESTCOUNTRIES_BASE}/${encodeURIComponent(continent)}`;
    const data = await handleFetch(url, {}, ERROR_MESSAGES.COUNTRIES);
    if (data.error) return { error: true, message: ERROR_MESSAGES.COUNTRIES };

    return data
      .map((c) => ({ name: c.name.common, code: c.cca2 }))
      .sort((a, b) => a.name.localeCompare(b.name));
  } catch (err) {
    logError("fetchCountriesByContinent", err);
    return { error: true, message: ERROR_MESSAGES.UNKNOWN };
  }
}

export async function fetchCitiesByCountry(country) {
  if (!country) return { error: true, message: ERROR_MESSAGES.CITIES };

  if (cityCache.has(country)) {
    return cityCache.get(country);
  }

  try {
    const json = await handleFetch(
      COUNTRIESNOW_CITIES,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country }),
      },
      ERROR_MESSAGES.CITIES
    );

    if (json.error || !json.data) {
      return { error: true, message: ERROR_MESSAGES.CITIES };
    }

    const cities = Array.from(new Set(json.data)).sort((a, b) =>
      a.localeCompare(b)
    );
    cityCache.set(country, cities);
    return cities;
  } catch (err) {
    logError("fetchCitiesByCountry", err);
    return { error: true, message: ERROR_MESSAGES.UNKNOWN };
  }
}

export async function fetchCalculationMethods() {
  try {
    const json = await handleFetch(
      `${ALADHAN_BASE}/methods`,
      {},
      ERROR_MESSAGES.METHODS
    );
    if (json.error) return { error: true, message: ERROR_MESSAGES.METHODS };
    return json.data || {};
  } catch (err) {
    logError("fetchCalculationMethods", err);
    return { error: true, message: ERROR_MESSAGES.UNKNOWN };
  }
}

export async function fetchAdhanTimeWithMethod(city, method) {
  const today = new Date();
  const formatted = today.toLocaleDateString("en-US").replaceAll("/", "-");

  try {
    const json = await handleFetch(
      `${ALADHAN_TIME}/${formatted}?address=${city}&method=${method}`,
      {},
      ERROR_MESSAGES.PRAYER_TIMES
    );

    if (json.error || !json.data) {
      return { error: true, message: ERROR_MESSAGES.PRAYER_TIMES };
    }

    return json.data;
  } catch (err) {
    logError("fetchAdhanTimeWithMethod", err);
    return { error: true, message: ERROR_MESSAGES.UNKNOWN };
  }
}
