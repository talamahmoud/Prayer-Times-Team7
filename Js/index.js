import { registerEventListeners } from "./events.js";
import { init } from "./init.js";

const continentSelect = document.getElementById("continent");
const countrySelect = document.getElementById("country");
const citySelect = document.getElementById("city");
const methodSelect = document.getElementById("method");
const resetBtn = document.getElementById("resetBtn");
const prayerTableBody = document.getElementById("table-body");
const typeCheckBtn = document.getElementById("type-btn");

const nextPrayerSection = document.getElementById("nextPrayer");
const nextPrayerEl = document.querySelector(".countdown");
const nextPrayerNameEl = document.querySelector(".prayer-name");
const nextPrayerDayEl = document.querySelector(".next-prayer-day");

registerEventListeners({
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
});

init({
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
});
