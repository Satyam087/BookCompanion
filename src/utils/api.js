/**
 * Open Library API utility
 * Handles all external API calls with normalization and error handling
 */

const BASE_URL = 'https://openlibrary.org';
const COVERS_URL = 'https://covers.openlibrary.org';
const TIMEOUT_MS = 10000;

/**
 * Fetch with timeout support
 */
function fetchWithTimeout(url, timeoutMs = TIMEOUT_MS) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  return fetch(url, { signal: controller.signal })
    .then(response => {
      clearTimeout(timeoutId);
      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }
      return response.json();
    })
    .catch(error => {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Request timed out. Please try again.');
      }
      throw error;
    });
}

/**
 * Build a cover image URL from a cover ID
 */
export function buildCoverUrl(coverId, size = 'M') {
  if (!coverId) return null;
  return `${COVERS_URL}/b/id/${coverId}-${size}.jpg`;
}

/**
 * Normalize a book document from the Search API response
 */
function normalizeSearchBook(doc) {
  return {
    id: doc.key || '',
    title: doc.title || 'Untitled',
    authors: doc.author_name && doc.author_name.length > 0
      ? doc.author_name
      : ['Unknown Author'],
    coverId: doc.cover_i || null,
    coverUrl: buildCoverUrl(doc.cover_i, 'M'),
    publishYear: doc.first_publish_year || null,
    subjects: Array.isArray(doc.subject)
      ? doc.subject.slice(0, 20)
      : [],
    description: null,
    editionCount: doc.edition_count || 0,
  };
}

/**
 * Normalize a book from the Subjects API response
 */
function normalizeSubjectBook(work) {
  return {
    id: work.key || '',
    title: work.title || 'Untitled',
    authors: work.authors && work.authors.length > 0
      ? work.authors.map(a => a.name)
      : ['Unknown Author'],
    coverId: work.cover_id || null,
    coverUrl: buildCoverUrl(work.cover_id, 'M'),
    publishYear: work.first_publish_year || null,
    subjects: Array.isArray(work.subject)
      ? work.subject.slice(0, 20)
      : [],
    description: null,
    editionCount: work.edition_count || 0,
  };
}

/**
 * Search books by topic
 * Uses the Search API to find books related to a topic
 */
export async function searchBooks(topic, limit = 20) {
  const encoded = encodeURIComponent(topic);
  const url = `${BASE_URL}/search.json?q=${encoded}&fields=key,title,author_name,cover_i,first_publish_year,subject,edition_count&limit=${limit}`;

  const data = await fetchWithTimeout(url);

  if (!data.docs || data.docs.length === 0) {
    return [];
  }

  return data.docs.map(normalizeSearchBook);
}

/**
 * Get full details for a specific book/work
 * Uses both Works API (for description) and Search API (for metadata)
 */
export async function getBookDetails(workId) {
  // workId might be like "/works/OL123W" or just "OL123W"
  const cleanId = workId.startsWith('/works/') ? workId : `/works/${workId}`;
  const worksUrl = `${BASE_URL}${cleanId}.json`;
  const searchUrl = `${BASE_URL}/search.json?q=key:${cleanId}&fields=key,title,author_name,cover_i,first_publish_year,subject,edition_count`;

  const [worksData, searchData] = await Promise.all([
    fetchWithTimeout(worksUrl),
    fetchWithTimeout(searchUrl).catch(() => null) // Optional, don't fail if search fails
  ]);

  // Extract description from Works API
  let description = null;
  if (worksData.description) {
    description = typeof worksData.description === 'string'
      ? worksData.description
      : worksData.description.value || null;
  }

  // Extract subjects from Works API (usually more detailed than search)
  const subjects = Array.isArray(worksData.subjects) ? worksData.subjects : [];

  // Extract covers from Works API
  const coverId = worksData.covers && worksData.covers.length > 0
    ? worksData.covers[0]
    : null;

  // Extract metadata from Search API if available
  let authors = [];
  let publishYear = null;
  let editionCount = null;

  if (searchData && searchData.docs && searchData.docs.length > 0) {
    const doc = searchData.docs[0];
    authors = doc.author_name && doc.author_name.length > 0 ? doc.author_name : [];
    publishYear = doc.first_publish_year || null;
    editionCount = doc.edition_count || null;
  }

  return {
    id: worksData.key || cleanId,
    title: worksData.title || (searchData && searchData.docs && searchData.docs.length > 0 ? searchData.docs[0].title : 'Untitled'),
    coverId: coverId,
    coverUrl: buildCoverUrl(coverId, 'L'),
    subjects: subjects,
    description: description,
    authors: authors.length > 0 ? authors : [],
    publishYear: publishYear,
    editionCount: editionCount,
  };
}

/**
 * Get related books by subject
 * Uses the Subjects API
 */
export async function getRelatedBooks(subject, limit = 6) {
  const encoded = subject.toLowerCase().replace(/\s+/g, '_');
  const url = `${BASE_URL}/subjects/${encoded}.json?limit=${limit}`;

  const data = await fetchWithTimeout(url);

  if (!data.works || data.works.length === 0) {
    return [];
  }

  return data.works.map(normalizeSubjectBook);
}
