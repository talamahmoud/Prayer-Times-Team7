import { timeFormat } from "./time-utils.js";

let countdownInterval = null;
let prayerTimes = [];

export function getNextPrayer() {
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

export function startPrayerCountdown(
  nextPrayerEl,
  nextPrayerNameEl,
  nextPrayerDayEl,
  typeCheckBtn
) {
  if (countdownInterval) clearInterval(countdownInterval);
  if (!nextPrayerEl) return;

  const updateCountdown = () => {
    const nextPrayer = getNextPrayer();
    if (!nextPrayer) {
      nextPrayerEl.textContent = "No prayer times available";
      return;
    }

    const now = new Date();
    const currentTimeInMinutes =
      now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
    let timeDiff = nextPrayer.time - currentTimeInMinutes;

    if (timeDiff <= 0) {
      const updatedNextPrayer = getNextPrayer();
      if (!updatedNextPrayer) return;
      timeDiff = updatedNextPrayer.time - currentTimeInMinutes;
    }

    const hours = Math.floor(timeDiff / 60);
    const minutes = Math.floor(timeDiff % 60);
    const seconds = Math.floor((timeDiff % 1) * 60);

    nextPrayerEl.textContent = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    nextPrayerNameEl.textContent = `Next Prayer: ${nextPrayer.name}`;
    nextPrayerDayEl.textContent = nextPrayer.tomorrow
      ? `Tomorrow ${nextPrayer.timeString}`
      : `Today ${timeFormat(nextPrayer.timeString, typeCheckBtn.checked)}`;
  };

  updateCountdown();
  countdownInterval = setInterval(updateCountdown, 1000);
}

export function setAdhan(
  prayers,
  timeFormatChecked,
  prayerTableBody,
  nextPrayerSection,
  nextPrayerEl,
  nextPrayerNameEl,
  nextPrayerDayEl,
  typeCheckBtn
) {
  if (!prayers || prayers.length === 0) {
    prayerTableBody.innerHTML =
      "<tr><td colspan='2'>No prayer times available</td></tr>";
    nextPrayerSection.style.display = "none";
    return;
  }

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
  nextPrayerSection.style.display = "block";
  startPrayerCountdown(
    nextPrayerEl,
    nextPrayerNameEl,
    nextPrayerDayEl,
    typeCheckBtn
  );
}
