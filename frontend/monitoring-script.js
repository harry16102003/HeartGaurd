const MONITOR_KEY = "monitoringVitals";

let bloodPressureChart;
let vitalsOverviewChart;

const demoVitals = [
  { date: "2026-04-16", time: "07:40", systolic: 118, diastolic: 78, heartRate: 70, glucose: 93 },
  { date: "2026-04-15", time: "08:10", systolic: 125, diastolic: 82, heartRate: 75, glucose: 101 },
  { date: "2026-04-14", time: "08:00", systolic: 120, diastolic: 80, heartRate: 72, glucose: 95 }
];

document.addEventListener("DOMContentLoaded", () => {
  ensureInitialVitals();
  setupMonitoringPage();
  renderMonitoringData();
});

function ensureInitialVitals() {
  if (!localStorage.getItem(MONITOR_KEY)) {
    localStorage.setItem(MONITOR_KEY, JSON.stringify(demoVitals));
  }
}

function setupMonitoringPage() {
  const toggleButton = document.getElementById("toggleVitalsForm");
  const saveButton = document.getElementById("saveVitalsEntry");

  toggleButton?.addEventListener("click", () => {
    document.getElementById("vitalsFormCard")?.classList.toggle("hidden");
  });

  saveButton?.addEventListener("click", saveVitalsEntry);
}

function getVitalsEntries() {
  try {
    return JSON.parse(localStorage.getItem(MONITOR_KEY) || "[]");
  } catch (error) {
    return [];
  }
}

function setVitalsEntries(entries) {
  localStorage.setItem(MONITOR_KEY, JSON.stringify(entries));
}

function saveVitalsEntry() {
  const systolic = Number(document.getElementById("systolicInput")?.value || 0);
  const diastolic = Number(document.getElementById("diastolicInput")?.value || 0);
  const heartRate = Number(document.getElementById("heartRateInput")?.value || 0);
  const glucose = Number(document.getElementById("glucoseInput")?.value || 0);

  if (!systolic || !diastolic || !heartRate || !glucose) {
    return;
  }

  const now = new Date();
  const date = formatDate(now);
  const time = now.toTimeString().slice(0, 5);

  const entries = getVitalsEntries();
  entries.push({ date, time, systolic, diastolic, heartRate, glucose });
  entries.sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));

  setVitalsEntries(entries);
  clearVitalsForm();
  document.getElementById("vitalsFormCard")?.classList.add("hidden");
  renderMonitoringData();
}

function clearVitalsForm() {
  document.getElementById("systolicInput").value = "";
  document.getElementById("diastolicInput").value = "";
  document.getElementById("heartRateInput").value = "";
  document.getElementById("glucoseInput").value = "";
}

function renderMonitoringData() {
  const entries = getVitalsEntries();
  if (!entries.length) return;

  const latest = entries[entries.length - 1];
  document.getElementById("latestBloodPressure").textContent = `${latest.systolic}/${latest.diastolic}`;
  document.getElementById("latestHeartRate").textContent = latest.heartRate;
  document.getElementById("latestGlucose").textContent = latest.glucose;
  document.getElementById("lastReadingTime").textContent = latest.time;
  document.getElementById("lastReadingDate").textContent = latest.date;

  renderBloodPressureChart(entries);
  renderVitalsOverviewChart(entries);
}

function renderBloodPressureChart(entries) {
  const ctx = document.getElementById("bloodPressureChart");
  if (!ctx) return;

  if (bloodPressureChart) {
    bloodPressureChart.destroy();
  }

  bloodPressureChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: entries.map((entry) => entry.date),
      datasets: [
        {
          label: "Systolic",
          data: entries.map((entry) => entry.systolic),
          borderColor: "#11dfcd",
          backgroundColor: "rgba(17, 223, 205, 0.14)",
          pointBackgroundColor: "#11dfcd",
          pointBorderColor: "#ffffff",
          pointRadius: 4,
          pointHoverRadius: 5,
          tension: 0.35
        },
        {
          label: "Diastolic",
          data: entries.map((entry) => entry.diastolic),
          borderColor: "#2894ff",
          backgroundColor: "rgba(40, 148, 255, 0.14)",
          pointBackgroundColor: "#2894ff",
          pointBorderColor: "#ffffff",
          pointRadius: 4,
          pointHoverRadius: 5,
          tension: 0.35
        }
      ]
    },
    options: chartOptions({
      yMin: 0,
      yMax: 140,
      tooltipLabels: (context) => `${context.dataset.label} : ${context.formattedValue}`
    })
  });
}

function renderVitalsOverviewChart(entries) {
  const ctx = document.getElementById("vitalsOverviewChart");
  if (!ctx) return;

  if (vitalsOverviewChart) {
    vitalsOverviewChart.destroy();
  }

  vitalsOverviewChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: entries.map((entry) => entry.date),
      datasets: [
        {
          label: "Glucose",
          data: entries.map((entry) => entry.glucose),
          borderColor: "#ffb302",
          backgroundColor: "rgba(255, 179, 2, 0.14)",
          pointBackgroundColor: "#ffb302",
          pointBorderColor: "#ffffff",
          pointRadius: 4,
          pointHoverRadius: 5,
          tension: 0.35
        },
        {
          label: "Heart Rate",
          data: entries.map((entry) => entry.heartRate),
          borderColor: "#ff3b30",
          backgroundColor: "rgba(255, 59, 48, 0.14)",
          pointBackgroundColor: "#ff3b30",
          pointBorderColor: "#ffffff",
          pointRadius: 4,
          pointHoverRadius: 5,
          tension: 0.35
        }
      ]
    },
    options: chartOptions({
      yMin: 0,
      yMax: 110,
      tooltipLabels: (context) => `${context.dataset.label} : ${context.formattedValue}`
    })
  });
}

function chartOptions({ yMin, yMax, tooltipLabels }) {
  return {
    maintainAspectRatio: false,
    responsive: true,
    interaction: {
      mode: "index",
      intersect: false
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: "#161c24",
        borderColor: "rgba(52, 67, 89, 0.9)",
        borderWidth: 1,
        titleColor: "#f0f4f9",
        bodyColor: "#dbe6f4",
        padding: 14,
        displayColors: false,
        callbacks: {
          label: tooltipLabels
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: "rgba(62, 74, 95, 0.34)",
          borderDash: [4, 4]
        },
        ticks: {
          color: "#7f89a0"
        }
      },
      y: {
        min: yMin,
        max: yMax,
        grid: {
          color: "rgba(62, 74, 95, 0.34)",
          borderDash: [4, 4]
        },
        ticks: {
          color: "#7f89a0"
        }
      }
    }
  };
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
