import { useState, useEffect, useCallback } from 'react';
import { searchBooks } from '../utils/api';
import { groupBooksByLevel } from '../utils/levelClassifier';
import { addRecentSearch } from '../utils/storage';
import { decodeTopic, navigate, getWorkIdFromKey, getPlaceholderCover } from '../utils/helpers';
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

  const fetchBooks = useCallback(() => {
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
  }, [decodedTopic]);

  useEffect(() => {
    const runFetch = async () => {
      fetchBooks();
    };
    runFetch();
  }, [fetchBooks]);

  const totalBooks = books ? books.length : 0;
  const bestStarterBook = grouped
    ? (grouped.beginner[0] || grouped.intermediate[0] || grouped.advanced[0])
    : null;

  const getPathSummary = () => {
    if (!grouped) return '';
    const b = grouped.beginner.length;
    const i = grouped.intermediate.length;
    const a = grouped.advanced.length;
    if (b > i && b > a) return 'Strong beginner coverage — great for getting started.';
    if (a > b && a > i) return 'Leans toward advanced material — prior knowledge may help.';
    if (b === 0 && a > 0) return 'No beginner titles found — consider starting with intermediate.';
    return 'A balanced path across difficulty levels.';
  };

  return (
    <div className="page topic-results" id="topic-results-page">
      <div className="container">
        <div className="topic-results__header-bar">
          <button className="btn btn-ghost" onClick={() => navigate('/')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            Back
          </button>
          <div className="topic-results__search-wrap">
            <SearchBar initialValue={decodedTopic} />
          </div>
        </div>

        {loading && <LoadingState count={6} />}

        {error && <ErrorState message={error} onRetry={fetchBooks} />}

        {!loading && !error && totalBooks === 0 && (
          <EmptyState
            heading="No books found"
            message={`We could not find any books for "${decodedTopic}". Try a broader topic or a more academic term.`}
            actionLabel="Search again"
            onAction={() => navigate('/')}
          />
        )}

        {!loading && !error && grouped && (
          <>
            <div className="topic-results__summary-panel">
              <div className="topic-results__summary-info">
                <span className="topic-results__summary-label">Learning Path For</span>
                <h1 className="topic-results__summary-title">{decodedTopic}</h1>
                <p className="topic-results__summary-meta">
                  {totalBooks} {totalBooks === 1 ? 'book' : 'books'} found
                </p>
                <p className="topic-results__summary-interpretation">{getPathSummary()}</p>
              </div>

              {bestStarterBook && (
                <div className="topic-results__best-start">
                  <span className="topic-results__best-label">Best place to start:</span>
                  <div 
                    className="topic-results__best-card" 
                    onClick={() => navigate(`/book/${getWorkIdFromKey(bestStarterBook.id)}`)}
                  >
                    <img 
                      src={bestStarterBook.coverUrl || getPlaceholderCover()} 
                      alt={bestStarterBook.title} 
                      className="topic-results__best-cover"
                    />
                    <div className="topic-results__best-details">
                      <h4 className="topic-results__best-title">{bestStarterBook.title}</h4>
                      <p className="topic-results__best-author">{bestStarterBook.authors[0]}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="topic-results__nav-rail">
              <span className="topic-results__rail-label">Path:</span>
              <a href="#level-beginner" className="topic-results__rail-link">1. Beginner</a>
              <span className="topic-results__rail-sep">→</span>
              <a href="#level-intermediate" className="topic-results__rail-link">2. Intermediate</a>
              <span className="topic-results__rail-sep">→</span>
              <a href="#level-advanced" className="topic-results__rail-link">3. Advanced</a>
            </div>

            <div className="topic-results__levels">
              <div id="level-beginner" className="topic-results__level-anchor">
                <LevelSection level="beginner" books={grouped.beginner} />
              </div>
              <div id="level-intermediate" className="topic-results__level-anchor">
                <LevelSection level="intermediate" books={grouped.intermediate} />
              </div>
              <div id="level-advanced" className="topic-results__level-anchor">
                <LevelSection level="advanced" books={grouped.advanced} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
