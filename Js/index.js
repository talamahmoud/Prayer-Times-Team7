import { fetchCountriesByContinent, fetchCitiesByCountry, fetchCalculationMethods } from "./api.js";
import { getSelection, setSelection, resetSelection } from "./storage.js";
// DOM elements
const continentSelect = document.getElementById("continent");
const countrySelect = document.getElementById("country");
const citySelect = document.getElementById("city");
const methodSelect = document.getElementById("method");

// loading
function setLoading(select, text = "Loading…") {
  select.innerHTML = `<option value="">${text}</option>`;
  select.disabled = true;
}

function setOptions(select, items, placeholder) {
  select.innerHTML = `<option value="">${placeholder}</option>`;
  items.forEach(item => {
    if (typeof item === "string") {
      select.innerHTML += `<option value="${item}">${item}</option>`;
    } else {
      select.innerHTML += `<option value="${item.name}">${item.name}</option>`;
    }
  });
  select.disabled = false;
}

async function initMethods(selectedMethod) {
  try {
    setLoading(methodSelect, "Loading methods…");
    const methods = await fetchCalculationMethods();
    const methodArray = Object.entries(methods).map(([id, m]) => ({
      id,
      name: m.name
    }));
    setOptions(methodSelect, methodArray, "Select Method");
    if (selectedMethod) methodSelect.value = selectedMethod;
  } catch (err) {
    methodSelect.innerHTML = `<option value="">Error loading methods</option>`;
  }
}

// When continent changes → load countries
continentSelect.addEventListener("change", async e => {
  const continent = e.target.value;
  setSelection({ continent, country: "", city: "" });

  if (!continent) return;

  try {
    setLoading(countrySelect, "Loading countries…");
    setOptions(citySelect, [], "Select a country first");
    const countries = await fetchCountriesByContinent(continent);
    setOptions(countrySelect, countries, "Select Country");
  } catch (err) {
    countrySelect.innerHTML = `<option value="">Error loading countries</option>`;
  }
});

//  When country changes → load cities
countrySelect.addEventListener("change", async e => {
  const country = e.target.value;
  setSelection({ country, city: "" });

  if (!country) return;

  try {
    setLoading(citySelect, "Loading cities…");
    const cities = await fetchCitiesByCountry(country);
    setOptions(citySelect, cities, "Select City");
  } catch (err) {
    citySelect.innerHTML = `<option value="">Error loading cities</option>`;
  }
});

//  When city changes
citySelect.addEventListener("change", e => {
  setSelection({ city: e.target.value });
});

//  When method changes
methodSelect.addEventListener("change", e => {
  setSelection({ method: e.target.value });
});

//  Init 
async function init() {
  const saved = getSelection();
  if (saved.continent) {
    continentSelect.value = saved.continent;
    try {
      const countries = await fetchCountriesByContinent(saved.continent);
      setOptions(countrySelect, countries, "Select Country");
      if (saved.country) {
        countrySelect.value = saved.country;
        const cities = await fetchCitiesByCountry(saved.country);
        setOptions(citySelect, cities, "Select City");
        if (saved.city) {
          citySelect.value = saved.city;
        }
      }
    } catch {}
  }
  await initMethods(saved.method);
}

init();
