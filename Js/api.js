import {
  RESTCOUNTRIES_BASE,
  COUNTRIESNOW_CITIES,
  ALADHAN_BASE,
  ALADHAN_TIME,
} from "./config.js";
import { handleFetch } from "./utils.js";

const cityCache = new Map();

export async function fetchCountriesByContinent(continent) {
  if (!continent) throw new Error("Missing continent");
  const url = `${RESTCOUNTRIES_BASE}/${encodeURIComponent(continent)}`;
  const data = await handleFetch(url, {}, "Failed to load countries");
  return data
    .map((c) => ({ name: c.name.common, code: c.cca2 }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function fetchCitiesByCountry(country) {
  if (!country) throw new Error("Missing country");

  if (cityCache.has(country)) {
    return cityCache.get(country);
  }

  const json = await handleFetch(
    COUNTRIESNOW_CITIES,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country }),
    },
    "Failed to load cities"
  );

  if (!json.data) throw new Error("No cities found");

  const cities = Array.from(new Set(json.data)).sort((a, b) =>
    a.localeCompare(b)
  );
  cityCache.set(country, cities);
  return cities;
}

export async function fetchCalculationMethods() {
  const json = await handleFetch(
    `${ALADHAN_BASE}/methods`,
    {},
    "Failed to load methods"
  );
  return json.data || {};
}

export async function fetchAdhanTimeWithMethod(city, method) {
  const today = new Date();
  const formatted = today.toLocaleDateString("en-US").replaceAll("/", "-");

  const json = await handleFetch(
    `${ALADHAN_TIME}/${formatted}?address=${city}&method=${method}`,
    {},
    "Failed to load the Adhan Time"
  );
  if (!json.data) throw new Error("No cities found");

  return json.data;
}
