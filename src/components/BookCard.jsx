import { truncateText, formatAuthors, formatYear, getPlaceholderCover, navigate, getWorkIdFromKey } from '../utils/helpers';
import { isBookSaved, saveBook, removeBook } from '../utils/storage';
import { useState } from 'react';
import './BookCard.css';

const LEVEL_LABELS = {
  beginner: 'Good first book',
  intermediate: 'Standard reading',
  advanced: 'More technical'
};

export default function BookCard({ book, onSaveChange }) {
  const [saved, setSaved] = useState(isBookSaved(book.id));
  const [imgError, setImgError] = useState(false);

  const coverSrc = (!imgError && book.coverUrl) ? book.coverUrl : getPlaceholderCover();
  const workId = getWorkIdFromKey(book.id);

  const handleSave = (e) => {
    e.stopPropagation();
    if (saved) {
      removeBook(book.id);
      setSaved(false);
    } else {
      saveBook(book);
      setSaved(true);
    }
    if (onSaveChange) onSaveChange();
  };

  const handleViewDetails = () => {
    navigate(`/book/${workId}`);
  };

  const level = book.level || 'intermediate';
  const displayLabel = LEVEL_LABELS[level];

  return (
    <article className={`book-card book-card--${level} card`} id={`book-card-${workId}`} onClick={handleViewDetails}>
      <div className="book-card__cover-wrap">
        <img
          className="book-card__cover"
          src={coverSrc}
          alt={`Cover of ${book.title}`}
          onError={() => setImgError(true)}
          loading="lazy"
        />
        <button 
          className={`book-card__bookmark ${saved ? 'is-saved' : ''}`}
          onClick={handleSave}
          aria-label={saved ? `Remove ${book.title} from saved` : `Save ${book.title}`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
      </div>

      <div className="book-card__body">
        <div className="book-card__meta-top">
          <span className={`book-card__level-label book-card__level-label--${level}`}>
            {displayLabel}
          </span>
        </div>

        <h4 className="book-card__title">
          {truncateText(book.title, 60)}
        </h4>
        
        <p className="book-card__author">{formatAuthors(book.authors)}</p>
        <p className="book-card__year">{formatYear(book.publishYear)}</p>

        {book.subjects && book.subjects.length > 0 && (
          <div className="book-card__tags">
            {book.subjects.slice(0, 3).map((s, i) => (
              <span className="tag" key={i}>{truncateText(s, 25)}</span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
