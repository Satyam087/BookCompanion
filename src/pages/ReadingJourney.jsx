import { useState, useEffect, useCallback } from 'react';
import { getSavedBooks, updateBookStatus, updateBookNotes, removeBook } from '../utils/storage';
import { formatAuthors, formatYear, getPlaceholderCover, navigate, getWorkIdFromKey, truncateText } from '../utils/helpers';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import './ReadingJourney.css';

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'to-read', label: 'To Read' },
  { key: 'reading', label: 'Reading' },
  { key: 'completed', label: 'Completed' },
];

export default function ReadingJourney() {
  const [books, setBooks] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [expandedNotes, setExpandedNotes] = useState(null);

  const loadBooks = useCallback(() => {
    setBooks(getSavedBooks());
  }, []);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  const handleStatusChange = (bookId, newStatus) => {
    updateBookStatus(bookId, newStatus);
    loadBooks();
  };

  const handleRemove = (bookId) => {
    removeBook(bookId);
    loadBooks();
  };

  const handleNotesChange = (bookId, notes) => {
    updateBookNotes(bookId, notes);
  };

  const filtered = activeTab === 'all'
    ? books
    : books.filter(b => b.status === activeTab);

  const stats = {
    total: books.length,
    toRead: books.filter(b => b.status === 'to-read').length,
    reading: books.filter(b => b.status === 'reading').length,
    completed: books.filter(b => b.status === 'completed').length,
  };

  return (
    <div className="page reading-journey" id="reading-journey-page">
      <div className="container">
        <h1 className="reading-journey__title">My Reading Journey</h1>
        <p className="reading-journey__subtitle">
          Your saved books and reading progress, all in one place.
        </p>

        {/* Stats */}
        {books.length > 0 && (
          <div className="reading-journey__stats" id="reading-stats">
            <div className="stat-card">
              <span className="stat-card__num">{stats.total}</span>
              <span className="stat-card__label">Saved</span>
            </div>
            <div className="stat-card stat-card--blue">
              <span className="stat-card__num">{stats.toRead}</span>
              <span className="stat-card__label">To Read</span>
            </div>
            <div className="stat-card stat-card--forest">
              <span className="stat-card__num">{stats.reading}</span>
              <span className="stat-card__label">Reading</span>
            </div>
            <div className="stat-card stat-card--rust">
              <span className="stat-card__num">{stats.completed}</span>
              <span className="stat-card__label">Completed</span>
            </div>
          </div>
        )}

        {/* Tabs */}
        {books.length > 0 && (
          <div className="tab-bar" role="tablist" aria-label="Filter books by status">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                className={`tab-btn ${activeTab === tab.key ? 'tab-btn--active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
                role="tab"
                aria-selected={activeTab === tab.key}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Book List */}
        {books.length === 0 && (
          <EmptyState
            heading="No saved books yet"
            message="Search for a topic and save books to build your reading journey."
            actionLabel="Start searching"
            onAction={() => navigate('/')}
          />
        )}

        {books.length > 0 && filtered.length === 0 && (
          <EmptyState
            heading={`No ${activeTab.replace('-', ' ')} books`}
            message="Change the status of a book or switch tabs to see your saved books."
          />
        )}

        {filtered.length > 0 && (
          <div className="reading-journey__list">
            {filtered.map((book) => (
              <JourneyCard
                key={book.id}
                book={book}
                onStatusChange={handleStatusChange}
                onRemove={handleRemove}
                onNotesChange={handleNotesChange}
                isNotesExpanded={expandedNotes === book.id}
                onToggleNotes={() => setExpandedNotes(expandedNotes === book.id ? null : book.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function JourneyCard({ book, onStatusChange, onRemove, onNotesChange, isNotesExpanded, onToggleNotes }) {
  const [imgError, setImgError] = useState(false);
  const [notes, setNotes] = useState(book.notes || '');

  const coverSrc = (!imgError && book.coverUrl) ? book.coverUrl : getPlaceholderCover();
  const workId = getWorkIdFromKey(book.id);

  const handleNotesBlur = () => {
    onNotesChange(book.id, notes);
  };

  return (
    <article className="journey-card card" id={`journey-card-${workId}`}>
      <div className="journey-card__cover-wrap" onClick={() => navigate(`/book/${workId}`)}>
        <img
          className="journey-card__cover"
          src={coverSrc}
          alt={`Cover of ${book.title}`}
          onError={() => setImgError(true)}
          loading="lazy"
        />
      </div>

      <div className="journey-card__body">
        <div className="journey-card__top">
          <div className="journey-card__meta">
            <h3
              className="journey-card__title"
              onClick={() => navigate(`/book/${workId}`)}
            >
              {truncateText(book.title, 70)}
            </h3>
            <p className="journey-card__author">{formatAuthors(book.authors)}</p>
            <p className="journey-card__year">{formatYear(book.publishYear)}</p>
          </div>

          <div className="journey-card__badges">
            <StatusBadge status={book.status} />
            <span className={`level-badge level-badge--${book.level || 'intermediate'}`}>
              {book.level || 'intermediate'}
            </span>
          </div>
        </div>

        <div className="journey-card__actions">
          <select
            className="select"
            value={book.status}
            onChange={(e) => onStatusChange(book.id, e.target.value)}
            aria-label={`Update status for ${book.title}`}
          >
            <option value="to-read">To Read</option>
            <option value="reading">Reading</option>
            <option value="completed">Completed</option>
          </select>

          <button
            className="btn btn-sm btn-ghost"
            onClick={onToggleNotes}
          >
            {isNotesExpanded ? 'Hide notes' : 'Notes'}
          </button>

          <button
            className="btn btn-sm btn-danger"
            onClick={() => onRemove(book.id)}
            aria-label={`Remove ${book.title}`}
          >
            Remove
          </button>
        </div>

        {isNotesExpanded && (
          <div className="journey-card__notes">
            <textarea
              className="textarea"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={handleNotesBlur}
              placeholder="Write your notes about this book..."
              aria-label={`Notes for ${book.title}`}
            />
          </div>
        )}
      </div>
    </article>
  );
}
