const moodDateInput = document.getElementById("moodDate");
const moodPromptText = document.getElementById("moodPromptText");
const moodOptions = document.querySelectorAll(".mood-option");
const saveMoodButton = document.getElementById("saveMoodButton");
const saveMoodStatus = document.getElementById("saveMoodStatus");
const moodCountLabel = document.getElementById("moodCountLabel");
const recentEntriesContainer = document.getElementById("recentEntries");

const MOOD_ORDER = ["Great", "Good", "Okay", "Low", "Very Low"];
const moodMeta = {
  Great: { emoji: "😄" },
  Good: { emoji: "😊" },
  Okay: { emoji: "😐" },
  Low: { emoji: "😟" },
  "Very Low": { emoji: "😢" }
};

let selectedMood = null;
let moodChart = null;

initializeMoodTracker();

function initializeMoodTracker() {
  moodDateInput.value = formatDateInput(new Date());
  updatePromptDate();
  renderMoodData();

  moodDateInput.addEventListener("change", updatePromptDate);

  moodOptions.forEach((button) => {
    button.addEventListener("click", () => selectMood(button));
  });

  saveMoodButton.addEventListener("click", saveMoodEntry);
}

function selectMood(button) {
  moodOptions.forEach((option) => option.classList.remove("active"));
  button.classList.add("active");
  selectedMood = {
    mood: button.dataset.mood,
    emoji: button.dataset.emoji
  };
  saveMoodStatus.textContent = "";
}

function updatePromptDate() {
  const selectedDate = new Date(`${moodDateInput.value}T00:00:00`);
  moodPromptText.textContent = `How are you feeling on ${formatLongDate(selectedDate)}?`;
}

function saveMoodEntry() {
  if (!selectedMood) {
    saveMoodStatus.textContent = "Please select a mood first.";
    return;
  }

  const selectedDate = moodDateInput.value;
  if (!selectedDate) {
    saveMoodStatus.textContent = "Please choose a date.";
    return;
  }

  const entries = loadMoodLogs();
  const existingIndex = entries.findIndex((entry) => entry.date === selectedDate);
  const nextEntry = {
    date: selectedDate,
    mood: selectedMood.mood,
    emoji: selectedMood.emoji,
    createdAt: new Date().toISOString()
  };

  if (existingIndex >= 0) {
    entries[existingIndex] = nextEntry;
  } else {
    entries.push(nextEntry);
  }

  entries.sort((a, b) => new Date(b.date) - new Date(a.date));
  localStorage.setItem("moodLogs", JSON.stringify(entries));

  saveMoodStatus.textContent = "Mood saved successfully.";
  renderMoodData();
}

function loadMoodLogs() {
  const stored = JSON.parse(localStorage.getItem("moodLogs")) || [];
  return stored.filter((entry) => entry.date && entry.mood);
}

function renderMoodData() {
  const entries = loadMoodLogs();
  moodCountLabel.textContent = `${entries.length} ${entries.length === 1 ? "entry" : "entries"}`;
  renderMoodChart(entries);
  renderRecentEntries(entries);
}

function renderMoodChart(entries) {
  const counts = MOOD_ORDER.map((mood) => entries.filter((entry) => entry.mood === mood).length);
  const context = document.getElementById("moodFrequencyChart");

  if (moodChart) {
    moodChart.destroy();
  }

  Chart.defaults.color = "#748198";
  Chart.defaults.font.family = "Outfit, sans-serif";
  Chart.defaults.borderColor = "rgba(81, 95, 116, 0.18)";

  moodChart = new Chart(context, {
    type: "bar",
    data: {
      labels: MOOD_ORDER,
      datasets: [
        {
          data: counts,
          backgroundColor: "#18d6c4",
          borderRadius: 8
        }
      ]
    },
    options: {
      maintainAspectRatio: false,
      scales: {
        x: {
          ticks: {
            color: "#76829a"
          },
          grid: {
            color: "rgba(79, 93, 114, 0.2)",
            borderDash: [4, 4]
          }
        },
        y: {
          beginAtZero: true,
          suggestedMax: Math.max(4, ...counts, 1),
          ticks: {
            stepSize: 1,
            color: "#76829a"
          },
          grid: {
            color: "rgba(79, 93, 114, 0.2)",
            borderDash: [4, 4]
          }
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    }
  });
}

function renderRecentEntries(entries) {
  if (!entries.length) {
    recentEntriesContainer.innerHTML = `<div class="empty-state">No entries yet. Start logging your mood!</div>`;
    return;
  }

  recentEntriesContainer.innerHTML = entries
    .slice(0, 6)
    .map((entry) => `
      <div class="entry-card">
        <div class="entry-date">${formatLongDate(new Date(`${entry.date}T00:00:00`))}</div>
        <div class="entry-mood">
          <span>${entry.mood}</span>
          <span class="entry-emoji">${entry.emoji || moodMeta[entry.mood]?.emoji || "🙂"}</span>
        </div>
      </div>
    `)
    .join("");
}

function formatDateInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatLongDate(date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(date);
}
