/* =========================
FILE: script.js
========================= */

/* =========================
ELEMENTS
========================= */

const clock = document.getElementById("clock");
const dateElement = document.getElementById("date");
const greeting = document.getElementById("greeting");
const usernameInput = document.getElementById("username");

const temperature = document.getElementById("temperature");
const weatherDescription =
  document.getElementById("weather-description");

const searchForm =
  document.getElementById("searchForm");

const searchInput =
  document.getElementById("searchInput");

const themeToggle =
  document.getElementById("themeToggle");

const shortcutsGrid =
  document.getElementById("shortcutsGrid");

/* =========================
CLOCK
========================= */

function updateClock() {

  const now = new Date();

  const time = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  clock.textContent = time;

  dateElement.textContent =
    now.toLocaleDateString([], {
      weekday: "long",
      month: "long",
      day: "numeric",
    });

  updateGreeting(now.getHours());
}

function updateGreeting(hour) {

  let text = "Good Evening";

  if (hour < 12) {
    text = "Good Morning";
  } else if (hour < 18) {
    text = "Good Afternoon";
  }

  const username =
    localStorage.getItem("username") || "";

  greeting.textContent =
    `${text}${username ? ", " + username : ""}`;
}

setInterval(updateClock, 1000);

updateClock();

/* =========================
USERNAME STORAGE
========================= */

const savedUsername =
  localStorage.getItem("username");

if (savedUsername) {
  usernameInput.value = savedUsername;
}

usernameInput.addEventListener("input", () => {

  localStorage.setItem(
    "username",
    usernameInput.value
  );

  updateClock();
});

/* =========================
SEARCH
========================= */

searchForm.addEventListener("submit", (e) => {

  e.preventDefault();

  const query = searchInput.value.trim();

  if (!query) return;

  window.location.href =
    `https://www.google.com/search?q=${encodeURIComponent(query)}`;
});

/* =========================
THEME
========================= */

function applyTheme(theme) {

  if (theme === "light") {

    document.body.classList.add("light-theme");

    themeToggle.innerHTML =
      '<i class="fa-solid fa-sun"></i>';

  } else {

    document.body.classList.remove("light-theme");

    themeToggle.innerHTML =
      '<i class="fa-solid fa-moon"></i>';
  }

  localStorage.setItem("theme", theme);
}

const savedTheme =
  localStorage.getItem("theme");

if (savedTheme) {

  applyTheme(savedTheme);

} else {

  const prefersLight =
    window.matchMedia(
      "(prefers-color-scheme: light)"
    ).matches;

  applyTheme(prefersLight ? "light" : "dark");
}

themeToggle.addEventListener("click", () => {

  const isLight =
    document.body.classList.contains("light-theme");

  applyTheme(isLight ? "dark" : "light");
});

/* =========================
WEATHER
========================= */
/*
Uses open-meteo free API
No API key required
*/

async function getWeather(lat, lon) {

  try {

    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
    );

    const data = await response.json();

    temperature.textContent =
      `${Math.round(data.current_weather.temperature)}°C`;

    weatherDescription.textContent =
      "Minimal weather vibes";

  } catch (error) {

    weatherDescription.textContent =
      "Weather unavailable";
  }
}

function getLocation() {

  if (!navigator.geolocation) return;

  navigator.geolocation.getCurrentPosition(

    (position) => {

      getWeather(
        position.coords.latitude,
        position.coords.longitude
      );
    },

    () => {

      weatherDescription.textContent =
        "Location denied";
    }
  );
}

getLocation();

/* =========================
SHORTCUTS
========================= */

const defaultShortcuts = [

  {
    name: "YouTube",
    icon: "fa-brands fa-youtube",
    url: "https://youtube.com",
  },

  {
    name: "GitHub",
    icon: "fa-brands fa-github",
    url: "https://github.com",
  },

  {
    name: "Spotify",
    icon: "fa-brands fa-spotify",
    url: "https://spotify.com",
  },

  {
    name: "Gmail",
    icon: "fa-solid fa-envelope",
    url: "https://mail.google.com",
  },

  {
    name: "Figma",
    icon: "fa-brands fa-figma",
    url: "https://figma.com",
  },

  {
    name: "Notion",
    icon: "fa-solid fa-book",
    url: "https://notion.so",
  },
];

function loadShortcuts() {

  const shortcuts =
    JSON.parse(
      localStorage.getItem("shortcuts")
    ) || defaultShortcuts;

  shortcutsGrid.innerHTML = "";

  shortcuts.forEach((shortcut, index) => {

    const card = document.createElement("a");

    card.className =
      "shortcut-card glass";

    card.href = shortcut.url;

    card.target = "_blank";

    card.innerHTML = `
      <i class="${shortcut.icon}"></i>
      <span>${shortcut.name}</span>
    `;

    shortcutsGrid.appendChild(card);
  });
}

loadShortcuts();

/* =========================
EDIT SHORTCUTS
========================= */

document
  .getElementById("editShortcutsBtn")
  .addEventListener("click", () => {

    const current =
      JSON.parse(
        localStorage.getItem("shortcuts")
      ) || defaultShortcuts;

    const name =
      prompt("Shortcut Name:");

    const url =
      prompt("Shortcut URL:");

    const icon =
      prompt(
        "FontAwesome icon class:",
        "fa-solid fa-globe"
      );

    if (!name || !url) return;

    current.push({
      name,
      url,
      icon,
    });

    localStorage.setItem(
      "shortcuts",
      JSON.stringify(current)
    );

    loadShortcuts();
  });

/* =========================
PWA
========================= */

if ("serviceWorker" in navigator) {

  window.addEventListener("load", () => {

    navigator.serviceWorker
      .register("sw.js")
      .catch(console.error);
  });
}
