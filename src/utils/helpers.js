/**
 * General helper utilities for PageNotes
 */

export function truncateText(text, maxLength = 100) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

export function formatYear(year) {
  if (!year) return 'Year unknown';
  return String(year);
}

export function formatAuthors(authors) {
  if (!authors || authors.length === 0) return 'Unknown Author';
  if (authors.length === 1) return authors[0];
  if (authors.length === 2) return authors.join(' & ');
  return `${authors[0]} and ${authors.length - 1} others`;
}

export function debounce(fn, delay = 300) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

export function getPlaceholderCover() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="260" viewBox="0 0 180 260"><rect width="180" height="260" fill="#F3EDE4"/><rect x="40" y="60" width="100" height="140" rx="4" fill="none" stroke="#C4B8A8" stroke-width="2"/><line x1="55" y1="95" x2="125" y2="95" stroke="#C4B8A8" stroke-width="2"/><line x1="55" y1="110" x2="115" y2="110" stroke="#C4B8A8" stroke-width="1.5"/><line x1="55" y1="125" x2="105" y2="125" stroke="#C4B8A8" stroke-width="1"/></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export function getStatusLabel(status) {
  const labels = { 'to-read': 'To Read', 'reading': 'Reading', 'completed': 'Completed' };
  return labels[status] || 'To Read';
}

export function getWorkIdFromKey(key) {
  if (!key) return '';
  return key.replace('/works/', '');
}

export function navigate(path) {
  window.location.hash = path;
}

export function cleanTopic(topic) {
  return topic.trim().toLowerCase().replace(/\s+/g, '+');
}

export function decodeTopic(encoded) {
  return decodeURIComponent(encoded).replace(/\+/g, ' ');
}
