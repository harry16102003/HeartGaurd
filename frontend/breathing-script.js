const breathingModes = {
  478: {
    name: "4-7-8 Relaxation",
    description: "Classic anxiety relief technique",
    patternText: "Inhale 4s | Hold 7s | Exhale 8s",
    phases: [
      { label: "Inhale", seconds: 4, state: "inhale" },
      { label: "Hold", seconds: 7, state: "hold" },
      { label: "Exhale", seconds: 8, state: "exhale" }
    ]
  },
  444: {
    name: "Box Breathing",
    description: "Used by Navy SEALs for focus",
    patternText: "Inhale 4s | Hold 4s | Exhale 4s",
    phases: [
      { label: "Inhale", seconds: 4, state: "inhale" },
      { label: "Hold", seconds: 4, state: "hold" },
      { label: "Exhale", seconds: 4, state: "exhale" }
    ]
  },
  5510: {
    name: "Deep Calm",
    description: "Deep relaxation and sleep aid",
    patternText: "Inhale 5s | Hold 5s | Exhale 10s",
    phases: [
      { label: "Inhale", seconds: 5, state: "inhale" },
      { label: "Hold", seconds: 5, state: "hold" },
      { label: "Exhale", seconds: 10, state: "exhale" }
    ]
  }
};

let activeModeKey = "478";
let currentPhaseIndex = 0;
let currentSecondsLeft = 0;
let cyclesCompleted = 0;
let running = false;
let timerId = null;

document.addEventListener("DOMContentLoaded", () => {
  bindBreathingEvents();
  applyMode(activeModeKey);
  resetBreathingSession();
});

function bindBreathingEvents() {
  document.querySelectorAll(".exercise-chip").forEach((button) => {
    button.addEventListener("click", () => {
      const nextMode = button.dataset.exercise;
      if (!nextMode || nextMode === activeModeKey) return;

      activeModeKey = nextMode;
      applyMode(activeModeKey);
      resetBreathingSession();
    });
  });

  document.getElementById("breathingStartPause")?.addEventListener("click", toggleBreathing);
  document.getElementById("breathingReset")?.addEventListener("click", resetBreathingSession);
}

function applyMode(modeKey) {
  const mode = breathingModes[modeKey];
  if (!mode) return;

  document.querySelectorAll(".exercise-chip").forEach((button) => {
    button.classList.toggle("active", button.dataset.exercise === modeKey);
  });

  document.getElementById("exerciseDescription").textContent = mode.description;
  document.getElementById("exercisePattern").textContent = mode.patternText;
}

function toggleBreathing() {
  if (running) {
    pauseBreathing();
  } else {
    startBreathing();
  }
}

function startBreathing() {
  if (running) return;

  running = true;

  if (currentSecondsLeft <= 0) {
    currentPhaseIndex = 0;
    currentSecondsLeft = getCurrentPhase().seconds;
  }

  updateStartPauseButton();
  renderBreathingState();

  timerId = window.setInterval(() => {
    currentSecondsLeft -= 1;

    if (currentSecondsLeft <= 0) {
      currentPhaseIndex += 1;

      if (currentPhaseIndex >= breathingModes[activeModeKey].phases.length) {
        currentPhaseIndex = 0;
        cyclesCompleted += 1;
        document.getElementById("breathingCycles").textContent = String(cyclesCompleted);
      }

      currentSecondsLeft = getCurrentPhase().seconds;
    }

    renderBreathingState();
  }, 1000);
}

function pauseBreathing() {
  running = false;
  clearInterval(timerId);
  timerId = null;
  updateStartPauseButton();
}

function resetBreathingSession() {
  running = false;
  clearInterval(timerId);
  timerId = null;
  currentPhaseIndex = 0;
  currentSecondsLeft = 0;
  cyclesCompleted = 0;
  document.getElementById("breathingCycles").textContent = "0";
  updateStartPauseButton();
  renderReadyState();
}

function getCurrentPhase() {
  return breathingModes[activeModeKey].phases[currentPhaseIndex];
}

function renderBreathingState() {
  const phase = getCurrentPhase();
  const orb = document.getElementById("breathingOrb");
  orb.className = `breathing-orb ${phase.state}`;
  document.getElementById("breathingCounter").textContent = String(currentSecondsLeft);
  document.getElementById("breathingPhase").textContent = phase.label;
}

function renderReadyState() {
  const orb = document.getElementById("breathingOrb");
  orb.className = "breathing-orb ready";
  document.getElementById("breathingCounter").textContent = "-";
  document.getElementById("breathingPhase").textContent = "Ready";
}

function updateStartPauseButton() {
  const icon = document.getElementById("startPauseIcon");
  const label = document.getElementById("startPauseLabel");

  if (running) {
    icon.textContent = "II";
    label.textContent = "Pause";
  } else {
    icon.textContent = ">";
    label.textContent = "Start";
  }
}
