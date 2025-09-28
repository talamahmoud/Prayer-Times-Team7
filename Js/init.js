import {
  fetchCountriesByContinent,
  fetchCitiesByCountry,
  fetchCalculationMethods,
} from "./api.js";
import { getSelection } from "./storage.js";
import { clearOptions, setLoading, setOptions } from "./dom-utils.js";
import { setAdhan } from "./prayer.js";

export async function init({
  continentSelect,
  countrySelect,
  citySelect,
  methodSelect,
  prayerTableBody,
  nextPrayerSection,
  nextPrayerEl,
  nextPrayerNameEl,
  nextPrayerDayEl,
  typeCheckBtn,
}) {
  const saved = getSelection();
  if (saved.continent) {
    continentSelect.value = saved.continent;
    const countries = await fetchCountriesByContinent(saved.continent);
    if (!countries.error) {
      setOptions(countrySelect, countries, "Select Country");
      if (saved.country) {
        countrySelect.value = saved.country;
        const cities = await fetchCitiesByCountry(saved.country);
        if (!cities.error) {
          setOptions(citySelect, cities, "Select City");
          if (saved.city) {
            citySelect.value = saved.city;
          }
        }
      }
    }
  }
  await initMethods(methodSelect, saved.method);

  if (saved.timeFormat !== undefined) {
    typeCheckBtn.checked = saved.timeFormat;
  }

  if (saved.adhan && Array.isArray(saved.adhan)) {
    setAdhan(
      saved.adhan,
      saved.timeFormat,
      prayerTableBody,
      nextPrayerSection,
      nextPrayerEl,
      nextPrayerNameEl,
      nextPrayerDayEl,
      typeCheckBtn
    );
  }
}

async function initMethods(methodSelect, selectedMethod) {
  setLoading(methodSelect, "Loading methods…");
  const methods = await fetchCalculationMethods();
  const methodArray = Object.entries(methods).map(([id, m]) => ({
    id: m.id,
    name: m.name,
  }));

  clearOptions(methodSelect);
  const placeholderOpt = document.createElement("option");
  placeholderOpt.value = "";
  placeholderOpt.textContent = "Select Method";
  methodSelect.appendChild(placeholderOpt);

  methodArray.forEach((m) => {
    const opt = document.createElement("option");
    opt.value = m.id;
    opt.textContent = m.name;
    methodSelect.appendChild(opt);
  });

  if (selectedMethod) methodSelect.value = selectedMethod;
  methodSelect.disabled = false;
}
