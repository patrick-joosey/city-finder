export default function ScoreBar({ score, color, label, icon, small = false }) {
  return (
    <div className={`score-bar ${small ? "score-bar-sm" : ""}`}>
      <div className="score-bar-label">
        {icon && <span className="score-bar-icon">{icon}</span>}
        <span>{label}</span>
        <span className="score-bar-value">{score}/10</span>
      </div>
      <div className="score-bar-track">
        <div
          className="score-bar-fill"
          style={{
            width: `${score * 10}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}
