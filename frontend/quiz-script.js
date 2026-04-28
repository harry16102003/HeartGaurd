const QUIZ_STORAGE_KEY = "healthAssessmentQuiz";

const quizQuestions = [
  {
    id: "mood_down",
    text: "1. How often have you felt down, depressed, or hopeless in the past two weeks?",
    factor: "mentalWellbeing",
    options: [
      { label: "Not at all", score: 0 },
      { label: "Several days", score: 1 },
      { label: "More than half the days", score: 2 },
      { label: "Nearly every day", score: 3 }
    ]
  },
  {
    id: "interest_loss",
    text: "2. How often do you feel little interest or pleasure in doing things?",
    factor: "mentalWellbeing",
    options: [
      { label: "Not at all", score: 0 },
      { label: "Several days", score: 1 },
      { label: "More than half the days", score: 2 },
      { label: "Nearly every day", score: 3 }
    ]
  },
  {
    id: "chest_pain",
    text: "3. How often do you experience chest pain or discomfort during physical activity?",
    factor: "heartSymptoms",
    options: [
      { label: "Never", score: 0 },
      { label: "Rarely", score: 1 },
      { label: "Sometimes", score: 2 },
      { label: "Often", score: 3 }
    ]
  },
  {
    id: "stress_level",
    text: "4. How would you rate your current stress level?",
    factor: "stress",
    options: [
      { label: "Very low", score: 0 },
      { label: "Low", score: 1 },
      { label: "Moderate", score: 2 },
      { label: "High", score: 3 },
      { label: "Very high", score: 4 }
    ]
  },
  {
    id: "exercise",
    text: "5. How many days per week do you exercise for at least 30 minutes?",
    factor: "activity",
    options: [
      { label: "5-7 days", score: 0 },
      { label: "3-4 days", score: 1 },
      { label: "1-2 days", score: 2 },
      { label: "None", score: 3 }
    ]
  },
  {
    id: "nutrition",
    text: "6. How many servings of fruits and vegetables do you eat daily?",
    factor: "nutrition",
    options: [
      { label: "5 or more", score: 0 },
      { label: "3-4", score: 1 },
      { label: "1-2", score: 2 },
      { label: "None", score: 3 }
    ]
  },
  {
    id: "sleep",
    text: "7. How much sleep do you typically get per night?",
    factor: "sleep",
    options: [
      { label: "7-9 hours", score: 0 },
      { label: "6-7 hours", score: 1 },
      { label: "5-6 hours", score: 2 },
      { label: "Less than 5 hours", score: 3 }
    ]
  },
  {
    id: "smoking",
    text: "8. Do you currently smoke or use tobacco products?",
    factor: "smoking",
    options: [
      { label: "Never", score: 0 },
      { label: "Quit more than a year ago", score: 1 },
      { label: "Quit recently", score: 2 },
      { label: "Yes, regularly", score: 4 }
    ]
  }
];

const factorInsights = {
  mentalWellbeing: "Your mood-related answers suggest checking in on stress, motivation, and emotional wellbeing.",
  heartSymptoms: "Chest discomfort during activity should never be ignored. Track symptoms and seek medical advice if it continues.",
  stress: "Stress can affect blood pressure, sleep, and heart strain. Small daily recovery habits can make a real difference.",
  activity: "Regular physical activity helps heart strength, blood sugar control, and overall energy.",
  nutrition: "Nutrition quality plays a major role in cholesterol, blood pressure, and long-term heart protection.",
  sleep: "Sleep supports recovery, hormone balance, and cardiovascular health. Improving sleep can improve overall risk.",
  smoking: "Avoiding tobacco is one of the strongest ways to protect heart and lung health."
};

let currentQuestionIndex = 0;
let selectedAnswers = [];

document.addEventListener("DOMContentLoaded", () => {
  bindQuizEvents();
  renderQuestion();
});

function bindQuizEvents() {
  document.getElementById("retakeQuizButton")?.addEventListener("click", resetQuiz);
}

function renderQuestion() {
  const question = quizQuestions[currentQuestionIndex];
  if (!question) {
    renderQuizResult();
    return;
  }

  const progressLabel = document.getElementById("quizProgressLabel");
  const progressFill = document.getElementById("quizProgressFill");
  const questionText = document.getElementById("quizQuestionText");
  const optionsWrap = document.getElementById("quizOptions");
  const quizCard = document.getElementById("quizCard");

  progressLabel.textContent = `Question ${currentQuestionIndex + 1} of ${quizQuestions.length}`;
  progressFill.style.width = `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%`;
  questionText.textContent = question.text;
  optionsWrap.innerHTML = "";

  question.options.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "quiz-option";
    button.innerHTML = `
      <span>${option.label}</span>
      <span class="quiz-option-arrow">&#8250;</span>
    `;

    button.addEventListener("click", () => {
      document.querySelectorAll(".quiz-option").forEach((item) => item.classList.remove("selected"));
      button.classList.add("selected");
      saveAnswer(question, option);
      quizCard.classList.remove("animating");
      void quizCard.offsetWidth;
      quizCard.classList.add("animating");
      setTimeout(() => {
        currentQuestionIndex += 1;
        renderQuestion();
      }, 240);
    });

    optionsWrap.appendChild(button);
  });
}

function saveAnswer(question, option) {
  selectedAnswers.push({
    questionId: question.id,
    factor: question.factor,
    label: option.label,
    score: option.score
  });
}

function renderQuizResult() {
  const quizCard = document.getElementById("quizCard");
  const resultCard = document.getElementById("quizResultCard");
  const resultIcon = document.getElementById("quizResultIcon");
  const resultTitle = document.getElementById("quizResultTitle");
  const resultSummary = document.getElementById("quizResultSummary");
  const resultScore = document.getElementById("quizResultScore");
  const resultProgressFill = document.getElementById("quizResultProgressFill");
  const highlightsWrap = document.getElementById("quizResultHighlights");

  const totalScore = selectedAnswers.reduce((sum, answer) => sum + answer.score, 0);
  const maxScore = quizQuestions.reduce((sum, question) => {
    const maxOptionScore = Math.max(...question.options.map((option) => option.score));
    return sum + maxOptionScore;
  }, 0);
  const percent = Math.round((totalScore / maxScore) * 100);

  const resultMeta = getResultMeta(percent);
  const focusAreas = getTopFocusAreas();

  quizCard.classList.add("hidden");
  resultCard.classList.remove("hidden");

  resultIcon.className = `result-icon ${resultMeta.className}`;
  resultIcon.innerHTML = resultMeta.icon;
  resultTitle.className = `result-title-${resultMeta.className}`;
  resultTitle.textContent = resultMeta.title;
  resultSummary.textContent = resultMeta.summary;
  resultScore.textContent = `Score: ${totalScore}/${maxScore} (${percent}%)`;
  resultProgressFill.style.width = `${percent}%`;
  resultProgressFill.style.background = resultMeta.progress;

  highlightsWrap.innerHTML = "";
  focusAreas.forEach((item) => {
    const card = document.createElement("div");
    card.className = "highlight-item";
    card.textContent = item;
    highlightsWrap.appendChild(card);
  });

  localStorage.setItem(
    QUIZ_STORAGE_KEY,
    JSON.stringify({
      takenAt: new Date().toISOString(),
      totalScore,
      maxScore,
      percent,
      level: resultMeta.title,
      answers: selectedAnswers
    })
  );
}

function getResultMeta(percent) {
  if (percent <= 20) {
    return {
      title: "Excellent",
      className: "excellent",
      summary: "Your current habits look heart-friendly overall. Keep maintaining these routines and continue regular checkups.",
      progress: "linear-gradient(90deg, #29d466, #29d466)",
      icon: `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 3C7.03 3 3 7.03 3 12C3 16.97 7.03 21 12 21C16.97 21 21 16.97 21 12"></path>
          <path d="M8 12L11 15L20 6"></path>
        </svg>
      `
    };
  }

  if (percent <= 40) {
    return {
      title: "Good",
      className: "good",
      summary: "You are doing many things well, but a few habits could still be improved to protect your long-term health.",
      progress: "linear-gradient(90deg, #11dfcd, #11dfcd)",
      icon: `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 20C16.42 20 20 16.42 20 12C20 7.58 16.42 4 12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20Z"></path>
          <path d="M8 13C9 14 10.2 14.5 12 14.5C13.8 14.5 15 14 16 13"></path>
          <path d="M9 10H9.01"></path>
          <path d="M15 10H15.01"></path>
        </svg>
      `
    };
  }

  if (percent <= 65) {
    return {
      title: "Needs Attention",
      className: "moderate",
      summary: "Some responses suggest habits or symptoms that deserve attention. Small changes now can make a meaningful difference.",
      progress: "linear-gradient(90deg, #ffb302, #ffcc55)",
      icon: `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 9V13"></path>
          <path d="M12 17H12.01"></path>
          <path d="M10.29 3.86L1.82 18C1.64 18.31 1.55 18.66 1.55 19C1.55 20.1 2.45 21 3.55 21H20.45C21.55 21 22.45 20.1 22.45 19C22.45 18.66 22.36 18.31 22.18 18L13.71 3.86C13.35 3.25 12.69 2.87 12 2.87C11.31 2.87 10.65 3.25 10.29 3.86Z"></path>
        </svg>
      `
    };
  }

  return {
    title: "High Risk",
    className: "high",
    summary: "Several answers point to elevated health risk. Consider speaking with a healthcare professional and prioritizing follow-up care.",
    progress: "linear-gradient(90deg, #ff6359, #ff3b30)",
    icon: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 9V13"></path>
        <path d="M12 17H12.01"></path>
        <path d="M10.29 3.86L1.82 18C1.64 18.31 1.55 18.66 1.55 19C1.55 20.1 2.45 21 3.55 21H20.45C21.55 21 22.45 20.1 22.45 19C22.45 18.66 22.36 18.31 22.18 18L13.71 3.86C13.35 3.25 12.69 2.87 12 2.87C11.31 2.87 10.65 3.25 10.29 3.86Z"></path>
      </svg>
    `
  };
}

function getTopFocusAreas() {
  const factorScores = {};

  selectedAnswers.forEach((answer) => {
    factorScores[answer.factor] = (factorScores[answer.factor] || 0) + answer.score;
  });

  const ordered = Object.entries(factorScores)
    .sort((a, b) => b[1] - a[1])
    .filter(([, score]) => score > 0)
    .slice(0, 3)
    .map(([factor]) => factorInsights[factor]);

  if (!ordered.length) {
    return [
      "Your answers did not show any strong risk signals in this quiz.",
      "Keep monitoring stress, activity, nutrition, and sleep to stay on track.",
      "Use the dashboard regularly to log your health habits and trends."
    ];
  }

  return ordered;
}

function resetQuiz() {
  currentQuestionIndex = 0;
  selectedAnswers = [];
  document.getElementById("quizCard").classList.remove("hidden");
  document.getElementById("quizResultCard").classList.add("hidden");
  renderQuestion();
}
