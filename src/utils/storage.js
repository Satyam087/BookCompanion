/**
 * Local storage utility for PageNotes
 * Handles saved books, reading status, and recent searches
 */

const KEYS = {
  SAVED_BOOKS: 'pagenotes_saved_books',
  RECENT_SEARCHES: 'pagenotes_recent_searches',
};

const MAX_RECENT_SEARCHES = 8;

function safeGetItem(key, fallback) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function safeSetItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    console.warn('localStorage is full or unavailable');
    return false;
  }
}

// --- Saved Books ---

export function getSavedBooks() {
  return safeGetItem(KEYS.SAVED_BOOKS, []);
}

export function saveBook(book) {
  const books = getSavedBooks();
  const exists = books.find(b => b.id === book.id);
  if (exists) return books;

  const bookToSave = {
    id: book.id,
    title: book.title,
    authors: book.authors,
    coverId: book.coverId,
    coverUrl: book.coverUrl,
    publishYear: book.publishYear,
    subjects: (book.subjects || []).slice(0, 10),
    level: book.level || 'intermediate',
    status: 'to-read',
    notes: '',
    savedAt: Date.now(),
  };

  const updated = [bookToSave, ...books];
  safeSetItem(KEYS.SAVED_BOOKS, updated);
  return updated;
}

export function removeBook(bookId) {
  const books = getSavedBooks();
  const updated = books.filter(b => b.id !== bookId);
  safeSetItem(KEYS.SAVED_BOOKS, updated);
  return updated;
}

export function isBookSaved(bookId) {
  const books = getSavedBooks();
  return books.some(b => b.id === bookId);
}

export function updateBookStatus(bookId, status) {
  const books = getSavedBooks();
  const updated = books.map(b =>
    b.id === bookId ? { ...b, status } : b
  );
  safeSetItem(KEYS.SAVED_BOOKS, updated);
  return updated;
}

export function updateBookNotes(bookId, notes) {
  const books = getSavedBooks();
  const updated = books.map(b =>
    b.id === bookId ? { ...b, notes } : b
  );
  safeSetItem(KEYS.SAVED_BOOKS, updated);
  return updated;
}

// --- Recent Searches ---

export function getRecentSearches() {
  return safeGetItem(KEYS.RECENT_SEARCHES, []);
}

export function addRecentSearch(topic) {
  if (!topic || !topic.trim()) return;
  const searches = getRecentSearches();
  const cleaned = topic.trim().toLowerCase();
  const filtered = searches.filter(s => s.toLowerCase() !== cleaned);
  const updated = [topic.trim(), ...filtered].slice(0, MAX_RECENT_SEARCHES);
  safeSetItem(KEYS.RECENT_SEARCHES, updated);
  return updated;
}

export function clearRecentSearches() {
  safeSetItem(KEYS.RECENT_SEARCHES, []);
}
