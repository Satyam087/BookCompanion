# PageNotes

A reading planner for students and self-learners who want to study a topic through books in a clear order.

## What it is
PageNotes takes a raw topic like "Machine Learning" or "Philosophy" and turns it into a structured reading path. It connects to the Open Library ecosystem to find relevant books and organizes them by reading level, helping you decide what to read first and what to read next.

## Who it is for
Students, self-learners, and curious readers who want structure, not just a disorganized list of search results.

## The problem it solves
Most book search tools simply return a massive list of results. They don't help you figure out where to start, what books are too advanced, or how to keep track of your reading progress. PageNotes solves this by automatically grouping books into Beginner, Intermediate, and Advanced levels based on their metadata, and provides built-in progress tracking.

## Main features
- **Topic search:** Enter any subject to get a curated reading path.
- **Automatic level grouping:** Books are sorted into Beginner, Intermediate, and Advanced categories using intelligent keyword heuristics.
- **Related books:** Discover new books based on shared subject tags.
- **Reading Journey:** Save books to your personal list.
- **Progress tracking:** Mark books as "To Read", "Reading", or "Completed".
- **Notes:** Add personal notes to books in your reading journey.
- **Recent searches:** Quickly jump back to topics you've explored recently.
- **Offline persistence:** Your journey, notes, and recent searches are saved to your browser's local storage.

## Tech stack
- **React 18** (UI library)
- **Vite** (Build tool)
- **Vanilla CSS3** (Styling, custom properties, responsive design)
- **JavaScript ES6+** (Logic and API integration)
- **HTML5** (Semantic structure)

*Note: Built completely without external libraries like React Router, Tailwind, or component UI kits to keep the application lightweight and dependency-free.*

## Design approach
The visual design is inspired by index cards, notebooks, and traditional libraries. It uses:
- A warm, paper-like color palette (off-whites, charcoal, dusty blue, deep forest).
- Clean, highly readable typography pairing a serif font for headings (`Lora`) and a sans-serif for body text (`Source Sans 3`).
- Subtle borders and shadows to create depth without relying on heavy gradients or modern "glass" effects.
- A fully responsive layout that works seamlessly on mobile, tablet, and desktop.

## API usage
PageNotes relies exclusively on the free APIs provided by Open Library:
1. **Search API (`/search.json`)**: Used to find works related to the user's topic query.
2. **Works API (`/works/{id}.json`)**: Used to fetch full descriptions and detailed metadata for a specific book.
3. **Subjects API (`/subjects/{subject}.json`)**: Used to find related books that share the same subject category.
4. **Covers API (`covers.openlibrary.org`)**: Used to fetch cover images in various sizes.

## Edge cases handled
- **Missing Data:** Books missing covers use a clean SVG placeholder. Missing descriptions, authors, or publish years are gracefully handled with fallback text.
- **Classification:** If a book lacks clear beginner or advanced keywords in its title or subjects, it is safely defaulted to the "Intermediate" level.
- **Storage Limits:** Local storage operations are wrapped in `try/catch` blocks to prevent crashes if the browser's storage quota is exceeded or unavailable.
- **Network Issues:** API calls include an 8-second abort timeout and robust error catching to display user-friendly error states with retry options.
- **Long Text:** Extremely long book titles or subject tags are safely truncated.

## What I would improve with more time
- Implement pagination for the topic search results to load more than the initial 40 books.
- Add user authentication to sync the Reading Journey across multiple devices (currently limited to local browser storage).
- Enhance the level classification with a more robust natural language processing approach instead of simple keyword heuristics.
- Add the ability to create custom, user-defined lists beyond the standard "To Read", "Reading", and "Completed" statuses.

## Links
- **Live deployment:** [Add Vercel/Netlify link here]
- **Repository:** https://github.com/Satyam087/BookCompanion.git
