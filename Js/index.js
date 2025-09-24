import {
  fetchCountriesByContinent,
  fetchCitiesByCountry,
  fetchCalculationMethods,
  fetchAdhanTimeWithMethod,
} from "./api.js";
import { getSelection, setSelection, resetSelection } from "./storage.js";
const continentSelect = document.getElementById("continent");
const countrySelect = document.getElementById("country");
const citySelect = document.getElementById("city");
const methodSelect = document.getElementById("method");
const resetBtn = document.getElementById("resetBtn");
const prayerTableBody = document.getElementById("table-body");
const typeCheckBtn = document.getElementById("type-btn");
const nextPrayerEl = document.querySelector(".countdown");
const nextPrayerNameEl = document.querySelector(".prayer-name");
const nextPrayerDayEl = document.querySelector(".next-prayer-day");

let countdownInterval = null;
let prayerTimes = [];

function getNextPrayer() {
  if (!prayerTimes || prayerTimes.length === 0) return null;

  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();

  for (let prayer of prayerTimes) {
    const [hours, minutes] = prayer.time.split(":");
    const prayerTimeInMinutes = parseInt(hours) * 60 + parseInt(minutes);

    if (prayerTimeInMinutes > currentTime) {
      return {
        name: prayer.name,
        time: prayerTimeInMinutes,
        timeString: prayer.time,
      };
    }
  }

  // If no prayer left today, return first prayer of tomorrow (Fajr)
  return {
    name: prayerTimes[0].name,
    time:
      parseInt(prayerTimes[0].time.split(":")[0]) * 60 +
      parseInt(prayerTimes[0].time.split(":")[1]) +
      24 * 60,
    timeString: prayerTimes[0].time,
    tomorrow: true,
  };
}

function startPrayerCountdown() {
  // Clear existing countdown
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }

  if (!nextPrayerEl) return;

  const updateCountdown = () => {
    const nextPrayer = getNextPrayer();

    if (!nextPrayer) {
      nextPrayerEl.innerHTML = "No prayer times available";
      return;
    }

    const now = new Date();
    const currentTimeInMinutes =
      now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;

    let timeDiff = nextPrayer.time - currentTimeInMinutes;

    if (timeDiff <= 0) {
      // If time passed, get next prayer
      const updatedNextPrayer = getNextPrayer();
      if (!updatedNextPrayer) return;
      timeDiff = updatedNextPrayer.time - currentTimeInMinutes;
    }

    const hours = Math.floor(timeDiff / 60);
    const minutes = Math.floor(timeDiff % 60);
    const seconds = Math.floor((timeDiff % 1) * 60);

    const prayerName = nextPrayer.tomorrow
      ? `${nextPrayer.name} (غداً)`
      : nextPrayer.name;
    nextPrayerEl.textContent = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    nextPrayerNameEl.textContent = `Next Prayer: ${nextPrayer.name}`;
    nextPrayerDayEl.textContent = nextPrayer.tomorrow
      ? `Tomorrow ${nextPrayer.time}`
      : `Today ${timeFormat(nextPrayer.timeString, typeCheckBtn.checked)}`;
  };
  updateCountdown();

  countdownInterval = setInterval(updateCountdown, 1000);
}

function clearOptions(select) {
  while (select.firstChild) {
    select.removeChild(select.firstChild);
  }
}

function timeFormat(time, check) {
  const [hours, minutes] = time.split(":");
  let hour = parseInt(hours, 10);

  const amOrPm = hour >= 12 ? "PM" : "AM";

  if (check) {
    const hour24 = hour % 24;
    return `${hour24}:${minutes} ${amOrPm}`;
  } else {
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${amOrPm}`;
  }
}

function setAdhan(prayers, timeFormatChecked) {
  if (!prayers || !Array.isArray(prayers)) return;

  prayerTableBody.innerHTML = "";
  const mainPrayers = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

  prayers.forEach((value, index) => {
    const tr = document.createElement("tr");
    const tdLabel = document.createElement("td");
    const tdValue = document.createElement("td");

    tdLabel.textContent = mainPrayers[index];
    tdValue.textContent = timeFormat(value, timeFormatChecked);

    tr.appendChild(tdLabel);
    tr.appendChild(tdValue);
    prayerTableBody.appendChild(tr);
  });
  prayerTimes = prayers.map((time, index) => ({
    name: mainPrayers[index],
    time: time,
  }));
  startPrayerCountdown();
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

  items.forEach((item) => {
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
  } catch (err) {
    clearOptions(methodSelect);
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = "Error loading methods";
    methodSelect.appendChild(opt);
  }
}

// When continent changes
continentSelect.addEventListener("change", async (e) => {
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
countrySelect.addEventListener("change", async (e) => {
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
citySelect.addEventListener("change", (e) => {
  setSelection({ city: e.target.value });
});

//  When method changes
methodSelect.addEventListener("change", async (e) => {
  setSelection({ method: e.target.value });
  const methodId = e.target.value;

  try {
    const data = await fetchAdhanTimeWithMethod(citySelect.value, methodId);
    const mainPrayers = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

    prayerTableBody.innerHTML = "";
    const rows = Object.entries(data.timings)
      .filter(([key]) => mainPrayers.includes(key))
      .map(([key, value]) => {
        const tr = document.createElement("tr");
        const tdLabel = document.createElement("td");
        const tdValue = document.createElement("td");

        tdLabel.textContent = key;
        tdValue.textContent = timeFormat(value, typeCheckBtn.checked);

        tr.appendChild(tdLabel);
        tr.appendChild(tdValue);
        prayerTableBody.appendChild(tr);

        return { tdValue, value };
      });
    setSelection({
      adhan: rows.map(({ value }) => value),
    });
  } catch (err) {
    console.error("Error fetching Adhan time:", err);
  }
});
typeCheckBtn.addEventListener("change", () => {
  const saved = getSelection();
  if (saved.adhan && Array.isArray(saved.adhan)) {
    setAdhan(saved.adhan, typeCheckBtn.checked);
    setSelection({ timeFormat: typeCheckBtn.checked });
  }
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

  if (saved.timeFormat !== undefined) {
    typeCheckBtn.checked = saved.timeFormat;
  }

  if (saved.adhan && Array.isArray(saved.adhan)) {
    setAdhan(saved.adhan, saved.timeFormat);
  }
}

// Reset button
resetBtn.addEventListener("click", () => {
  resetSelection();
  continentSelect.value = "";
  prayerTableBody.innerHTML = "";

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
