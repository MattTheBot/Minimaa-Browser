/* ELEMENTS */

const clock =
  document.getElementById("clock");

const greeting =
  document.getElementById("greeting");

const date =
  document.getElementById("date");

const temperature =
  document.getElementById("temperature");

const themeToggle =
  document.getElementById("themeToggle");

const settingsBtn =
  document.getElementById("settingsBtn");

const settingsPanel =
  document.getElementById("settingsPanel");

/* CLOCK */

function updateClock() {

  const now = new Date();

  clock.textContent =
    now.toLocaleTimeString([], {

      hour: "2-digit",

      minute: "2-digit",
    });

  date.textContent =
    now.toLocaleDateString([], {

      weekday: "long",

      month: "long",

      day: "numeric",
    });

  updateGreeting(now.getHours());
}

function updateGreeting(hour) {

  let text =
    "Good Evening";

  if (hour < 12) {

    text =
      "Good Morning";
  }

  else if (hour < 18) {

    text =
      "Good Afternoon";
  }

  greeting.textContent =
    text;
}

setInterval(updateClock, 1000);

updateClock();

/* SEARCH */

document
  .getElementById("searchForm")
  .addEventListener("submit", (e) => {

    e.preventDefault();

    const query =
      document
      .getElementById("searchInput")
      .value
      .trim();

    if (!query) return;

    window.location.href =
      `https://google.com/search?q=${encodeURIComponent(query)}`;
  });

/* WEATHER */

async function getWeather(lat, lon) {

  try {

    const response =
      await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
      );

    const data =
      await response.json();

    temperature.textContent =
      `${Math.round(data.current_weather.temperature)}°C`;

  } catch {

    temperature.textContent =
      "--°";
  }
}

navigator.geolocation.getCurrentPosition(

  (position) => {

    getWeather(
      position.coords.latitude,
      position.coords.longitude
    );
  }
);

/* THEME */

function applyTheme(theme) {

  if (theme === "light") {

    document.body.classList.add(
      "light-theme"
    );

    themeToggle.innerHTML =
      '<i class="fa-solid fa-sun"></i>';

  } else {

    document.body.classList.remove(
      "light-theme"
    );

    themeToggle.innerHTML =
      '<i class="fa-solid fa-moon"></i>';
  }

  localStorage.setItem(
    "theme",
    theme
  );
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

  applyTheme(
    prefersLight ? "light" : "dark"
  );
}

themeToggle.addEventListener("click", () => {

  const isLight =
    document.body.classList.contains(
      "light-theme"
    );

  applyTheme(
    isLight ? "dark" : "light"
  );
});

/* BOOKMARKS */

const bookmarks = [

  {
    name: "GitHub",
    icon: "fa-brands fa-github",
    url: "https://github.com",
  },

  {
    name: "YouTube",
    icon: "fa-brands fa-youtube",
    url: "https://youtube.com",
  },

  {
    name: "Gmail",
    icon: "fa-solid fa-envelope",
    url: "https://mail.google.com",
  },

  {
    name: "Spotify",
    icon: "fa-brands fa-spotify",
    url: "https://spotify.com",
  },

  {
    name: "Figma",
    icon: "fa-brands fa-figma",
    url: "https://figma.com",
  },
];

const bookmarksRow =
  document.getElementById("bookmarksRow");

bookmarks.forEach((bookmark) => {

  const element =
    document.createElement("a");

  element.className =
    "bookmark";

  element.href =
    bookmark.url;

  element.target =
    "_blank";

  element.innerHTML = `
    <i class="${bookmark.icon}"></i>
    <span>${bookmark.name}</span>
  `;

  bookmarksRow.appendChild(element);
});

/* SETTINGS */

settingsBtn.addEventListener("click", () => {

  settingsPanel.classList.toggle(
    "hidden"
  );
});

/* TOGGLES */

const toggles = [

  {
    id: "toggleBookmarks",
    target: "bookmarksSection",
  },

  {
    id: "toggleWeather",
    target: "weatherBlock",
  },

  {
    id: "toggleClock",
    target: "clockBlock",
  },

  {
    id: "toggleMusic",
    target: "musicSection",
  },
];

toggles.forEach((toggle) => {

  const checkbox =
    document.getElementById(toggle.id);

  const target =
    document.getElementById(toggle.target);

  const saved =
    localStorage.getItem(toggle.id);

  if (saved === "false") {

    checkbox.checked = false;

    target.style.display =
      "none";
  }

  checkbox.addEventListener("change", () => {

    target.style.display =
      checkbox.checked
      ? ""
      : "none";

    localStorage.setItem(
      toggle.id,
      checkbox.checked
    );
  });
});

/* DRAG BOOKMARKS */

new Sortable(bookmarksRow, {

  animation: 150,
});
