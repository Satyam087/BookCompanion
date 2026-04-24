import { truncateText, formatAuthors, formatYear, getPlaceholderCover, navigate, getWorkIdFromKey } from '../utils/helpers';
import { isBookSaved, saveBook, removeBook } from '../utils/storage';
import { useState } from 'react';
import './BookCard.css';

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

  const levelLabel = book.level || 'intermediate';

  return (
    <article className="book-card card" id={`book-card-${workId}`}>
      <div className="book-card__cover-wrap" onClick={handleViewDetails}>
        <img
          className="book-card__cover"
          src={coverSrc}
          alt={`Cover of ${book.title}`}
          onError={() => setImgError(true)}
          loading="lazy"
        />
        <span className={`level-badge level-badge--${levelLabel}`}>
          {levelLabel}
        </span>
      </div>

      <div className="book-card__body">
        <h4 className="book-card__title" onClick={handleViewDetails}>
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

        <div className="book-card__actions">
          <button
            className={`btn btn-sm ${saved ? 'btn-danger' : 'btn-secondary'}`}
            onClick={handleSave}
            aria-label={saved ? `Remove ${book.title} from saved` : `Save ${book.title}`}
          >
            {saved ? '✕ Unsave' : '♡ Save'}
          </button>
          <button
            className="btn btn-sm btn-primary"
            onClick={handleViewDetails}
            aria-label={`View details for ${book.title}`}
          >
            Details
          </button>
        </div>
      </div>
    </article>
  );
}
