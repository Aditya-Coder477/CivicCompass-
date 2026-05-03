export default function SourceBadge({ label = 'Mock Data', icon = '🛡️' }) {
  return (
    <span className="source-badge">
      <span>{icon}</span>
      <span>{label}</span>
    </span>
  );
}
