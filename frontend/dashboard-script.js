const API_BASE_URL = "http://127.0.0.1:8000";
const rawMoodLogs = JSON.parse(localStorage.getItem("moodLogs")) || [];

initDashboard();

async function initDashboard() {
  const { predictions, source } = await loadPredictionHistory();
  const stats = buildDashboardStats(predictions, rawMoodLogs);

  renderStats(stats);
  renderAchievements(stats);
  renderLatestPrediction(stats.latestPrediction);
  renderCharts(stats);
  updateHistoryStatus(source, stats.totalPredictions);
}

async function loadPredictionHistory() {
  try {
    const response = await fetch(`${API_BASE_URL}/predictions`);
    if (!response.ok) {
      throw new Error(`History request failed with ${response.status}`);
    }

    const data = await response.json();
    const predictions = normalizePredictions(Array.isArray(data.items) ? data.items : []);
    localStorage.setItem("predictions", JSON.stringify(predictions));
    return { predictions, source: "backend" };
  } catch (error) {
    const localPredictions = JSON.parse(localStorage.getItem("predictions")) || [];
    return {
      predictions: normalizePredictions(localPredictions),
      source: localPredictions.length ? "local" : "empty"
    };
  }
}

function normalizePredictions(items) {
  return items
    .map((item, index) => ({
      age: toNumberOrNull(item.age),
      bmi: toNumberOrNull(item.bmi),
      risk: Number(item.risk ?? item.final_risk_percentage ?? 0) || 0,
      confidence: Number(item.confidence ?? 0) || 0,
      label: item.risk_label || describeRisk(Number(item.risk ?? item.final_risk_percentage ?? 0) || 0).label,
      fieldsUsedCount: Number(item.fields_used_count ?? item.fieldsUsedCount ?? 0) || 0,
      totalFields: Number(item.total_fields ?? item.totalFields ?? 14) || 14,
      source: item.source || "prediction",
      date: item.timestamp || item.date || item.createdAt || buildFallbackDate(index)
    }))
    .filter((item) => item.risk >= 0)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
}

function toNumberOrNull(value) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : null;
}

function buildFallbackDate(index) {
  const date = new Date();
  date.setMinutes(date.getMinutes() - Math.max(0, 2 - index));
  return date.toISOString();
}

function buildDashboardStats(data, moodLogs) {
  const totalPredictions = data.length;
  const averageRisk = totalPredictions
    ? Math.round(data.reduce((sum, entry) => sum + entry.risk, 0) / totalPredictions)
    : 0;
  const highRiskCases = data.filter((entry) => entry.risk >= 60).length;
  const healthScore = totalPredictions ? clamp(Math.round(100 - averageRisk), 0, 100) : null;
  const streak = calculateStreak(data);
  const latestPrediction = totalPredictions ? data[totalPredictions - 1] : null;

  const distribution = {
    low: data.filter((entry) => entry.risk < 30).length,
    medium: data.filter((entry) => entry.risk >= 30 && entry.risk < 60).length,
    high: data.filter((entry) => entry.risk >= 60).length
  };

  const ageSeries = data
    .filter((entry) => entry.age !== null)
    .map((entry) => ({
      x: entry.age,
      y: entry.risk
    }));

  const bmiEntries = data.filter((entry) => entry.bmi !== null);
  const bmiLabels = bmiEntries.map((entry) => entry.bmi);
  const bmiRiskSeries = bmiEntries.map((entry) => entry.risk);

  return {
    totalPredictions,
    averageRisk,
    highRiskCases,
    healthScore,
    streak,
    latestPrediction,
    moodLogCount: Array.isArray(moodLogs) ? moodLogs.length : 0,
    distribution,
    ageSeries,
    bmiLabels,
    bmiRiskSeries
  };
}

function calculateStreak(data) {
  if (!data.length) {
    return 0;
  }

  const uniqueDays = [...new Set(data.map((entry) => formatDay(entry.date)))].sort();
  let streak = 1;

  for (let index = uniqueDays.length - 1; index > 0; index -= 1) {
    const current = new Date(uniqueDays[index]);
    const previous = new Date(uniqueDays[index - 1]);
    const diffDays = Math.round((current - previous) / 86400000);

    if (diffDays === 1) {
      streak += 1;
    } else if (diffDays > 1) {
      break;
    }
  }

  return streak;
}

function formatDay(value) {
  const date = new Date(value);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).toISOString();
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function renderStats(statsData) {
  animateValue(document.getElementById("totalPredictions"), statsData.totalPredictions, "");
  animateValue(document.getElementById("averageRisk"), statsData.averageRisk, "%");
  animateValue(document.getElementById("highRiskCases"), statsData.highRiskCases, "");
  animateValue(document.getElementById("streakCount"), statsData.streak, "");

  const healthScore = document.getElementById("healthScore");
  healthScore.textContent = statsData.healthScore === null ? "--" : `${statsData.healthScore}/100`;
}

function animateValue(element, value, suffix) {
  const duration = 700;
  const startTime = performance.now();

  function tick(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const current = Math.round(value * progress);
    element.textContent = `${current}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  }

  requestAnimationFrame(tick);
}

function renderAchievements(statsData) {
  const achievements = [
    {
      id: "badgeFirstPrediction",
      progressId: "badgeFirstPredictionMeta",
      current: statsData.totalPredictions,
      target: 1
    },
    {
      id: "badgeStreak",
      progressId: "badgeStreakMeta",
      current: statsData.streak,
      target: 3
    },
    {
      id: "badgeTenPredictions",
      progressId: "badgeTenPredictionsMeta",
      current: statsData.totalPredictions,
      target: 10
    },
    {
      id: "badgeMoodLogger",
      progressId: "badgeMoodLoggerMeta",
      current: statsData.moodLogCount,
      target: 3
    },
    {
      id: "badgeHealthScore",
      progressId: "badgeHealthScoreMeta",
      current: statsData.healthScore || 0,
      target: 80
    }
  ];

  achievements.forEach((achievement) => {
    const isActive = achievement.current >= achievement.target;
    const progressValue = Math.min(achievement.current, achievement.target);
    const progressText = isActive ? "Unlocked" : `${progressValue}/${achievement.target}`;

    setAchievementState(achievement.id, achievement.progressId, isActive, progressText);
  });
}

function setAchievementState(id, progressId, isActive, progressText) {
  const badgeElement = document.getElementById(id);
  const progressElement = document.getElementById(progressId);

  if (!badgeElement || !progressElement) {
    return;
  }

  badgeElement.classList.toggle("active", isActive);
  badgeElement.setAttribute("aria-pressed", String(isActive));
  progressElement.textContent = progressText;
}

function renderLatestPrediction(latestPrediction) {
  const latestRiskValue = document.getElementById("latestRiskValue");
  const latestRiskLabel = document.getElementById("latestRiskLabel");
  const latestRiskPill = document.getElementById("latestRiskPill");
  const latestPredictionDate = document.getElementById("latestPredictionDate");
  const latestPredictionInputs = document.getElementById("latestPredictionInputs");
  const latestRecommendation = document.getElementById("latestRecommendation");

  if (!latestPrediction) {
    latestRiskValue.textContent = "No prediction yet";
    latestRiskLabel.textContent = "Run a prediction to populate this dashboard.";
    latestPredictionDate.textContent = "Saved prediction history will stay visible here after refresh.";
    latestPredictionInputs.textContent = "Patients can start with a few values, and doctors can review the latest saved estimate here.";
    latestRecommendation.textContent = "No care note yet. After a prediction, this panel will summarize the latest next-step guidance.";
    latestRiskPill.textContent = "Awaiting data";
    latestRiskPill.className = "risk-pill neutral";
    return;
  }

  const description = describeRisk(latestPrediction.risk);
  latestRiskValue.textContent = `${Math.round(latestPrediction.risk)}%`;
  latestRiskLabel.textContent = `${latestPrediction.label} with ${Math.round(latestPrediction.confidence)}% confidence`;
  latestPredictionDate.textContent = `Last saved: ${formatReadableDate(latestPrediction.date)} (${latestPrediction.source === "backend" ? "Excel history" : "local backup"})`;
  latestPredictionInputs.textContent = `Inputs used: ${latestPrediction.fieldsUsedCount || 0}/${latestPrediction.totalFields || 14}`;
  latestRecommendation.textContent = description.recommendation;
  latestRiskPill.textContent = description.label;
  latestRiskPill.className = `risk-pill ${description.pillClass}`;
}

function updateHistoryStatus(source, totalPredictions) {
  const historyStatus = document.getElementById("historyStatus");

  historyStatus.classList.remove("success", "warning");

  if (source === "backend" && totalPredictions > 0) {
    historyStatus.textContent = `Showing ${totalPredictions} saved prediction${totalPredictions === 1 ? "" : "s"} from Excel history.`;
    historyStatus.classList.add("success");
    return;
  }

  if (source === "backend") {
    historyStatus.textContent = "No saved predictions yet. Use the Predict page to create the first one.";
    return;
  }

  if (source === "local" && totalPredictions > 0) {
    historyStatus.textContent = `Backend unavailable. Showing ${totalPredictions} locally saved prediction${totalPredictions === 1 ? "" : "s"}.`;
    historyStatus.classList.add("warning");
    return;
  }

  historyStatus.textContent = "No prediction history found yet.";
}

function renderCharts(statsData) {
  Chart.defaults.color = "#748198";
  Chart.defaults.font.family = "Outfit, sans-serif";
  Chart.defaults.borderColor = "rgba(81, 95, 116, 0.18)";

  new Chart(document.getElementById("riskChart"), {
    type: "pie",
    data: {
      labels: ["Low", "Medium", "High"],
      datasets: [
        {
          data: [
            statsData.distribution.low,
            statsData.distribution.medium,
            statsData.distribution.high
          ],
          backgroundColor: ["#11dfcd", "#ffb302", "#e62525"],
          borderColor: "#ffffff",
          borderWidth: 2
        }
      ]
    },
    options: {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            boxWidth: 12,
            usePointStyle: true,
            pointStyle: "circle",
            padding: 18
          }
        }
      }
    }
  });

  new Chart(document.getElementById("ageChart"), {
    type: "scatter",
    data: {
      datasets: [
        {
          label: "Risk %",
          data: statsData.ageSeries,
          backgroundColor: "#11dfcd",
          borderColor: "#11dfcd",
          pointRadius: 5,
          pointHoverRadius: 7
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
          min: 0,
          max: 100,
          ticks: {
            stepSize: 25,
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

  new Chart(document.getElementById("bmiChart"), {
    type: "bar",
    data: {
      labels: statsData.bmiLabels,
      datasets: [
        {
          data: statsData.bmiRiskSeries,
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
            display: false
          }
        },
        y: {
          min: 0,
          max: 100,
          ticks: {
            stepSize: 25,
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

function describeRisk(risk) {
  if (risk < 30) {
    return {
      label: "Low Risk",
      recommendation: "Current results look relatively stable. Continue regular movement, balanced meals, and routine follow-up.",
      pillClass: "low"
    };
  }

  if (risk < 60) {
    return {
      label: "Moderate Risk",
      recommendation: "Some cardiovascular factors may need attention. Reviewing lifestyle changes and recent vitals with a clinician would be helpful.",
      pillClass: "moderate"
    };
  }

  return {
    label: "High Risk",
    recommendation: "This profile deserves timely clinical review, especially if symptoms, high blood pressure, diabetes, or smoking are also present.",
    pillClass: "high"
  };
}

function formatReadableDate(value) {
  const date = new Date(value);
  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}
