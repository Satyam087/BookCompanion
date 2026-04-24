/**
 * Level classifier for books
 * Uses heuristic keyword matching on title and subjects
 */

const BEGINNER_KEYWORDS = [
  'introduction', 'beginner', 'basic', 'basics', 'fundamentals',
  'starter', 'primer', 'elementary', 'first course', 'getting started',
  'for dummies', 'essentials', 'simplified', 'easy', 'overview', '101',
  'a gentle', 'step by step', 'made simple', 'complete guide',
  'introductory', 'foundation', 'foundations', 'starting',
];

const ADVANCED_KEYWORDS = [
  'advanced', 'theory', 'handbook', 'research', 'manual',
  'deep', 'graduate', 'analysis', 'computational', 'proceedings',
  'treatise', 'monograph', 'algorithmic', 'mathematical', 'formal',
  'comprehensive', 'expert', 'mastering', 'professional', 'reference',
  'in-depth', 'specialized', 'doctoral', 'thesis',
];

function textContainsKeyword(text, keywords) {
  if (!text) return false;
  const lower = text.toLowerCase();
  return keywords.some(kw => lower.includes(kw));
}

function subjectsContainKeyword(subjects, keywords) {
  if (!subjects || subjects.length === 0) return false;
  return subjects.some(s => textContainsKeyword(s, keywords));
}

export function classifyBook(book) {
  const title = book.title || '';
  const subjects = book.subjects || [];

  const isBeginner = textContainsKeyword(title, BEGINNER_KEYWORDS) ||
    subjectsContainKeyword(subjects, BEGINNER_KEYWORDS);

  const isAdvanced = textContainsKeyword(title, ADVANCED_KEYWORDS) ||
    subjectsContainKeyword(subjects, ADVANCED_KEYWORDS);

  if (isBeginner && !isAdvanced) return 'beginner';
  if (isAdvanced && !isBeginner) return 'advanced';
  if (isBeginner && isAdvanced) return 'intermediate';
  return 'intermediate';
}

export function groupBooksByLevel(books) {
  const groups = { beginner: [], intermediate: [], advanced: [] };
  books.forEach(book => {
    const level = classifyBook(book);
    const classified = { ...book, level };
    groups[level].push(classified);
  });
  return groups;
}
