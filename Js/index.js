import { fetchCountriesByContinent, fetchCitiesByCountry, fetchCalculationMethods } from "./api.js";
import { getSelection, setSelection, resetSelection } from "./storage.js";

// DOM elements
const continentSelect = document.getElementById("continent");
const countrySelect = document.getElementById("country");
const citySelect = document.getElementById("city");
const methodSelect = document.getElementById("method");
const resetBtn = document.getElementById("resetBtn");

function clearOptions(select) {
  while (select.firstChild) {
    select.removeChild(select.firstChild);
  }
}

// loading
function setLoading(select, text = "Loading…") {
  clearOptions(select);
  const opt = document.createElement("option");
  opt.value = "";
  opt.textContent = text;
  select.appendChild(opt);
  select.disabled = true;
}

function setOptions(select, items, placeholder) {
  clearOptions(select);

  const placeholderOpt = document.createElement("option");
  placeholderOpt.value = "";
  placeholderOpt.textContent = placeholder;
  select.appendChild(placeholderOpt);

  items.forEach(item => {
    const opt = document.createElement("option");
    if (typeof item === "string") {
      opt.value = item;
      opt.textContent = item;
    } else {
      opt.value = item.name;
      opt.textContent = item.name;
    }
    select.appendChild(opt);
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

    clearOptions(methodSelect);
    const placeholderOpt = document.createElement("option");
    placeholderOpt.value = "";
    placeholderOpt.textContent = "Select Method";
    methodSelect.appendChild(placeholderOpt);

    methodArray.forEach(m => {
      const opt = document.createElement("option");
      opt.value = m.id;
      opt.textContent = m.name;
      methodSelect.appendChild(opt);
    });

    if (selectedMethod) methodSelect.value = selectedMethod;
    methodSelect.disabled = false;
  } catch (err) {
    clearOptions(methodSelect);
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = "Error loading methods";
    methodSelect.appendChild(opt);
  }
}

// When continent changes 
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
    clearOptions(countrySelect);
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = "Error loading countries";
    countrySelect.appendChild(opt);
  }
});

//  When country changes
countrySelect.addEventListener("change", async e => {
  const country = e.target.value;
  setSelection({ country, city: "" });

  if (!country) return;

  try {
    setLoading(citySelect, "Loading cities…");
    const cities = await fetchCitiesByCountry(country);
    setOptions(citySelect, cities, "Select City");
  } catch (err) {
    clearOptions(citySelect);
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = "Error loading cities";
    citySelect.appendChild(opt);
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

// Reset button
resetBtn.addEventListener("click", () => {
  resetSelection();
  continentSelect.value = "";

  clearOptions(countrySelect);
  const optCountry = document.createElement("option");
  optCountry.value = "";
  optCountry.textContent = "Select a continent first";
  countrySelect.appendChild(optCountry);

  clearOptions(citySelect);
  const optCity = document.createElement("option");
  optCity.value = "";
  optCity.textContent = "Select a country first";
  citySelect.appendChild(optCity);

  methodSelect.value = "";
});

init();
