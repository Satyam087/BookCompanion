import { useState, useEffect, useCallback } from 'react';
import { getBookDetails, getRelatedBooks } from '../utils/api';
import { classifyBook } from '../utils/levelClassifier';
import { isBookSaved, saveBook, removeBook, updateBookStatus, getSavedBooks } from '../utils/storage';
import { formatAuthors, formatYear, getPlaceholderCover, navigate } from '../utils/helpers';
import BookGrid from '../components/BookGrid';
import ErrorState from '../components/ErrorState';
import LeafOrnament from '../components/LeafOrnament';
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

  const fetchDetails = useCallback(() => {
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
        setLoading(false);

        const isSaved = isBookSaved(details.id);
        setSaved(isSaved);
        if (isSaved && savedVersion) {
          setStatus(savedVersion.status || 'to-read');
        }

        // Fetch related books independently so failures don't affect the main page
        if (details.subjects && details.subjects.length > 0) {
          const topSubject = details.subjects[0];
          getRelatedBooks(topSubject, 6)
            .then((relatedBooks) => {
              const filtered = relatedBooks.filter(b => b.id !== fullWorkId);
              setRelated(filtered.slice(0, 5));
            })
            .catch(() => {
              // Fail silently — related books are optional
            });
        }
      })
      .catch((err) => {
        setError(err.message || 'Failed to load book details.');
        setLoading(false);
      });
  }, [fullWorkId]);

  useEffect(() => {
    const runFetch = async () => {
      fetchDetails();
    };
    runFetch();
    window.scrollTo(0, 0);
  }, [fetchDetails]);

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

          <div className="book-details__info-col" style={{ position: 'relative' }}>
            <LeafOrnament 
              size="medium" 
              opacity={0.05} 
              rotation={45} 
              style={{ position: 'absolute', top: 50, right: 0 }} 
            />
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
                <p className="book-details__no-desc">
                  This work has limited catalog detail{book.subjects && book.subjects.length > 0 ? `, but it appears in reading paths for topics like ${book.subjects[0]}` : ''}.
                </p>
              </div>
            )}

            <div className="book-details__level-callout">
              <h3>Why is this {book.level}?</h3>
              <p>{LEVEL_REASONS[book.level]}</p>
            </div>

            {book.subjects && book.subjects.length > 0 && (
              <div className="book-details__subjects">
                <h3>Explore Related Topics</h3>
                <div className="book-details__tags">
                  {book.subjects.slice(0, 12).map((s, i) => (
                    <button 
                      className="tag tag--clickable" 
                      key={i}
                      onClick={() => navigate(`/topic/${encodeURIComponent(s)}`)}
                    >
                      {s}
                    </button>
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
                {saved ? 'Remove from journey' : 'Save to journey'}
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

        {/* Related Books / Next Steps */}
        {related.length > 0 && (
          <section className="book-details__related" id="related-books">
            <h2>Next steps</h2>
            <p className="book-details__related-desc">
              If you enjoyed this, or want to explore similar concepts, check out these related books.
            </p>
            <BookGrid books={related} />
          </section>
        )}
      </div>
    </div>
  );
}
