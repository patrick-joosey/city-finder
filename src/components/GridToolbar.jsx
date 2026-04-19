// Thin toolbar above the city grid: result count on the left, expand/collapse
// all score bars on the right.

export default function GridToolbar({ count, onExpandAll, onCollapseAll }) {
  return (
    <div className="grid-toolbar">
      <span className="grid-result-count">
        {count} {count === 1 ? "city" : "cities"}
      </span>
      <div className="grid-toolbar-actions">
        <button className="btn-toolbar" onClick={onExpandAll}>
          Expand all scores
        </button>
        <button className="btn-toolbar" onClick={onCollapseAll}>
          Collapse all scores
        </button>
      </div>
    </div>
  );
}
