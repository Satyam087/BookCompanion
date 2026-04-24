# PageNotes

PageNotes is a reading planner for students and self learners who want to study a topic through books in a clear order.

## Links
- Live App: [https://pagenotes.netlify.app/](https://pagenotes.netlify.app/)
- Repository: [https://github.com/Satyam087/BookCompanion.git](https://github.com/Satyam087/BookCompanion.git)

## What it is
PageNotes takes a topic like "Machine Learning", "Philosophy", or "World History" and turns it into a structured reading path. Instead of showing one long list of search results, it organizes books into Beginner, Intermediate, and Advanced sections so the user can understand where to start and how to progress.

## Who it is for
This project is for students, self learners, and curious readers who want guidance instead of just search results.

## The problem it solves
Most book discovery tools help users find books, but they do not help them build a learning path. A beginner and an advanced book often appear side by side with no explanation. PageNotes solves this by turning a broad topic into a more understandable sequence and giving the user a simple way to save books and track reading progress.

## Main features
- Topic search using Open Library data
- Automatic grouping into Beginner, Intermediate, and Advanced levels
- Best place to start recommendation on the results page
- Expandable level sections so the page does not overwhelm the user at once
- Book details page with description, subjects, and related books
- Reading Journey page with saved books, notes, and status tracking
- Recent searches saved in local storage
- Responsive layout for desktop, tablet, and mobile

## Product decisions
I wanted this to feel like a real product instead of a raw API demo, so a few decisions shaped the app:

- I used structured reading levels to make the search results more useful for self learners.
- I limited how many books appear at first in each section so the user is not forced to scroll through a very long page immediately.
- I used local storage for saved books, notes, reading status, and recent searches so the app still feels personal without needing a backend.
- I kept routing lightweight with a small hash based router because the assignment only required a frontend application and I wanted to keep the code simple and dependency free.

## Tech stack
- React 19
- Vite
- JavaScript ES6+
- HTML5
- CSS3

This project was built without external UI libraries, React Router, Tailwind, or component kits.

## Design approach
The visual direction is inspired by notebooks, index cards, library catalogs, and study desks.

Key design choices:
- warm paper background
- editorial typography with serif headings and clean body text
- subtle borders and soft shadows instead of glossy effects
- calm earthy accents to keep the interface quiet and readable
- decorative details used lightly so the product still feels focused

## API usage
PageNotes uses the free Open Library APIs.

1. Search API `(/search.json)`
Used to fetch books for the main topic results page.

2. Works API `(/works/{id}.json)`
Used to fetch a single book's detailed description and subjects.

3. Subjects API `(/subjects/{subject}.json)`
Used to find related books from a selected subject.

4. Covers API `(covers.openlibrary.org)`
Used to display book cover images.

In practice, the app combines these endpoints so the user can search by topic, open a book, and continue exploring through related subjects.

## Edge cases handled
- Missing covers use a fallback placeholder
- Missing descriptions show a graceful fallback message
- Missing author names or publish years are handled safely
- Weak metadata defaults to Intermediate instead of forcing a wrong level
- Empty search results show a clear message and next step
- Failed or slow API requests show retry-friendly error states
- Saved books and notes are protected with safe local storage helpers

## Project structure
- `src/pages` contains the main screens
- `src/components` contains reusable UI pieces
- `src/utils/api.js` handles Open Library requests
- `src/utils/levelClassifier.js` handles book classification
- `src/utils/storage.js` handles saved books, notes, and recent searches

## Running locally
```bash
npm install
npm run dev
```

To create a production build:

```bash
npm run build
```

## What I would improve with more time
- Replace the current heuristic classification with a stronger metadata based ranking system
- Improve book detail navigation and deep linking even further
- Add smarter topic suggestions and subject exploration
- Add sync across devices with authentication and persistent storage
- Add a richer compare or reading-plan view for saved books

## Video walkthrough
Add your walkthrough link here once uploaded.
