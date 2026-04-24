import { getStatusLabel } from '../utils/helpers';

export default function StatusBadge({ status }) {
  return (
    <span className={`status-badge status-badge--${status}`}>
      {getStatusLabel(status)}
    </span>
  );
}
