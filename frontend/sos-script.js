const SOS_CONFIG_KEY = "sosConfig";
const SOS_CONTACTS_KEY = "sosContacts";

document.addEventListener("DOMContentLoaded", () => {
  bindSosEvents();
  loadSosData();
});

function bindSosEvents() {
  document.getElementById("saveEmergencyNumber")?.addEventListener("click", saveEmergencyNumber);
  document.getElementById("addEmergencyContact")?.addEventListener("click", addEmergencyContact);
  document.getElementById("saveEmergencyNote")?.addEventListener("click", saveEmergencyNote);
}

function getSosConfig() {
  try {
    return JSON.parse(localStorage.getItem(SOS_CONFIG_KEY) || "{}");
  } catch (error) {
    return {};
  }
}

function setSosConfig(config) {
  localStorage.setItem(SOS_CONFIG_KEY, JSON.stringify(config));
}

function getSosContacts() {
  try {
    return JSON.parse(localStorage.getItem(SOS_CONTACTS_KEY) || "[]");
  } catch (error) {
    return [];
  }
}

function setSosContacts(contacts) {
  localStorage.setItem(SOS_CONTACTS_KEY, JSON.stringify(contacts));
}

function loadSosData() {
  const config = getSosConfig();
  if (config.emergencyNumber) {
    document.getElementById("emergencyNumberInput").value = config.emergencyNumber;
  }
  if (config.note) {
    document.getElementById("emergencyNoteInput").value = config.note;
  }
  updateEmergencyNumberState(config.emergencyNumber || "");
  renderContacts();
}

function saveEmergencyNumber() {
  const number = document.getElementById("emergencyNumberInput").value.trim();
  const config = getSosConfig();
  config.emergencyNumber = number;
  setSosConfig(config);
  updateEmergencyNumberState(number);
}

function updateEmergencyNumberState(number) {
  const callButton = document.getElementById("callEmergencyButton");
  const savedText = document.getElementById("savedNumberText");

  if (number) {
    callButton.href = `tel:${number}`;
    callButton.classList.remove("disabled");
    savedText.textContent = `Saved emergency number: ${number}`;
  } else {
    callButton.href = "#";
    callButton.classList.add("disabled");
    savedText.textContent = "No emergency number saved yet.";
  }
}

function addEmergencyContact() {
  const name = document.getElementById("contactNameInput").value.trim();
  const phone = document.getElementById("contactPhoneInput").value.trim();
  const relation = document.getElementById("contactRelationInput").value.trim();

  if (!name || !phone || !relation) {
    return;
  }

  const contacts = getSosContacts();
  contacts.push({
    id: `contact-${Date.now()}`,
    name,
    phone,
    relation
  });
  setSosContacts(contacts);

  document.getElementById("contactNameInput").value = "";
  document.getElementById("contactPhoneInput").value = "";
  document.getElementById("contactRelationInput").value = "";

  renderContacts();
}

function deleteEmergencyContact(id) {
  const contacts = getSosContacts().filter((contact) => contact.id !== id);
  setSosContacts(contacts);
  renderContacts();
}

function renderContacts() {
  const list = document.getElementById("emergencyContactsList");
  const contacts = getSosContacts();
  list.innerHTML = "";

  if (!contacts.length) {
    list.innerHTML = `<div class="contact-card"><div class="contact-meta"><strong>No emergency contacts yet</strong><span>Add at least one trusted person for quick access.</span></div></div>`;
    return;
  }

  contacts.forEach((contact) => {
    const card = document.createElement("div");
    card.className = "contact-card";
    card.innerHTML = `
      <div class="contact-meta">
        <strong>${escapeHtml(contact.name)}</strong>
        <span>${escapeHtml(contact.relation)} | ${escapeHtml(contact.phone)}</span>
      </div>
      <div class="contact-actions">
        <a class="contact-call" href="tel:${contact.phone}">Call</a>
        <button class="contact-delete" type="button" data-id="${contact.id}">Remove</button>
      </div>
    `;
    list.appendChild(card);
  });

  list.querySelectorAll(".contact-delete").forEach((button) => {
    button.addEventListener("click", () => deleteEmergencyContact(button.dataset.id));
  });
}

function saveEmergencyNote() {
  const note = document.getElementById("emergencyNoteInput").value.trim();
  const config = getSosConfig();
  config.note = note;
  setSosConfig(config);
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
