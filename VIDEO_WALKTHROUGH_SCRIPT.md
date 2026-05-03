# PageNotes — Final 3–5 Minute Video Walkthrough Script

## 0:00 – 0:30

### What to say
Hi, this is PageNotes.

PageNotes is a reading planner for students and self-learners who want to study a topic through books in a structured and clear order.

Most platforms give users a long list of books, but they do not tell them where to start or how to progress.

Beginner and advanced books often appear mixed together, which makes learning confusing.

PageNotes solves this by organizing books into Beginner, Intermediate, and Advanced levels, creating a clear learning path instead of a flat list.

### What to show on screen
- Start on the home page
- Keep the hero visible
- If you want, briefly flash a messy search result page like Google or Open Library for 1–2 seconds, then come back to PageNotes

### Under the hood
- This is a frontend-only React app
- Navigation is handled with a lightweight hash-based router

---

## 0:30 – 0:55

### What to say
Let me show how it works.

I’ll search for Machine Learning.

The moment I hit search, the app sends a request to the Open Library API to fetch relevant books.

But instead of just displaying raw results, I process that data and organize it into levels.

### What to show on screen
- Type `Machine Learning`
- Click search

### Under the hood
- This uses the Open Library Search API, specifically `/search.json`
- The response is transformed before rendering

---

## 0:55 – 1:35

### What to say
Now instead of a flat list, the app groups books into Beginner, Intermediate, and Advanced.

This classification is not given directly by the API.

It is a layer I built on top using title keywords, subjects, and metadata signals.

If the data is unclear, the app safely defaults the book to Intermediate.

### What to show on screen
- Show the summary panel
- Scroll through the Beginner, Intermediate, and Advanced sections
- Expand one section

### Under the hood
- The raw API response is passed through a classifier
- One result set is transformed into three grouped arrays

---

## 1:35 – 2:00

### What to say
To make the experience more guided, the app also suggests a best place to start.

That gives the user a clearer entry point instead of making them decide from scratch.

### What to show on screen
- Highlight the `Best place to start` card

### Under the hood
- This is selected from the grouped results
- It usually comes from the strongest beginner candidate available

---

## 2:00 – 2:30

### What to say
I also wanted to avoid overwhelming the user with a very long page, so each level only shows a limited number of books at first.

Users can expand a section only when they want more.

### What to show on screen
- Click `Show more` in one section, ideally Intermediate
- Optionally collapse it again

### Under the hood
- Each section manages its own visible count and expansion state
- This keeps the page easier to scan

---

## 2:30 – 3:05

### What to say
If I open a book, I can go deeper.

On the details page, I show the description, subjects, and an explanation for why the book was classified at that level.

### What to show on screen
- Click one book card
- Show title, author, description, and the level explanation

### Under the hood
- The details page makes another API request to `/works/{id}.json`
- This fetches richer detail for the selected book

---

## 3:05 – 3:35

### What to say
From here, the user can continue exploring naturally.

They can click a subject and move into a related topic path instead of starting over with a new search every time.

### What to show on screen
- Point at the subject tags
- Click one subject if it behaves well during recording

### Under the hood
- Related exploration is powered by subject-based API calls
- The app keeps building a connected learning path

---

## 3:35 – 4:05

### What to say
Discovery is only one part of learning, so I added a Reading Journey page.

Users can save books, add notes, and track reading status.

That makes the app feel more personal, even though it is frontend only.

### What to show on screen
- Save a book
- Change its status
- Go to `My Reading Journey`
- Show the stats strip, continue reading card, and one note

### Under the hood
- Saved books, notes, reading status, and recent searches are stored in localStorage

---

## 4:05 – 4:30

### What to say
I wanted this project to feel like a real product, not just an API demo.

So I made a few key decisions: structured reading levels, limited initial results to reduce overload, lightweight routing, and basic analytics to understand how users interact with search and reading paths.

### What to show on screen
- Stay on the Journey page or briefly return to results
- If you want, give a quick code glimpse of `pages`, `components`, and `utils`

### Under the hood
- The app uses a small hash-based router
- Logic is separated into API, classifier, and storage utilities

---

## 4:30 – 4:50

### What to say
The design is inspired by notebooks, library catalogs, and study desks.

I wanted the interface to feel calm and focused, so users can spend time reading and exploring without distraction.

### What to show on screen
- Show close-ups of the home hero
- Show the level sections
- Show the details page

---

## 4:50 – 5:10

### What to say
With more time, I would improve the classification logic, add authentication and syncing across devices, and build smarter recommendations.

That would take PageNotes further as a personalized learning platform.

### What to show on screen
- Stay on a strong screen, ideally results or Reading Journey

---

## 5:10 – 5:20

### What to say
PageNotes is about turning scattered information into a clearer learning journey.

Thank you.

### What to show on screen
- End on the home page or results page with the interface fully visible

---

## Best recording order

1. Home page
2. Search a topic
3. Results page
4. Show grouped levels
5. Show best place to start
6. Expand one section
7. Open one book
8. Show description and subject tags
9. Save the book
10. Go to Reading Journey
11. Show notes and status
12. Brief code glimpse
13. Closing screen

---

## Natural under-the-hood lines

- This uses the Open Library Search API.
- I added a classification layer on top of the raw results.
- The app transforms one flat response into three structured groups.
- The details page makes a second API request for richer book information.
- Related exploration is powered by subject-based API calls.
- Persistence is handled with localStorage, so the app feels personal without a backend.
- I kept the architecture lightweight and focused on frontend fundamentals.

---

## Delivery tip

Do not try to sound like you are reading documentation.

Instead, sound like:
- you built this for a reason
- you understand the user problem
- you made deliberate decisions
- you know how the app works technically
