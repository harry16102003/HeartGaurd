const promptView = document.getElementById("assistantPromptView");
const chatView = document.getElementById("assistantChatView");
const messagesContainer = document.getElementById("assistantMessages");
const assistantForm = document.getElementById("assistantForm");
const assistantInput = document.getElementById("assistantInput");
const resetChatButton = document.getElementById("resetChatButton");
const promptButtons = document.querySelectorAll(".prompt-card");

let messages = [];

promptButtons.forEach((button) => {
  button.addEventListener("click", () => {
    submitQuestion(button.dataset.question);
  });
});

assistantForm.addEventListener("submit", (event) => {
  event.preventDefault();
  submitQuestion(assistantInput.value);
});

resetChatButton.addEventListener("click", resetChat);

function submitQuestion(rawQuestion) {
  const question = rawQuestion.trim();
  if (!question) {
    return;
  }

  assistantInput.value = "";
  switchToChatView();
  addMessage("user", question);
  askAssistant(question);
}

function switchToChatView() {
  promptView.classList.add("hidden");
  chatView.classList.remove("hidden");
}

function resetChat() {
  messages = [];
  messagesContainer.innerHTML = "";
  chatView.classList.add("hidden");
  promptView.classList.remove("hidden");
  assistantInput.value = "";
  assistantInput.focus();
}

function addMessage(role, text, options = {}) {
  const row = document.createElement("div");
  row.className = `message-row ${role}${options.typing ? " typing" : ""}`;

  if (role === "bot") {
    const avatar = document.createElement("div");
    avatar.className = "message-avatar";
    avatar.innerHTML = `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9 3H15V6H19C20.1 6 21 6.9 21 8V18C21 19.1 20.1 20 19 20H5C3.9 20 3 19.1 3 18V8C3 6.9 3.9 6 5 6H9V3Z"></path>
        <path d="M10 11H14"></path>
        <path d="M12 9V13"></path>
      </svg>
    `;
    row.appendChild(avatar);
  }

  const bubble = document.createElement("div");
  bubble.className = "message-bubble";
  bubble.textContent = text;
  row.appendChild(bubble);

  if (role === "user") {
    const avatar = document.createElement("div");
    avatar.className = "message-avatar";
    avatar.innerHTML = `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 12C14.76 12 17 9.76 17 7S14.76 2 12 2 7 4.24 7 7 9.24 12 12 12Z"></path>
        <path d="M4 22C4 18.69 7.58 16 12 16C16.42 16 20 18.69 20 22"></path>
      </svg>
    `;
    row.appendChild(avatar);
  }

  messagesContainer.appendChild(row);
  row.scrollIntoView({ behavior: "smooth", block: "end" });
  return row;
}

async function askAssistant(question) {
  const typingRow = addMessage("bot", "Thinking...", { typing: true });

  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: question
      })
    });

    const data = await response.json();
    typingRow.remove();
    addMessage("bot", data.reply || "I’m sorry, I couldn’t generate a response right now.");
  } catch (error) {
    typingRow.remove();
    addMessage(
      "bot",
      "The backend chat service is not reachable right now.\n\nPlease start the backend and try again. Once it is running, I can answer heart-health questions in detail."
    );
  }
}
const API_BASE_URL = window.location.protocol === "file:" ? "http://127.0.0.1:8000" : window.location.origin;
