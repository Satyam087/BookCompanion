import { useState, useEffect } from 'react';
import { searchBooks } from '../utils/api';
import { groupBooksByLevel } from '../utils/levelClassifier';
import { addRecentSearch } from '../utils/storage';
import { decodeTopic, navigate } from '../utils/helpers';
import LevelSection from '../components/LevelSection';
import SearchBar from '../components/SearchBar';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import './TopicResults.css';

export default function TopicResults({ topic }) {
  const [books, setBooks] = useState(null);
  const [grouped, setGrouped] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const decodedTopic = decodeTopic(topic);

  const fetchBooks = () => {
    setLoading(true);
    setError(null);
    setBooks(null);
    setGrouped(null);

    searchBooks(decodedTopic)
      .then((results) => {
        setBooks(results);
        setGrouped(groupBooksByLevel(results));
        if (results.length > 0) {
          addRecentSearch(decodedTopic);
        }
      })
      .catch((err) => {
        setError(err.message || 'Failed to search books.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBooks();
  }, [topic]);

  const totalBooks = books ? books.length : 0;

  return (
    <div className="page topic-results" id="topic-results-page">
      <div className="container">
        <div className="topic-results__header">
          <button className="btn btn-ghost" onClick={() => navigate('/')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            Back
          </button>

          <div className="topic-results__title-wrap">
            <h1 className="topic-results__title">
              Reading path: <span className="topic-results__topic">{decodedTopic}</span>
            </h1>
            {!loading && !error && totalBooks > 0 && (
              <p className="topic-results__count">
                {totalBooks} {totalBooks === 1 ? 'book' : 'books'} found and organized by level
              </p>
            )}
          </div>

          <div className="topic-results__search-wrap">
            <SearchBar initialValue={decodedTopic} />
          </div>
        </div>

        {loading && <LoadingState count={6} />}

        {error && <ErrorState message={error} onRetry={fetchBooks} />}

        {!loading && !error && totalBooks === 0 && (
          <EmptyState
            heading="No books found"
            message={`We could not find any books for "${decodedTopic}". Try a different search term or check the spelling.`}
            actionLabel="Search again"
            onAction={() => navigate('/')}
          />
        )}

        {!loading && !error && grouped && (
          <div className="topic-results__levels">
            <LevelSection level="beginner" books={grouped.beginner} />
            <LevelSection level="intermediate" books={grouped.intermediate} />
            <LevelSection level="advanced" books={grouped.advanced} />
          </div>
        )}
      </div>
    </div>
  );
}
