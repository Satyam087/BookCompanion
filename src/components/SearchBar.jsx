import { useState } from 'react';
import { navigate } from '../utils/helpers';
import './SearchBar.css';

export default function SearchBar({ initialValue = '', size = 'normal' }) {
  const [query, setQuery] = useState(initialValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    navigate(`/topic/${encodeURIComponent(trimmed)}`);
  };

  return (
    <form className={`search-bar search-bar--${size}`} onSubmit={handleSubmit} role="search" id="search-form">
      <span className="search-bar__icon" aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      </span>
      <input
        type="text"
        className="search-bar__input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search a topic like Machine Learning, Philosophy, World History..."
        aria-label="Search for a topic"
        id="search-input"
      />
      <button type="submit" className="search-bar__btn btn btn-primary" id="search-submit">
        Search
      </button>
    </form>
  );
}
