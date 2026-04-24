import { useState, useRef } from 'react';
import BookGrid from './BookGrid';
import './LevelSection.css';

const LEVEL_INFO = {
  beginner: {
    label: 'Beginner',
    description: 'Start here. These books cover fundamentals and introductions to the topic.',
    color: 'forest',
    icon: '🌱',
    initialCount: 4,
  },
  intermediate: {
    label: 'Intermediate',
    description: 'Build deeper understanding with broader surveys and standard texts.',
    color: 'blue',
    icon: '📘',
    initialCount: 6,
  },
  advanced: {
    label: 'Advanced',
    description: 'Go deeper with specialized, technical, and research-oriented material.',
    color: 'rust',
    icon: '🔬',
    initialCount: 4,
  },
};

export default function LevelSection({ level, books, onSaveChange }) {
  const [collapsed, setCollapsed] = useState(false);
  const info = LEVEL_INFO[level] || LEVEL_INFO.intermediate;
  const [expanded, setExpanded] = useState(false);
  const sectionRef = useRef(null);

  if (!books || books.length === 0) return null;

  const initialCount = info.initialCount;
  const hasMore = books.length > initialCount;
  const visibleBooks = expanded ? books : books.slice(0, initialCount);
  const hiddenCount = books.length - initialCount;

  const handleCollapse = () => {
    setExpanded(false);
    // Scroll back to section header so the user doesn't lose context
    if (sectionRef.current) {
      requestAnimationFrame(() => {
        sectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  };

  return (
    <section
      className={`level-section level-section--${level}`}
      ref={sectionRef}
    >
      <button
        className="level-section__header"
        onClick={() => setCollapsed(!collapsed)}
        aria-expanded={!collapsed}
        aria-controls={`level-content-${level}`}
      >
        <div className="level-section__title-row">
          <span className="level-section__icon" aria-hidden="true">{info.icon}</span>
          <h2 className="level-section__title">{info.label}</h2>
          <span className="level-section__count">{books.length} {books.length === 1 ? 'book' : 'books'}</span>
        </div>
        <span className={`level-section__chevron ${collapsed ? 'collapsed' : ''}`} aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </span>
      </button>

      <p className="level-section__desc">{info.description}</p>

      {!collapsed && (
        <div className="level-section__content" id={`level-content-${level}`}>
          <BookGrid books={visibleBooks} onSaveChange={onSaveChange} />
          {hasMore && (
            <div className="level-section__toggle-wrap">
              {expanded ? (
                <button
                  className="btn btn-secondary level-section__toggle"
                  onClick={handleCollapse}
                >
                  Collapse section
                </button>
              ) : (
                <button
                  className="btn btn-secondary level-section__toggle"
                  onClick={() => setExpanded(true)}
                >
                  Show {hiddenCount} more {hiddenCount === 1 ? 'book' : 'books'}
                </button>
              )}
              {!expanded && (
                <span className="level-section__toggle-hint">
                  Showing {initialCount} of {books.length}
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
