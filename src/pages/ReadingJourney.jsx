import { useState } from 'react';
import { getSavedBooks, updateBookStatus, updateBookNotes, removeBook } from '../utils/storage';
import { formatAuthors, getPlaceholderCover, navigate, getWorkIdFromKey, truncateText } from '../utils/helpers';
import EmptyState from '../components/EmptyState';
import LeafOrnament from '../components/LeafOrnament';
import './ReadingJourney.css';

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'to-read', label: 'To Read' },
  { key: 'reading', label: 'Reading' },
  { key: 'completed', label: 'Completed' },
];

export default function ReadingJourney() {
  const [books, setBooks] = useState(getSavedBooks);
  const [activeTab, setActiveTab] = useState('all');
  const [expandedNotes, setExpandedNotes] = useState(null);

  const handleStatusChange = (bookId, newStatus) => {
    updateBookStatus(bookId, newStatus);
    setBooks(getSavedBooks());
  };

  const handleRemove = (bookId) => {
    removeBook(bookId);
    setBooks(getSavedBooks());
  };

  const handleNotesChange = (bookId, notes) => {
    updateBookNotes(bookId, notes);
    setBooks(getSavedBooks());
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

  const currentlyReading = books.find(b => b.status === 'reading');

  return (
    <div className="page reading-journey" id="reading-journey-page">
      <div className="container" style={{ position: 'relative' }}>
        <LeafOrnament 
          size="tiny" 
          rotation={-25} 
          style={{ position: 'absolute', top: 10, right: 10 }} 
        />
        <h1 className="reading-journey__title">My Reading Journey</h1>
        <p className="reading-journey__subtitle">
          {books.length > 0
            ? `You have ${stats.total} book${stats.total !== 1 ? 's' : ''} saved. ${stats.reading > 0 ? `${stats.reading} in progress.` : ''}`
            : 'Your saved books and reading progress, all in one place.'
          }
        </p>

        {/* Stats Strip */}
        {books.length > 0 && (
          <div className="reading-journey__stats-strip" id="reading-stats">
            <span className="reading-journey__stat">
              <strong>{stats.total}</strong> saved
            </span>
            <span className="reading-journey__stat-sep"></span>
            <span className="reading-journey__stat reading-journey__stat--blue">
              <strong>{stats.toRead}</strong> to read
            </span>
            <span className="reading-journey__stat-sep"></span>
            <span className="reading-journey__stat reading-journey__stat--forest">
              <strong>{stats.reading}</strong> reading
            </span>
            <span className="reading-journey__stat-sep"></span>
            <span className="reading-journey__stat reading-journey__stat--rust">
              <strong>{stats.completed}</strong> completed
            </span>
          </div>
        )}

        {/* Continue Reading Featured Panel */}
        {currentlyReading && (
          <div className="reading-journey__continue" id="continue-reading">
            <span className="reading-journey__continue-label">Continue reading</span>
            <div
              className="reading-journey__continue-card"
              onClick={() => navigate(`/book/${getWorkIdFromKey(currentlyReading.id)}`)}
            >
              <img
                className="reading-journey__continue-cover"
                src={currentlyReading.coverUrl || getPlaceholderCover()}
                alt={currentlyReading.title}
              />
              <div className="reading-journey__continue-info">
                <h3 className="reading-journey__continue-title">{currentlyReading.title}</h3>
                <p className="reading-journey__continue-author">{formatAuthors(currentlyReading.authors)}</p>
                {currentlyReading.notes && (
                  <p className="reading-journey__continue-note">
                    {truncateText(currentlyReading.notes, 100)}
                  </p>
                )}
              </div>
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
          <div style={{ position: 'relative' }}>
            <LeafOrnament 
              size="small" 
              rotation={35} 
              style={{ position: 'absolute', top: '20%', left: '10%' }} 
            />
            <EmptyState
              heading="No saved books yet"
              message="Search for a topic and save books to build your reading journey."
              actionLabel="Start searching"
              onAction={() => navigate('/')}
            />
          </div>
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

  const getProgress = (status) => {
    if (status === 'completed') return 100;
    if (status === 'reading') return 50;
    return 0;
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
        <div className="journey-card__progress-strip">
          <div
            className={`journey-card__progress-fill journey-card__progress-fill--${book.status}`}
            style={{ width: `${getProgress(book.status)}%` }}
          />
        </div>
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
          </div>
        </div>

        {/* Note preview (first line, always visible if notes exist) */}
        {book.notes && !isNotesExpanded && (
          <p className="journey-card__note-preview" onClick={onToggleNotes}>
            {truncateText(book.notes, 60)}
          </p>
        )}

        <div className="journey-card__actions">
          <select
            className="select journey-card__status-select"
            value={book.status}
            onChange={(e) => onStatusChange(book.id, e.target.value)}
            aria-label={`Update status for ${book.title}`}
          >
            <option value="to-read">To Read</option>
            <option value="reading">Reading</option>
            <option value="completed">Completed</option>
          </select>

          <button
            className={`btn btn-sm btn-ghost journey-card__notes-btn ${isNotesExpanded || notes ? 'has-notes' : ''}`}
            onClick={onToggleNotes}
          >
            {isNotesExpanded ? 'Close' : (notes ? 'Edit notes' : 'Add notes')}
          </button>

          <button
            className="btn btn-sm btn-ghost journey-card__remove-btn"
            onClick={() => onRemove(book.id)}
            aria-label={`Remove ${book.title}`}
            title="Remove from journey"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        </div>

        {isNotesExpanded && (
          <div className="journey-card__notes-wrap">
            <div className="journey-card__notebook-rings"></div>
            <textarea
              className="journey-card__notebook-textarea"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={handleNotesBlur}
              placeholder="Jot down your thoughts, quotes, or takeaways..."
              aria-label={`Notes for ${book.title}`}
            />
          </div>
        )}
      </div>
    </article>
  );
}
