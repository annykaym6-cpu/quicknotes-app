// ===================== 1. Select the elements =====================
const form = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const categorySelect = document.querySelector("#category-select");
const formMessage = document.querySelector("#form-message");
const searchInput = document.querySelector("#search-input");
const filterSelect = document.querySelector("#filter-select");
const list = document.querySelector("#notes-list");
const count = document.querySelector("#note-count");
const summary = document.querySelector("#summary");

const STORAGE_KEY = "quicknotes";
const MAX_LENGTH = 200;
const CATEGORIES = ["personal", "work", "study"];

// ===================== 2. Data: load and save =====================
let notes = loadNotes();

function loadNotes() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Could not read saved notes:", error.message);
    return [];
  }
}

function saveNotes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

// ===================== 3. Validation and helpers =====================
function isValidNote(text) {
  const cleaned = text.trim();
  return cleaned.length > 0 && cleaned.length <= MAX_LENGTH;
}

function isDuplicate(text) {
  const cleaned = text.trim().toLowerCase();
  return notes.some((note) => note.text.trim().toLowerCase() === cleaned);
}

function countByCategory() {
  const counts = { personal: 0, work: 0, study: 0 };
  for (const note of notes) {
    if (counts[note.category] !== undefined) {
      counts[note.category]++;
    }
  }
  return counts;
}

// The notes that match the search box and the category filter
function getVisibleNotes() {
  const term = searchInput.value.trim().toLowerCase();
  const category = filterSelect.value;

  return notes.filter((note) => {
    const matchesSearch = note.text.toLowerCase().includes(term);
    const matchesCategory = category === "all" || note.category === category;
    return matchesSearch && matchesCategory;
  });
}

function capitalise(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function showMessage(message) {
  formMessage.textContent = message;
}

// ===================== 4. Draw everything (render) =====================
function render() {
  list.innerHTML = "";
  const visible = getVisibleNotes();

  if (visible.length === 0) {
    const empty = document.createElement("li");
    empty.classList.add("empty");
    empty.textContent =
      notes.length === 0 ? "No notes yet. Add your first one above." : "No notes match your search.";
    list.appendChild(empty);
  }

  visible.forEach((note) => {
    const li = document.createElement("li");
    li.classList.add("note", `note-${note.category}`);

    const body = document.createElement("div");
    body.classList.add("note-body");

    const text = document.createElement("span");
    text.classList.add("note-text");
    text.textContent = note.text; // textContent keeps user text safe

    const meta = document.createElement("div");
    meta.classList.add("note-meta");

    const badge = document.createElement("span");
    badge.classList.add("badge", `badge-${note.category}`);
    badge.textContent = note.category;

    const date = document.createElement("span");
    date.textContent = note.createdAt;

    meta.appendChild(badge);
    meta.appendChild(date);
    body.appendChild(text);
    body.appendChild(meta);

    const del = document.createElement("button");
    del.type = "button";
    del.classList.add("delete-btn");
    del.dataset.id = note.id;
    del.textContent = "Delete";
    del.setAttribute("aria-label", `Delete note: ${note.text}`);

    li.appendChild(body);
    li.appendChild(del);
    list.appendChild(li);
  });

  // Count and per-category summary
  if (notes.length === 0) {
    count.textContent = "You have no notes yet.";
  } else if (notes.length === 1) {
    count.textContent = "You have 1 note.";
  } else {
    count.textContent = `You have ${notes.length} notes.`;
  }

  const totals = countByCategory();
  summary.textContent =
    notes.length === 0
      ? ""
      : `${totals.personal} personal, ${totals.work} work, ${totals.study} study`;
}

// ===================== 5. Add and delete =====================
// Reads the form, validates, creates the note object, saves it and redraws.
function addNote(text, category) {
  const cleaned = text.trim();

  if (!isValidNote(cleaned)) {
    showMessage(`A note must be 1 to ${MAX_LENGTH} characters.`);
    return false;
  }
  if (isDuplicate(cleaned)) {
    showMessage("You already have a note with that text.");
    return false;
  }
  if (!CATEGORIES.includes(category)) {
    showMessage("Please choose a category.");
    return false;
  }

  const newNote = {
    id: Date.now(),
    text: cleaned,
    category: category,
    createdAt: new Date().toLocaleString(),
  };

  notes.push(newNote);
  saveNotes();
  render();
  showMessage("");
  return true;
}

function deleteNote(id) {
  notes = notes.filter((note) => note.id !== id);
  saveNotes();
  render();
}

// ===================== 6. Listen for events =====================
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const added = addNote(noteInput.value, categorySelect.value);
  if (added) {
    noteInput.value = "";
  }
  noteInput.focus();
});

// One listener on the list handles every Delete button (event delegation)
list.addEventListener("click", (event) => {
  const button = event.target.closest(".delete-btn");
  if (button) {
    deleteNote(Number(button.dataset.id));
  }
});

searchInput.addEventListener("input", render);
filterSelect.addEventListener("change", render);

noteInput.addEventListener("input", () => showMessage(""));

// ===================== 7. Draw once when the page loads =====================
render();
