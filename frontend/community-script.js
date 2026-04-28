const COMMUNITY_KEY = "communityPosts";

const seedPosts = [
  {
    id: "seed-1",
    title: "My journey with hypertension",
    body: "I was diagnosed with high blood pressure last year. Through diet changes and regular exercise, I've managed to bring it under control. Stay strong everyone!",
    tags: ["hypertension", "diet"],
    likes: 12,
    comments: 4,
    date: "2026-04-15"
  },
  {
    id: "seed-2",
    title: "Dealing with anxiety about heart health",
    body: "After my father had a heart attack, I've been extremely anxious. Therapy and this community have helped me cope. You're not alone.",
    tags: ["anxiety", "family"],
    likes: 8,
    comments: 6,
    date: "2026-04-14"
  },
  {
    id: "seed-3",
    title: "Exercise routine that changed my life",
    body: "Started with just 10 min walks. Now I jog 5km daily. My resting heart rate dropped from 85 to 65. Small steps matter!",
    tags: ["exercise", "progress"],
    likes: 21,
    comments: 9,
    date: "2026-04-13"
  }
];

document.addEventListener("DOMContentLoaded", () => {
  ensureSeedPosts();
  bindCommunityEvents();
  updateCharacterCount();
  renderPosts();
});

function ensureSeedPosts() {
  if (!localStorage.getItem(COMMUNITY_KEY)) {
    localStorage.setItem(COMMUNITY_KEY, JSON.stringify(seedPosts));
  }
}

function bindCommunityEvents() {
  const toggleButton = document.getElementById("togglePostComposer");
  const publishButton = document.getElementById("publishPostButton");
  const clearButton = document.getElementById("clearPostFormButton");
  const bodyInput = document.getElementById("postBodyInput");

  toggleButton?.addEventListener("click", toggleComposer);
  publishButton?.addEventListener("click", publishPost);
  clearButton?.addEventListener("click", clearComposer);
  bodyInput?.addEventListener("input", updateCharacterCount);
}

function toggleComposer() {
  const composer = document.getElementById("postComposerCard");
  const button = document.getElementById("togglePostComposer");
  const isHidden = composer.classList.contains("hidden");

  composer.classList.toggle("hidden");
  button.textContent = isHidden ? "X Cancel" : "+ New Post";
}

function clearComposer() {
  document.getElementById("postTitleInput").value = "";
  document.getElementById("postBodyInput").value = "";
  document.getElementById("postTagsInput").value = "";
  updateCharacterCount();
}

function updateCharacterCount() {
  const count = (document.getElementById("postBodyInput").value || "").length;
  document.getElementById("postCharacterCount").textContent = count;
}

function getPosts() {
  try {
    return JSON.parse(localStorage.getItem(COMMUNITY_KEY) || "[]");
  } catch (error) {
    return [];
  }
}

function setPosts(posts) {
  localStorage.setItem(COMMUNITY_KEY, JSON.stringify(posts));
}

function publishPost() {
  const title = document.getElementById("postTitleInput").value.trim();
  const body = document.getElementById("postBodyInput").value.trim();
  const tagsRaw = document.getElementById("postTagsInput").value.trim();

  if (!title || !body) {
    return;
  }

  const tags = tagsRaw
    ? tagsRaw.split(",").map((tag) => tag.trim().toLowerCase()).filter(Boolean).slice(0, 5)
    : ["support"];

  const posts = getPosts();
  posts.unshift({
    id: `post-${Date.now()}`,
    title,
    body,
    tags,
    likes: 0,
    comments: 0,
    date: formatDate(new Date())
  });

  setPosts(posts);
  clearComposer();
  toggleComposer();
  renderPosts();
}

function renderPosts() {
  const feed = document.getElementById("communityFeed");
  const posts = getPosts();

  feed.innerHTML = "";

  if (!posts.length) {
    feed.innerHTML = `<div class="empty-feed">No posts yet. Be the first to share something supportive.</div>`;
    return;
  }

  posts.forEach((post, index) => {
    const card = document.createElement("article");
    card.className = "post-card";
    const badgeText = index === 0 ? "Fresh story" : "Community voice";

    card.innerHTML = `
      <div class="post-card-head">
        <h3>${escapeHtml(post.title)}</h3>
        <span class="post-badge">${badgeText}</span>
      </div>
      <p>${escapeHtml(post.body)}</p>
      <div class="post-tags">
        ${post.tags.map((tag) => `<span class="post-tag">${escapeHtml(tag)}</span>`).join("")}
      </div>
      <div class="post-footer">
        <div class="post-reactions">
          <span class="reaction-pill">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 21.35 10.55 20C5.4 15.24 2 12.09 2 8.25 2 5.12 4.42 3 7.25 3c1.8 0 3.53.91 4.75 2.34C13.22 3.91 14.95 3 16.75 3 19.58 3 22 5.12 22 8.25c0 3.84-3.4 6.99-8.55 11.75L12 21.35Z"></path>
            </svg>
            ${post.likes}
          </span>
          <span class="reaction-pill">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M21 11.5C21 16.19 16.97 20 12 20C10.78 20 9.61 19.77 8.55 19.35L4 20.5L5.15 16.33C4.42 14.95 4 13.28 4 11.5C4 6.81 8.03 3 13 3C17.97 3 21 6.81 21 11.5Z"></path>
            </svg>
            ${post.comments}
          </span>
        </div>
        <span class="post-date">${post.date}</span>
      </div>
    `;

    feed.appendChild(card);
  });
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
