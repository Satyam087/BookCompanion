import { useState, useEffect } from 'react';
import { getBookDetails, getRelatedBooks } from '../utils/api';
import { classifyBook } from '../utils/levelClassifier';
import { isBookSaved, saveBook, removeBook, updateBookStatus, getSavedBooks } from '../utils/storage';
import { formatAuthors, formatYear, getPlaceholderCover, navigate, getWorkIdFromKey } from '../utils/helpers';
import BookGrid from '../components/BookGrid';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import './BookDetails.css';

const LEVEL_REASONS = {
  beginner: 'This book is classified as Beginner because its title or subjects suggest introductory, foundational content suitable for those new to the topic.',
  intermediate: 'This book is classified as Intermediate. It covers the topic at a general level without strong beginner or advanced signals in its metadata.',
  advanced: 'This book is classified as Advanced because its title or subjects suggest specialized, research-oriented, or deeply technical content.',
};

export default function BookDetails({ workId }) {
  const [book, setBook] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);
  const [status, setStatus] = useState('to-read');
  const [imgError, setImgError] = useState(false);

  const fullWorkId = workId.startsWith('/works/') ? workId : `/works/${workId}`;

  const fetchDetails = () => {
    setLoading(true);
    setError(null);

    getBookDetails(fullWorkId)
      .then((details) => {
        // Merge with any saved data or search data we might have
        const savedBooks = getSavedBooks();
        const savedVersion = savedBooks.find(b => b.id === details.id);

        if (savedVersion) {
          details.authors = savedVersion.authors && savedVersion.authors.length > 0
            ? savedVersion.authors : details.authors;
          details.publishYear = savedVersion.publishYear || details.publishYear;
        }

        details.level = classifyBook(details);
        setBook(details);

        const isSaved = isBookSaved(details.id);
        setSaved(isSaved);
        if (isSaved && savedVersion) {
          setStatus(savedVersion.status || 'to-read');
        }

        // Fetch related books from the first subject
        if (details.subjects && details.subjects.length > 0) {
          const topSubject = details.subjects[0];
          return getRelatedBooks(topSubject, 6);
        }
        return [];
      })
      .then((relatedBooks) => {
        // Filter out the current book
        const filtered = relatedBooks.filter(b => b.id !== fullWorkId);
        setRelated(filtered.slice(0, 5));
      })
      .catch((err) => {
        setError(err.message || 'Failed to load book details.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDetails();
    window.scrollTo(0, 0);
  }, [workId]);

  const handleSave = () => {
    if (saved) {
      removeBook(book.id);
      setSaved(false);
    } else {
      saveBook(book);
      setSaved(true);
    }
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    updateBookStatus(book.id, newStatus);
  };

  if (loading) {
    return (
      <div className="page" id="book-details-page">
        <div className="container">
          <div className="book-details__loading">
            <div className="skeleton" style={{ width: '200px', height: '300px' }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="skeleton" style={{ width: '60%', height: '28px' }} />
              <div className="skeleton" style={{ width: '40%', height: '18px' }} />
              <div className="skeleton" style={{ width: '30%', height: '16px' }} />
              <div className="skeleton" style={{ width: '100%', height: '80px', marginTop: '12px' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page" id="book-details-page">
        <div className="container">
          <button className="btn btn-ghost" onClick={() => window.history.back()}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            Back
          </button>
          <ErrorState message={error} onRetry={fetchDetails} />
        </div>
      </div>
    );
  }

  if (!book) return null;

  const coverSrc = (!imgError && book.coverUrl) ? book.coverUrl : getPlaceholderCover();

  return (
    <div className="page book-details" id="book-details-page">
      <div className="container">
        <button className="btn btn-ghost" onClick={() => window.history.back()}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Back
        </button>

        <div className="book-details__main">
          <div className="book-details__cover-col">
            <img
              className="book-details__cover"
              src={coverSrc}
              alt={`Cover of ${book.title}`}
              onError={() => setImgError(true)}
            />
          </div>

          <div className="book-details__info-col">
            <span className={`level-badge level-badge--${book.level}`}>
              {book.level}
            </span>

            <h1 className="book-details__title">{book.title}</h1>

            <p className="book-details__author">
              {formatAuthors(book.authors)}
            </p>

            <p className="book-details__year">{formatYear(book.publishYear)}</p>

            {book.description && (
              <div className="book-details__description">
                <h3>About this book</h3>
                <p>{book.description}</p>
              </div>
            )}

            {!book.description && (
              <div className="book-details__description">
                <h3>About this book</h3>
                <p className="book-details__no-desc">No description available for this work.</p>
              </div>
            )}

            <div className="book-details__level-reason">
              <h3>Why this level?</h3>
              <p>{LEVEL_REASONS[book.level]}</p>
            </div>

            {book.subjects && book.subjects.length > 0 && (
              <div className="book-details__subjects">
                <h3>Subjects</h3>
                <div className="book-details__tags">
                  {book.subjects.slice(0, 12).map((s, i) => (
                    <span className="tag" key={i}>{s}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="book-details__actions">
              <button
                className={`btn ${saved ? 'btn-danger' : 'btn-primary'}`}
                onClick={handleSave}
                id="save-book-btn"
              >
                {saved ? '✕ Remove from list' : '♡ Save to my journey'}
              </button>

              {saved && (
                <select
                  className="select"
                  value={status}
                  onChange={handleStatusChange}
                  aria-label="Update reading status"
                  id="status-select"
                >
                  <option value="to-read">To Read</option>
                  <option value="reading">Reading</option>
                  <option value="completed">Completed</option>
                </select>
              )}
            </div>
          </div>
        </div>

        {/* Related Books */}
        {related.length > 0 && (
          <section className="book-details__related" id="related-books">
            <h2>Related books</h2>
            <p className="book-details__related-desc">
              Books that share subjects with this one.
            </p>
            <BookGrid books={related} />
          </section>
        )}
      </div>
    </div>
  );
}
