const API_BASE_URL = window.location.protocol === "file:" ? "http://127.0.0.1:8000" : window.location.origin;
const FIELD_IDS = [
  "age",
  "sex",
  "bmi",
  "cholesterol",
  "systolic_bp",
  "diastolic_bp",
  "glucose",
  "physical_activity",
  "smoking",
  "hypertension",
  "diabetes",
  "heart_rate",
  "ejection_fraction",
  "serum_creatinine"
];

const FIELD_SCORERS = {
  age: { weight: 1.2, score: (value) => clamp(((value - 18) / 62) * 100, 5, 95) },
  sex: { weight: 0.3, score: (value) => (Number(value) === 1 ? 56 : 46) },
  bmi: { weight: 1.0, score: (value) => (value >= 18.5 && value < 25 ? 18 : value < 30 ? 48 : value < 35 ? 74 : 88) },
  cholesterol: { weight: 0.9, score: (value) => (value < 180 ? 15 : value < 200 ? 30 : value < 240 ? 64 : 88) },
  systolic_bp: { weight: 1.2, score: (value) => (value < 120 ? 15 : value < 130 ? 30 : value < 140 ? 56 : value < 160 ? 78 : 92) },
  diastolic_bp: { weight: 0.8, score: (value) => (value < 80 ? 15 : value < 90 ? 45 : value < 100 ? 72 : 88) },
  glucose: { weight: 1.0, score: (value) => (value < 100 ? 15 : value < 126 ? 58 : 88) },
  physical_activity: { weight: 0.8, score: (value) => clamp(90 - (value * 12), 12, 90) },
  smoking: { weight: 1.1, score: (value) => (Number(value) === 1 ? 84 : 15) },
  hypertension: { weight: 1.1, score: (value) => (Number(value) === 1 ? 86 : 18) },
  diabetes: { weight: 1.2, score: (value) => (Number(value) === 1 ? 88 : 18) },
  heart_rate: { weight: 0.6, score: (value) => (value >= 55 && value <= 90 ? 18 : value >= 91 && value <= 110 ? 48 : 70) },
  ejection_fraction: { weight: 1.2, score: (value) => (value >= 55 ? 15 : value >= 41 ? 52 : value >= 30 ? 78 : 92) },
  serum_creatinine: { weight: 1.0, score: (value) => (value < 1.2 ? 18 : value < 2 ? 58 : value < 3 ? 78 : 92) }
};

const TOTAL_WEIGHT = Object.values(FIELD_SCORERS).reduce((sum, item) => sum + item.weight, 0);

const predictForm = document.getElementById("predictForm");
const predictButton = document.getElementById("predictButton");
const predictionResult = document.getElementById("predictionResult");
const resultIcon = document.getElementById("resultIcon");
const resultScore = document.getElementById("resultScore");
const resultLabel = document.getElementById("resultLabel");
const resultConfidence = document.getElementById("resultConfidence");
const resultCoverage = document.getElementById("resultCoverage");
const resultSource = document.getElementById("resultSource");
const resultRecommendation = document.getElementById("resultRecommendation");
const resultProgressBar = document.getElementById("resultProgressBar");
const resultBadge = document.getElementById("resultBadge");
const resultIconWrap = document.getElementById("resultIconWrap");
const dietPlanLink = document.getElementById("dietPlanLink");
const predictStatus = document.getElementById("predictStatus");

if (predictForm) {
  predictForm.addEventListener("submit", handlePrediction);
}

async function handlePrediction(event) {
  event.preventDefault();

  const payload = buildPayload();
  const fieldsUsedCount = Object.keys(payload).length;

  if (fieldsUsedCount < 2) {
    predictionResult.classList.add("hidden");
    setStatus("Enter at least 2 values so the estimate has enough information to be useful.", "error");
    return;
  }

  setLoading(true);
  setStatus("Running prediction and saving it for your dashboard...", "");

  try {
    const result = await requestPrediction(payload);
    renderPredictionResult(result);
    storePrediction(result.record || buildLocalRecord(payload, result));

    if (result.source === "backend") {
      setStatus("Prediction saved. The dashboard will keep this result even after refresh.", "success");
    } else {
      setStatus("Backend is unavailable, so this estimate was saved locally on this device.", "success");
    }
  } catch (error) {
    predictionResult.classList.add("hidden");
    setStatus(error.message || "Prediction could not be completed.", "error");
  } finally {
    setLoading(false);
  }
}

function buildPayload() {
  return FIELD_IDS.reduce((payload, fieldId) => {
    const element = document.getElementById(fieldId);
    if (!element) {
      return payload;
    }

    const rawValue = element.value.trim();
    if (rawValue === "") {
      return payload;
    }

    payload[fieldId] = Number(rawValue);
    return payload;
  }, {});
}

function setLoading(isLoading) {
  predictButton.classList.toggle("loading", isLoading);
}

function setStatus(message, tone) {
  predictStatus.textContent = message;
  predictStatus.classList.remove("success", "error");

  if (tone) {
    predictStatus.classList.add(tone);
  }
}

async function requestPrediction(payload) {
  try {
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message = errorData.detail || `Prediction request failed with ${response.status}`;
      const error = new Error(message);
      error.isClientError = response.status >= 400 && response.status < 500;
      throw error;
    }

    const data = await response.json();
    const fieldsUsedCount = Number(data.fields_used_count) || Object.keys(payload).length;
    const totalFields = Number(data.total_fields) || FIELD_IDS.length;

    return {
      risk: sanitizePercentage(data.final_risk_percentage),
      confidence: sanitizePercentage(data.confidence),
      fieldsUsedCount,
      totalFields,
      label: data.risk_label,
      source: "backend",
      record: data.saved_record || null
    };
  } catch (error) {
    if (error.isClientError) {
      throw error;
    }

    return estimatePredictionLocally(payload);
  }
}

function sanitizePercentage(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(number)));
}

function estimatePredictionLocally(payload) {
  let weightedTotal = 0;
  let activeWeight = 0;

  Object.entries(payload).forEach(([field, value]) => {
    const spec = FIELD_SCORERS[field];
    if (!spec) {
      return;
    }

    weightedTotal += spec.score(value) * spec.weight;
    activeWeight += spec.weight;
  });

  const risk = activeWeight ? Math.round(weightedTotal / activeWeight) : 0;
  const completeness = activeWeight ? activeWeight / TOTAL_WEIGHT : 0;
  const confidence = Math.round(clamp(58 + (completeness * 30) + Math.min(Math.abs(risk - 50) / 12, 6), 58, 94));
  const description = describeRisk(risk);

  return {
    risk,
    confidence,
    fieldsUsedCount: Object.keys(payload).length,
    totalFields: FIELD_IDS.length,
    label: description.label,
    source: "local-fallback",
    record: null
  };
}

function renderPredictionResult(result) {
  const risk = sanitizePercentage(result.risk);
  const { label, recommendation, toneClass, fillClass, badgeText } = describeRisk(risk);
  const resolvedLabel = result.label || label;
  const sourceLabel = result.source === "backend" ? "Source: Saved to Excel history" : "Source: Local estimate";

  resultScore.textContent = `${risk}%`;
  resultScore.className = `result-score ${toneClass}`;
  resultLabel.textContent = resolvedLabel;
  resultLabel.className = `result-label ${toneClass}`;
  resultConfidence.textContent = `Confidence: ${sanitizePercentage(result.confidence)}%`;
  resultCoverage.textContent = `Inputs used: ${result.fieldsUsedCount || 0}/${result.totalFields || FIELD_IDS.length}`;
  resultSource.textContent = sourceLabel;
  resultRecommendation.textContent = recommendation;
  resultBadge.textContent = badgeText;
  dietPlanLink.classList.remove("hidden");

  resultIcon.classList.remove("tone-low", "tone-medium", "tone-high");
  resultIconWrap.classList.remove("tone-low", "tone-medium", "tone-high");
  resultBadge.classList.remove("tone-low", "tone-medium", "tone-high");
  resultProgressBar.classList.remove("fill-low", "fill-medium", "fill-high");
  resultIcon.classList.add(toneClass);
  resultIconWrap.classList.add(toneClass);
  resultBadge.classList.add(toneClass);
  resultProgressBar.classList.add(fillClass);
  resultProgressBar.style.width = `${risk}%`;

  predictionResult.classList.remove("hidden");
}

function describeRisk(risk) {
  if (risk < 30) {
    return {
      label: "Low Risk",
      recommendation: "Your current pattern looks relatively stable. Continue regular movement, balanced meals, and routine checkups.",
      toneClass: "tone-low",
      fillClass: "fill-low",
      badgeText: "Stable Profile"
    };
  }

  if (risk < 60) {
    return {
      label: "Moderate Risk",
      recommendation: "This result suggests some areas need attention. Adding more health details and reviewing lifestyle habits with a clinician could help.",
      toneClass: "tone-medium",
      fillClass: "fill-medium",
      badgeText: "Needs Attention"
    };
  }

  return {
    label: "High Risk",
    recommendation: "This estimate suggests elevated heart risk. A doctor should review these values, symptoms, medications, and follow-up tests promptly.",
    toneClass: "tone-high",
    fillClass: "fill-high",
    badgeText: "High Alert"
  };
}

function buildLocalRecord(payload, result) {
  return {
    timestamp: new Date().toISOString(),
    risk: sanitizePercentage(result.risk),
    confidence: sanitizePercentage(result.confidence),
    risk_label: result.label || describeRisk(result.risk).label,
    fields_used_count: result.fieldsUsedCount || Object.keys(payload).length,
    total_fields: result.totalFields || FIELD_IDS.length,
    source: result.source,
    age: payload.age ?? "",
    sex: payload.sex ?? "",
    bmi: payload.bmi ?? "",
    cholesterol: payload.cholesterol ?? "",
    systolic_bp: payload.systolic_bp ?? "",
    diastolic_bp: payload.diastolic_bp ?? "",
    glucose: payload.glucose ?? "",
    physical_activity: payload.physical_activity ?? "",
    smoking: payload.smoking ?? "",
    hypertension: payload.hypertension ?? "",
    diabetes: payload.diabetes ?? "",
    heart_rate: payload.heart_rate ?? "",
    ejection_fraction: payload.ejection_fraction ?? "",
    serum_creatinine: payload.serum_creatinine ?? ""
  };
}

function storePrediction(record) {
  const history = JSON.parse(localStorage.getItem("predictions")) || [];
  history.push(record);
  localStorage.setItem("predictions", JSON.stringify(history.slice(-100)));
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
