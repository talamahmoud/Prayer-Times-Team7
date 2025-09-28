import {
  fetchCountriesByContinent,
  fetchCitiesByCountry,
  fetchAdhanTimeWithMethod,
} from "./api.js";
import { getSelection, setSelection, resetSelection } from "./storage.js";
import {
  clearOptions,
  setOptions,
  showLoading,
  hideLoading,
} from "./dom-utils.js";
import { setAdhan } from "./prayer.js";
import { ERROR_MESSAGES, showErrorInTable, showBanner } from "./errors.js";

export function registerEventListeners({
  continentSelect,
  countrySelect,
  citySelect,
  methodSelect,
  resetBtn,
  typeCheckBtn,
  prayerTableBody,
  nextPrayerSection,
  nextPrayerEl,
  nextPrayerNameEl,
  nextPrayerDayEl,
}) {
  const loadingEl = document.getElementById("loading");

  const initialTableMessage = prayerTableBody.innerHTML;

  function showSelectLoading(select) {
    const wrapper = select.closest(".select-wrapper");
    if (!wrapper) return;
    wrapper.classList.add("loading");
    const spinner = wrapper.querySelector(".select-spinner");
    if (spinner) spinner.style.display = "block";
    select.disabled = true;
  }

  function hideSelectLoading(select) {
    const wrapper = select.closest(".select-wrapper");
    if (!wrapper) return;
    wrapper.classList.remove("loading");
    const spinner = wrapper.querySelector(".select-spinner");
    if (spinner) spinner.style.display = "none";
    select.disabled = false;
  }

  continentSelect.addEventListener("change", async (e) => {
    const continent = e.target.value;
    setSelection({ continent, country: "", city: "" });
    if (!continent) return;

    showSelectLoading(countrySelect);
    setOptions(citySelect, [], "Select a country first");

    const countries = await fetchCountriesByContinent(continent);
    hideSelectLoading(countrySelect);

    if (countries.error) {
      clearOptions(countrySelect);
      const opt = document.createElement("option");
      opt.value = "";
      opt.textContent = ERROR_MESSAGES.COUNTRIES;
      countrySelect.appendChild(opt);
      showBanner(ERROR_MESSAGES.COUNTRIES);
      return;
    }
    setOptions(countrySelect, countries, "Select Country");
  });

  countrySelect.addEventListener("change", async (e) => {
    const country = e.target.value;
    setSelection({ country, city: "" });
    if (!country) return;

    showSelectLoading(citySelect);

    const cities = await fetchCitiesByCountry(country);
    hideSelectLoading(citySelect);

    if (cities.error) {
      clearOptions(citySelect);
      const opt = document.createElement("option");
      opt.value = "";
      opt.textContent = ERROR_MESSAGES.CITIES;
      citySelect.appendChild(opt);
      showBanner(ERROR_MESSAGES.CITIES);
      return;
    }
    setOptions(citySelect, cities, "Select City");
  });

  citySelect.addEventListener("change", (e) => {
    const city = e.target.value;
    setSelection({ city });
    if (!city) return;
    nextPrayerSection.style.display = "none";
  });

  methodSelect.addEventListener("change", async (e) => {
    setSelection({ method: e.target.value });
    const methodId = e.target.value;

    showSelectLoading(methodSelect);
    showLoading(loadingEl);
    prayerTableBody.innerHTML = "";

    const data = await fetchAdhanTimeWithMethod(citySelect.value, methodId);

    hideSelectLoading(methodSelect);
    hideLoading(loadingEl);

    if (data.error) {
      showErrorInTable(prayerTableBody, ERROR_MESSAGES.PRAYER_TIMES);
      nextPrayerSection.style.display = "none";
      showBanner(ERROR_MESSAGES.PRAYER_TIMES);
      return;
    }

    const mainPrayers = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
    const adhanTimes = Object.entries(data.timings)
      .filter(([key]) => mainPrayers.includes(key))
      .map(([_, value]) => value);

    if (adhanTimes.length === 0) {
      showErrorInTable(prayerTableBody, ERROR_MESSAGES.PRAYER_TIMES);
      nextPrayerSection.style.display = "none";
      return;
    }

    setAdhan(
      adhanTimes,
      typeCheckBtn.checked,
      prayerTableBody,
      nextPrayerSection,
      nextPrayerEl,
      nextPrayerNameEl,
      nextPrayerDayEl,
      typeCheckBtn
    );
    setSelection({ adhan: adhanTimes });
  });

  typeCheckBtn.addEventListener("change", () => {
    const saved = getSelection();
    if (saved.adhan && Array.isArray(saved.adhan)) {
      setAdhan(
        saved.adhan,
        typeCheckBtn.checked,
        prayerTableBody,
        nextPrayerSection,
        nextPrayerEl,
        nextPrayerNameEl,
        nextPrayerDayEl,
        typeCheckBtn
      );
      setSelection({ timeFormat: typeCheckBtn.checked });
    }
  });

  resetBtn.addEventListener("click", () => {
    resetSelection();
    continentSelect.value = "";
    nextPrayerSection.style.display = "none";

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

    prayerTableBody.innerHTML = initialTableMessage;
  });
}
