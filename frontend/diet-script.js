const DEFAULT_DOCTOR_API_BASE = "https://heartgaurd.onrender.com";
const DOCTOR_API_OVERRIDE_KEY = "heartguardDoctorApiBase";
const PORTAL_ROLE_KEY = "heartguardPortalRole";

function normalizeApiBaseUrl(value) {
  return typeof value === "string" ? value.trim().replace(/\/+$/, "") : "";
}

function resolveCurrentOrigin() {
  return window.location.protocol === "file:" ? "http://127.0.0.1:8000" : window.location.origin;
}

function resolveDoctorApiBase() {
  const override = normalizeApiBaseUrl(localStorage.getItem(DOCTOR_API_OVERRIDE_KEY));
  if (override) {
    return override;
  }

  if (window.location.hostname === "heartgaurd.onrender.com") {
    return resolveCurrentOrigin();
  }

  return DEFAULT_DOCTOR_API_BASE;
}

function isDoctorPortal() {
  return window.location.hostname === "heartgaurd.onrender.com" || localStorage.getItem(PORTAL_ROLE_KEY) === "doctor";
}

const API_BASE_URL = resolveDoctorApiBase();
const DEFAULT_CALORIE_GOAL = 2000;
const MEALS_KEY = "dietMeals";
const WATER_KEY = "dietWater";

let currentCalorieGoal = DEFAULT_CALORIE_GOAL;
let activeMealPlans = [];

const mealSearchInput = document.getElementById("mealSearchInput");
const mealCaloriesInput = document.getElementById("mealCaloriesInput");
const mealTypeInput = document.getElementById("mealTypeInput");
const mealSuggestions = document.getElementById("mealSuggestions");
const addMealButton = document.getElementById("addMealButton");
const addWaterButton = document.getElementById("addWaterButton");
const loggedMeals = document.getElementById("loggedMeals");
const quickAddChips = document.getElementById("quickAddChips");
const mealPlanCards = document.getElementById("mealPlanCards");

const caloriesToday = document.getElementById("caloriesToday");
const caloriesProgress = document.getElementById("caloriesProgress");
const caloriesGoalText = document.getElementById("caloriesGoalText");
const waterToday = document.getElementById("waterToday");
const waterVisual = document.getElementById("waterVisual");
const mealsToday = document.getElementById("mealsToday");
const mealStatusText = document.getElementById("mealStatusText");

const dietRecommendationHeading = document.getElementById("dietRecommendationHeading");
const dietRiskBadge = document.getElementById("dietRiskBadge");
const dietRecommendationText = document.getElementById("dietRecommendationText");
const dietRecommendationMeta = document.getElementById("dietRecommendationMeta");
const dietFocusChips = document.getElementById("dietFocusChips");
const dietAvoidChips = document.getElementById("dietAvoidChips");
const mealPlanSectionTitle = document.getElementById("mealPlanSectionTitle");
const mealPlanSectionText = document.getElementById("mealPlanSectionText");

const mealLibrary = [
  { name: "Oatmeal with berries & walnuts", calories: 350, type: "Breakfast", icon: "🥣", tags: ["cholesterol", "weight", "sugar"] },
  { name: "Greek yogurt with seeds & fruit", calories: 290, type: "Breakfast", icon: "🥣", tags: ["heart", "sugar"] },
  { name: "Vegetable omelet with whole-grain toast", calories: 320, type: "Breakfast", icon: "🍳", tags: ["heart", "weight"] },
  { name: "Besan chilla with mint curd", calories: 310, type: "Breakfast", icon: "🫓", tags: ["sugar", "weight"] },
  { name: "Apple with almond butter", calories: 200, type: "Snack", icon: "🍎", tags: ["cholesterol", "weight"] },
  { name: "Hummus with veggie sticks", calories: 150, type: "Snack", icon: "🥕", tags: ["sodium", "sugar"] },
  { name: "Handful of almonds", calories: 160, type: "Snack", icon: "🥜", tags: ["cholesterol", "heart"] },
  { name: "Guava or pear", calories: 120, type: "Snack", icon: "🍐", tags: ["sugar", "weight"] },
  { name: "Grilled salmon with quinoa salad", calories: 500, type: "Lunch", icon: "🐟", tags: ["cholesterol", "heart"] },
  { name: "Brown rice, dal & sauteed vegetables", calories: 460, type: "Lunch", icon: "🍚", tags: ["sodium", "sugar"] },
  { name: "Moong dal khichdi with vegetables", calories: 390, type: "Lunch", icon: "🥣", tags: ["sodium", "sugar", "weight"] },
  { name: "Whole-wheat pasta with olive oil & tomatoes", calories: 480, type: "Lunch", icon: "🍝", tags: ["heart"] },
  { name: "Chicken breast with steamed vegetables", calories: 450, type: "Dinner", icon: "🍗", tags: ["weight", "sugar"] },
  { name: "Grilled fish with roasted vegetables", calories: 420, type: "Dinner", icon: "🐟", tags: ["cholesterol", "heart"] },
  { name: "Mediterranean bowl", calories: 520, type: "Dinner", icon: "🥗", tags: ["heart", "cholesterol"] },
  { name: "Lentil soup with salad", calories: 360, type: "Dinner", icon: "🥣", tags: ["sodium", "weight"] }
];

const mealIndex = Object.fromEntries(mealLibrary.map((meal) => [meal.name, meal]));

const PLAN_LIBRARY = {
  "heart-balance": {
    eyebrow: "Balanced",
    title: "Heart Balance Day",
    description: "A dependable whole-food plan with fiber, lean protein, and steady meals through the day.",
    meals: [
      getMeal("Oatmeal with berries & walnuts"),
      getMeal("Apple with almond butter"),
      getMeal("Grilled salmon with quinoa salad"),
      getMeal("Handful of almonds"),
      getMeal("Chicken breast with steamed vegetables")
    ]
  },
  "low-sodium": {
    eyebrow: "Blood pressure support",
    title: "Lower Sodium Plan",
    description: "Built to reduce excess salt while keeping potassium-rich and fresh foods in the mix.",
    meals: [
      getMeal("Vegetable omelet with whole-grain toast"),
      getMeal("Hummus with veggie sticks"),
      getMeal("Brown rice, dal & sauteed vegetables"),
      getMeal("Guava or pear"),
      getMeal("Lentil soup with salad")
    ]
  },
  "steady-sugar": {
    eyebrow: "Glucose steady",
    title: "Steady Sugar Plan",
    description: "Pairs fiber and protein to help avoid sharp spikes from refined carbohydrates or sweets.",
    meals: [
      getMeal("Besan chilla with mint curd"),
      getMeal("Guava or pear"),
      getMeal("Moong dal khichdi with vegetables"),
      getMeal("Handful of almonds"),
      getMeal("Chicken breast with steamed vegetables")
    ]
  },
  "cholesterol-support": {
    eyebrow: "Lipid friendly",
    title: "Cholesterol Support Plan",
    description: "Leans on oats, legumes, fish, nuts, and olive-oil-style meals while limiting heavy fried options.",
    meals: [
      getMeal("Oatmeal with berries & walnuts"),
      getMeal("Apple with almond butter"),
      getMeal("Grilled salmon with quinoa salad"),
      getMeal("Hummus with veggie sticks"),
      getMeal("Mediterranean bowl")
    ]
  },
  "weight-balance": {
    eyebrow: "Portion aware",
    title: "Weight Balance Plan",
    description: "Moderate calories, high fiber, and simpler plates to support gradual and sustainable weight control.",
    meals: [
      getMeal("Greek yogurt with seeds & fruit"),
      getMeal("Guava or pear"),
      getMeal("Moong dal khichdi with vegetables"),
      getMeal("Hummus with veggie sticks"),
      getMeal("Lentil soup with salad")
    ]
  },
  "recovery": {
    eyebrow: "Best match",
    title: "Protective Heart Plan",
    description: "A tighter, more protective pattern for higher-risk profiles with extra focus on low-salt, high-fiber meals.",
    meals: [
      getMeal("Oatmeal with berries & walnuts"),
      getMeal("Hummus with veggie sticks"),
      getMeal("Brown rice, dal & sauteed vegetables"),
      getMeal("Handful of almonds"),
      getMeal("Grilled fish with roasted vegetables")
    ]
  },
  "maintain-wellness": {
    eyebrow: "Maintenance",
    title: "Maintain Good Momentum",
    description: "For lower-risk days, this keeps variety and heart-friendly habits in place without being restrictive.",
    meals: [
      getMeal("Greek yogurt with seeds & fruit"),
      getMeal("Apple with almond butter"),
      getMeal("Whole-wheat pasta with olive oil & tomatoes"),
      getMeal("Handful of almonds"),
      getMeal("Mediterranean bowl")
    ]
  }
};

initializeDietPage();

async function initializeDietPage() {
  const latestPrediction = await loadLatestPrediction();
  const profile = buildDietProfile(latestPrediction);

  currentCalorieGoal = profile.calorieGoal;
  renderDietRecommendation(profile, latestPrediction);
  renderQuickChips(profile);
  renderMealPlans(profile);
  renderDietData();

  mealSearchInput.addEventListener("input", handleMealSearch);
  mealSearchInput.addEventListener("focus", handleMealSearch);
  document.addEventListener("click", handleOutsideSuggestionClick);
  addMealButton.addEventListener("click", addMealFromInputs);
  addWaterButton.addEventListener("click", addWaterGlass);
}

async function loadLatestPrediction() {
  if (!isDoctorPortal()) {
    const localPredictions = JSON.parse(localStorage.getItem("predictions")) || [];
    const normalizedLocal = normalizePredictions(localPredictions);
    return normalizedLocal.length ? normalizedLocal[normalizedLocal.length - 1] : null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/predictions`);
    if (!response.ok) {
      throw new Error(`History request failed with ${response.status}`);
    }

    const data = await response.json();
    const normalized = normalizePredictions(Array.isArray(data.items) ? data.items : []);
    if (normalized.length) {
      return normalized[normalized.length - 1];
    }
  } catch (error) {
    // Fall back to local history when the backend is unavailable.
  }

  const localPredictions = JSON.parse(localStorage.getItem("predictions")) || [];
  const normalized = normalizePredictions(localPredictions);
  return normalized.length ? normalized[normalized.length - 1] : null;
}

function normalizePredictions(items) {
  return items
    .map((item, index) => ({
      risk: numberOrNull(item.risk ?? item.final_risk_percentage) ?? 0,
      confidence: numberOrNull(item.confidence) ?? 0,
      label: item.risk_label || resolveRiskLabel(numberOrNull(item.risk ?? item.final_risk_percentage) ?? 0),
      fieldsUsedCount: numberOrNull(item.fields_used_count ?? item.fieldsUsedCount) ?? 0,
      totalFields: numberOrNull(item.total_fields ?? item.totalFields) ?? 14,
      bmi: numberOrNull(item.bmi),
      cholesterol: numberOrNull(item.cholesterol),
      systolic_bp: numberOrNull(item.systolic_bp),
      diastolic_bp: numberOrNull(item.diastolic_bp),
      glucose: numberOrNull(item.glucose),
      physical_activity: numberOrNull(item.physical_activity),
      diabetes: numberOrNull(item.diabetes),
      hypertension: numberOrNull(item.hypertension),
      smoking: numberOrNull(item.smoking),
      date: item.timestamp || item.date || item.createdAt || buildFallbackDate(index),
      source: item.source || "prediction"
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));
}

function buildDietProfile(prediction) {
  const baseFocus = [
    "Vegetables at most meals",
    "Whole grains and oats",
    "Lean protein or legumes",
    "Water through the day"
  ];
  const baseAvoid = [
    "Deep-fried foods",
    "Packaged salty snacks",
    "Sugary drinks",
    "Very heavy late-night meals"
  ];

  const profile = {
    heading: "Heart-healthy starter plan",
    summary: "Use the Predict page to unlock a more personalized meal strategy based on your latest saved heart-risk profile.",
    meta: "When a prediction is available, this page will adapt calories and meal plans for easier day-to-day guidance.",
    calorieGoal: DEFAULT_CALORIE_GOAL,
    focus: baseFocus,
    avoid: baseAvoid,
    planKeys: ["heart-balance", "maintain-wellness", "cholesterol-support"],
    sectionTitle: "Suggested Meal Plans",
    sectionText: "Tap any meal below to add it instantly to your daily tracker."
  };

  if (!prediction) {
    return profile;
  }

  const notes = [];
  const planKeys = [];

  profile.sectionTitle = "Meal Plans Based on Your Latest Prediction";
  profile.sectionText = "These plans were prioritized from your latest saved health profile. Tap any meal below to add it instantly.";

  if (prediction.risk >= 60) {
    profile.heading = "Protective meal plan for higher-risk days";
    notes.push("keeping meals lower in salt and heavier on fiber");
    planKeys.push("recovery");
  } else if (prediction.risk >= 30) {
    profile.heading = "Balanced meal plan for steady improvement";
    notes.push("steadying blood pressure, cholesterol, and blood sugar through simpler meals");
    planKeys.push("heart-balance");
  } else {
    profile.heading = "Maintain-your-progress meal plan";
    notes.push("protecting your current momentum with consistent heart-friendly choices");
    planKeys.push("maintain-wellness");
  }

  if ((prediction.hypertension ?? 0) === 1 || (prediction.systolic_bp ?? 0) >= 130 || (prediction.diastolic_bp ?? 0) >= 85) {
    profile.focus.push("Low-sodium home-style meals");
    profile.focus.push("Potassium-rich foods like dal, spinach, banana");
    profile.avoid.push("Pickles, papad, instant soups, extra table salt");
    notes.push("reducing sodium to support blood pressure");
    planKeys.unshift("low-sodium");
  }

  if ((prediction.diabetes ?? 0) === 1 || (prediction.glucose ?? 0) >= 126) {
    profile.focus.push("Protein with each meal");
    profile.focus.push("High-fiber carbs in smaller portions");
    profile.avoid.push("Sweet drinks and dessert-heavy snacks");
    profile.calorieGoal = Math.min(profile.calorieGoal, 1900);
    notes.push("keeping sugar more stable through the day");
    planKeys.unshift("steady-sugar");
  }

  if ((prediction.cholesterol ?? 0) >= 200) {
    profile.focus.push("Oats, beans, nuts, and fish");
    profile.avoid.push("Fatty red meat and repeat fried foods");
    notes.push("supporting healthier cholesterol choices");
    planKeys.unshift("cholesterol-support");
  }

  if ((prediction.bmi ?? 0) >= 25) {
    profile.focus.push("Portion-aware plates");
    profile.focus.push("Lighter dinners with more vegetables");
    profile.avoid.push("Large refined-carb portions");
    profile.calorieGoal = Math.min(profile.calorieGoal, 1800);
    notes.push("making calories easier to manage without crash dieting");
    planKeys.unshift("weight-balance");
  }

  if ((prediction.physical_activity ?? 0) > 0 && prediction.physical_activity < 2) {
    profile.focus.push("Repeatable, easy-to-prep meals");
    notes.push("keeping the plan simple enough to follow consistently");
  }

  profile.focus = uniqueList(profile.focus).slice(0, 6);
  profile.avoid = uniqueList(profile.avoid).slice(0, 6);
  profile.planKeys = uniqueList([...planKeys, "heart-balance", "maintain-wellness"]).filter((key) => PLAN_LIBRARY[key]).slice(0, 3);
  profile.summary = `Your latest ${prediction.label.toLowerCase()} profile suggests focusing on ${notes.length ? notes.join(", ") : "steady heart-healthy habits"}.`;
  profile.meta = `Based on your latest saved prediction: ${Math.round(prediction.risk)}% risk, ${Math.round(prediction.confidence)}% confidence, using ${prediction.fieldsUsedCount}/${prediction.totalFields} inputs. Daily calorie target adjusted to about ${profile.calorieGoal} kcal.`;

  return profile;
}

function renderDietRecommendation(profile, prediction) {
  dietRecommendationHeading.textContent = profile.heading;
  dietRecommendationText.textContent = profile.summary;
  dietRecommendationMeta.textContent = profile.meta;
  mealPlanSectionTitle.textContent = profile.sectionTitle;
  mealPlanSectionText.textContent = profile.sectionText;

  renderGuidanceChips(dietFocusChips, profile.focus);
  renderGuidanceChips(dietAvoidChips, profile.avoid);

  if (!prediction) {
    dietRiskBadge.textContent = "Waiting for prediction";
    dietRiskBadge.className = "diet-risk-badge neutral";
    return;
  }

  const tone = prediction.risk >= 60 ? "high" : prediction.risk >= 30 ? "moderate" : "low";
  dietRiskBadge.textContent = `${prediction.label} · ${Math.round(prediction.risk)}%`;
  dietRiskBadge.className = `diet-risk-badge ${tone}`;
}

function renderGuidanceChips(container, items) {
  container.innerHTML = items
    .map((item) => `<span class="diet-guidance-chip">${escapeHtml(item)}</span>`)
    .join("");
}

function renderQuickChips(profile) {
  const names = uniqueList(
    profile.planKeys
      .flatMap((key) => PLAN_LIBRARY[key]?.meals || [])
      .map((meal) => meal.name)
  ).slice(0, 6);

  quickAddChips.innerHTML = names
    .map((name) => `<button class="quick-chip" type="button" data-name="${escapeAttribute(name)}">${escapeHtml(name)}</button>`)
    .join("");

  quickAddChips.querySelectorAll(".quick-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      const meal = mealIndex[chip.dataset.name];
      if (meal) {
        populateMealInputs(meal);
      }
    });
  });
}

function renderMealPlans(profile) {
  activeMealPlans = profile.planKeys.map((key) => PLAN_LIBRARY[key]).filter(Boolean);

  mealPlanCards.innerHTML = activeMealPlans
    .map((plan, index) => {
      const total = plan.meals.reduce((sum, meal) => sum + meal.calories, 0);
      return `
        <article class="meal-plan-card">
          <div class="meal-plan-eyebrow">${escapeHtml(plan.eyebrow)}</div>
          <div class="meal-plan-title">${escapeHtml(plan.title)}</div>
          <div class="meal-plan-description">${escapeHtml(plan.description)}</div>
          <div class="meal-plan-list">
            ${plan.meals
              .map((meal) => `
                <div class="meal-plan-item">
                  <div class="meal-plan-left">
                    <div class="meal-plan-icon">${meal.icon}</div>
                    <div>
                      <div class="meal-plan-name">${escapeHtml(meal.name)}</div>
                      <div class="meal-plan-type">${meal.type}</div>
                    </div>
                  </div>
                  <div class="meal-plan-actions">
                    <div class="meal-plan-calories">${meal.calories} kcal</div>
                    <button class="plan-add" type="button" data-plan="${index}" data-name="${escapeAttribute(meal.name)}">Add</button>
                  </div>
                </div>
              `)
              .join("")}
          </div>
          <div class="meal-plan-total">Total: ${total} kcal</div>
        </article>
      `;
    })
    .join("");

  mealPlanCards.querySelectorAll(".plan-add").forEach((button) => {
    button.addEventListener("click", () => {
      const plan = activeMealPlans[Number(button.dataset.plan)];
      const meal = plan?.meals.find((entry) => entry.name === button.dataset.name);
      if (!meal) {
        return;
      }

      populateMealInputs(meal);
      addMealFromInputs();
    });
  });
}

function getMeal(name) {
  return { ...mealIndex[name] };
}

function resolveRiskLabel(risk) {
  if (risk < 30) {
    return "Low Risk";
  }
  if (risk < 60) {
    return "Moderate Risk";
  }
  return "High Risk";
}

function uniqueList(items) {
  return [...new Set(items.filter(Boolean))];
}

function numberOrNull(value) {
  if (value === "" || value === null || value === undefined) {
    return null;
  }

  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function buildFallbackDate(index) {
  const date = new Date();
  date.setMinutes(date.getMinutes() - Math.max(0, 2 - index));
  return date.toISOString();
}

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function loadMeals() {
  return JSON.parse(localStorage.getItem(MEALS_KEY)) || [];
}

function saveMeals(meals) {
  localStorage.setItem(MEALS_KEY, JSON.stringify(meals));
}

function loadWater() {
  return JSON.parse(localStorage.getItem(WATER_KEY)) || {};
}

function saveWater(water) {
  localStorage.setItem(WATER_KEY, JSON.stringify(water));
}

function getTodayMeals() {
  return loadMeals().filter((meal) => meal.date === getTodayKey());
}

function renderDietData() {
  const meals = getTodayMeals();
  const totalCalories = meals.reduce((sum, meal) => sum + Number(meal.calories || 0), 0);
  const water = loadWater();
  const todayWater = Number(water[getTodayKey()] || 0);

  caloriesToday.textContent = totalCalories;
  caloriesGoalText.textContent = `${totalCalories}/${currentCalorieGoal} kcal goal`;
  caloriesProgress.style.width = `${Math.min((totalCalories / currentCalorieGoal) * 100, 100)}%`;

  waterToday.textContent = todayWater;
  mealsToday.textContent = meals.length;
  mealStatusText.textContent = meals.length
    ? `${meals.length} meal${meals.length === 1 ? "" : "s"} tracked for today`
    : "Nothing logged yet";

  renderWaterVisual(todayWater);
  renderLoggedMeals(meals);
}

function renderWaterVisual(count) {
  const totalDots = Math.max(8, count);
  waterVisual.innerHTML = Array.from({ length: totalDots }, (_, index) => {
    const filled = index < count ? "filled" : "";
    return `<span class="water-dot ${filled}"></span>`;
  }).join("");
}

function renderLoggedMeals(meals) {
  if (!meals.length) {
    loggedMeals.className = "logged-meals empty";
    loggedMeals.innerHTML = "";
    return;
  }

  loggedMeals.className = "logged-meals";
  loggedMeals.innerHTML = meals
    .slice()
    .reverse()
    .map((meal) => `
      <div class="logged-meal-item">
        <div class="logged-meal-main">
          <div class="logged-meal-name">${escapeHtml(meal.name)}</div>
          <div class="logged-meal-meta">${meal.type} · ${formatTime(meal.createdAt)}</div>
        </div>
        <div class="logged-meal-right">
          <div class="logged-meal-calories">${meal.calories} kcal</div>
          <button class="delete-meal" type="button" data-id="${meal.id}" aria-label="Delete meal">
            <svg viewBox="0 0 24 24">
              <path d="M6 7H18"></path>
              <path d="M9 7V5H15V7"></path>
              <path d="M8 7V19H16V7"></path>
              <path d="M10 11V15"></path>
              <path d="M14 11V15"></path>
            </svg>
          </button>
        </div>
      </div>
    `)
    .join("");

  loggedMeals.querySelectorAll(".delete-meal").forEach((button) => {
    button.addEventListener("click", () => deleteMeal(button.dataset.id));
  });
}

function addWaterGlass() {
  const water = loadWater();
  const todayKey = getTodayKey();
  water[todayKey] = Number(water[todayKey] || 0) + 1;
  saveWater(water);
  renderDietData();
}

function handleMealSearch() {
  const query = mealSearchInput.value.trim().toLowerCase();
  const matches = mealLibrary
    .filter((meal) => meal.name.toLowerCase().includes(query))
    .slice(0, 6);

  if (!query) {
    mealSuggestions.classList.add("hidden");
    mealSuggestions.innerHTML = "";
    return;
  }

  if (!matches.length) {
    mealSuggestions.classList.remove("hidden");
    mealSuggestions.innerHTML = `
      <div class="suggestion-item">
        <div>
          <div>No exact match</div>
          <div class="suggestion-meta">You can still add this meal manually.</div>
        </div>
      </div>
    `;
    return;
  }

  mealSuggestions.classList.remove("hidden");
  mealSuggestions.innerHTML = matches
    .map((meal) => `
      <div class="suggestion-item" data-name="${escapeAttribute(meal.name)}">
        <div>
          <div>${escapeHtml(meal.name)}</div>
          <div class="suggestion-meta">${meal.type}</div>
        </div>
        <div class="suggestion-calories">${meal.calories} kcal</div>
      </div>
    `)
    .join("");

  mealSuggestions.querySelectorAll(".suggestion-item[data-name]").forEach((item) => {
    item.addEventListener("click", () => {
      const meal = mealIndex[item.dataset.name];
      if (!meal) {
        return;
      }

      populateMealInputs(meal);
      mealSuggestions.classList.add("hidden");
    });
  });
}

function populateMealInputs(meal) {
  mealSearchInput.value = meal.name;
  mealCaloriesInput.value = meal.calories;
  mealTypeInput.value = meal.type;
}

function handleOutsideSuggestionClick(event) {
  if (!event.target.closest(".meal-search-wrap")) {
    mealSuggestions.classList.add("hidden");
  }
}

function addMealFromInputs() {
  const name = mealSearchInput.value.trim();
  const calories = Number(mealCaloriesInput.value);
  const type = mealTypeInput.value;

  if (!name || !Number.isFinite(calories) || calories <= 0) {
    return;
  }

  const meals = loadMeals();
  meals.push({
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    date: getTodayKey(),
    name,
    calories: Math.round(calories),
    type,
    createdAt: new Date().toISOString()
  });

  saveMeals(meals);
  mealSearchInput.value = "";
  mealCaloriesInput.value = "";
  mealTypeInput.value = "Breakfast";
  mealSuggestions.classList.add("hidden");
  renderDietData();
}

function deleteMeal(id) {
  const meals = loadMeals().filter((meal) => meal.id !== id);
  saveMeals(meals);
  renderDietData();
}

function formatTime(value) {
  const date = new Date(value);
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeAttribute(value) {
  return escapeHtml(value);
}
