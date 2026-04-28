const MEDS_KEY = "medicationsTracker";

const seedMeds = [
  { id: "med-1", name: "Aspirin", dosage: "75mg", time: "08:00", taken: false },
  { id: "med-2", name: "Atorvastatin", dosage: "20mg", time: "21:00", taken: false }
];

document.addEventListener("DOMContentLoaded", () => {
  ensureSeedMeds();
  bindMedicationEvents();
  renderMedications();
});

function ensureSeedMeds() {
  if (!localStorage.getItem(MEDS_KEY)) {
    localStorage.setItem(MEDS_KEY, JSON.stringify(seedMeds));
  }
}

function bindMedicationEvents() {
  document.getElementById("toggleMedicationForm")?.addEventListener("click", toggleMedicationForm);
  document.getElementById("addMedicationButton")?.addEventListener("click", addMedication);
}

function getMeds() {
  try {
    return JSON.parse(localStorage.getItem(MEDS_KEY) || "[]");
  } catch (error) {
    return [];
  }
}

function setMeds(meds) {
  localStorage.setItem(MEDS_KEY, JSON.stringify(meds));
}

function toggleMedicationForm() {
  const form = document.getElementById("medFormCard");
  const button = document.getElementById("toggleMedicationForm");
  const isHidden = form.classList.contains("hidden");

  form.classList.toggle("hidden");
  button.textContent = isHidden ? "X Cancel" : "+ Add";
}

function addMedication() {
  const name = document.getElementById("medNameInput").value.trim();
  const dosage = document.getElementById("medDosageInput").value.trim();
  const time = document.getElementById("medTimeInput").value;

  if (!name || !dosage || !time) {
    return;
  }

  const meds = getMeds();
  meds.push({
    id: `med-${Date.now()}`,
    name,
    dosage,
    time,
    taken: false
  });

  meds.sort((a, b) => a.time.localeCompare(b.time));
  setMeds(meds);
  clearMedicationForm();
  toggleMedicationForm();
  renderMedications();
}

function clearMedicationForm() {
  document.getElementById("medNameInput").value = "";
  document.getElementById("medDosageInput").value = "";
  document.getElementById("medTimeInput").value = "08:00";
}

function toggleMedicationTaken(id) {
  const meds = getMeds().map((med) =>
    med.id === id ? { ...med, taken: !med.taken } : med
  );

  setMeds(meds);
  renderMedications();
}

function deleteMedication(id) {
  const meds = getMeds().filter((med) => med.id !== id);
  setMeds(meds);
  renderMedications();
}

function renderMedications() {
  const meds = getMeds();
  const list = document.getElementById("medicationsList");
  list.innerHTML = "";

  meds.forEach((med) => {
    const card = document.createElement("article");
    card.className = "med-item";
    card.innerHTML = `
      <button class="med-check ${med.taken ? "taken" : ""}" type="button" data-id="${med.id}">${med.taken ? "OK" : ""}</button>
      <div class="med-info">
        <h3>${escapeHtml(med.name)}</h3>
        <p>${escapeHtml(med.dosage)}</p>
      </div>
      <div class="med-meta">
        <span class="med-time">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 6V12L16 14"></path>
            <path d="M12 22C17.52 22 22 17.52 22 12S17.52 2 12 2 2 6.48 2 12 6.48 22 12 22Z"></path>
          </svg>
          ${med.time}
        </span>
        <button class="med-delete" type="button" data-delete-id="${med.id}" aria-label="Delete medication">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 7H18"></path>
            <path d="M9 7V5H15V7"></path>
            <path d="M8 7V19H16V7"></path>
            <path d="M10 11V15"></path>
            <path d="M14 11V15"></path>
          </svg>
        </button>
      </div>
    `;

    list.appendChild(card);
  });

  list.querySelectorAll(".med-check").forEach((button) => {
    button.addEventListener("click", () => toggleMedicationTaken(button.dataset.id));
  });

  list.querySelectorAll(".med-delete").forEach((button) => {
    button.addEventListener("click", () => deleteMedication(button.dataset.deleteId));
  });

  renderProgress(meds);
}

function renderProgress(meds) {
  const total = meds.length;
  const completed = meds.filter((med) => med.taken).length;
  const percent = total ? (completed / total) * 100 : 0;

  document.getElementById("progressCount").textContent = `${completed}/${total}`;
  document.getElementById("progressFill").style.width = `${percent}%`;
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
