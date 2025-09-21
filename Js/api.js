import { RESTCOUNTRIES_BASE, COUNTRIESNOW_CITIES, ALADHAN_BASE } from './config.js';

const cityCache = new Map(); 

export async function fetchCountriesByContinent(continent) {
  if (!continent) throw new Error("Missing continent");
  const url = `${RESTCOUNTRIES_BASE}/${encodeURIComponent(continent)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to load countries");
  const data = await res.json();
  return data
    .map(c => ({ name: c.name.common, code: c.cca2 }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function fetchCitiesByCountry(country) {
  if (!country) throw new Error("Missing country");

  if (cityCache.has(country)) {
    return cityCache.get(country);
  }

  const res = await fetch(COUNTRIESNOW_CITIES, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ country })
  });

  if (!res.ok) throw new Error("Failed to load cities");
  const json = await res.json();
  if (!json.data) throw new Error("No cities found");

  const cities = Array.from(new Set(json.data)).sort((a, b) =>
    a.localeCompare(b)
  );
  cityCache.set(country, cities);
  return cities;
}

export async function fetchCalculationMethods() {
  const res = await fetch(`${ALADHAN_BASE}/methods`);
  if (!res.ok) throw new Error("Failed to load methods");
  const json = await res.json();
  return json.data || {};
}
