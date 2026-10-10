# QuickNotes

QuickNotes is a small note-taking app that runs in the browser. Write a short
note, give it a category, and find it again later. Your notes are saved in the
browser, so they are still there after a refresh.

## Features

- Add a note with a category: personal, work or study
- Validation: a note must be 1 to 200 characters, and duplicates are rejected
- Search notes as you type (not case-sensitive)
- Filter the list by category
- Delete a note with one click
- A live count of your notes and a per-category summary
- Category colours on each note card
- Notes are saved with `localStorage`, so they survive a page refresh
- Responsive layout for laptops and phones

## How to run

1. Download or clone this repository.
2. Open `index.html` in a browser, or open the folder in VS Code and use
   Live Server.

No build step or installation is needed.

## Project structure

```text
quicknotes-app/
├── index.html   page structure (form, search, notes list)
├── style.css    layout, colours and responsive rules
├── script.js    add, search, filter, delete, save and render logic
└── README.md    this file
```

## How it works

The app keeps its data in one `notes` array, which is the single source of
truth. Every change follows the same cycle:

1. Update the array (add or delete a note).
2. Save the array to `localStorage` as JSON.
3. Call `render()`, which clears the list and redraws it from the array, using
   the current search text and category filter.

Each note is an object:

```js
{ id: 1728000000000, text: "Revise HTML forms", category: "study", createdAt: "10/10/2026, 7:15:00 AM" }
```

Note text is inserted with `textContent`, never `innerHTML`, so anything a user
types is shown as plain text.

## Built with

HTML, CSS and JavaScript (no frameworks), as part of the Web Foundations course.

## Author
Built by Kay for the Web Foundations course.
