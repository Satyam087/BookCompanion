import { navigate } from '../utils/helpers';
import './TopicChips.css';

const SUGGESTED_TOPICS = [
  'Machine Learning',
  'World History',
  'Philosophy',
  'Economics',
  'Psychology',
  'Data Science',
  'Astronomy',
  'Literature',
  'Biology',
  'Mathematics',
];

export default function TopicChips() {
  const handleClick = (topic) => {
    navigate(`/topic/${encodeURIComponent(topic)}`);
  };

  return (
    <div className="topic-chips" id="topic-chips">
      <p className="topic-chips__label">Popular topics</p>
      <div className="topic-chips__list">
        {SUGGESTED_TOPICS.map((topic) => (
          <button
            key={topic}
            className="topic-chip"
            onClick={() => handleClick(topic)}
            aria-label={`Search for ${topic}`}
          >
            {topic}
          </button>
        ))}
      </div>
    </div>
  );
}
