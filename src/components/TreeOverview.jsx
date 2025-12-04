import './TreeOverview.css';

const TreeOverview = ({ memberCount = 0, generationCount = 0, onTreeClick }) => {
  return (
    <section className="dashboard-section tree-overview">
      <h2>Tree Overview</h2>
      <div className="tree-stats">
        <div 
          className="stat-card" 
          onClick={() => onTreeClick && onTreeClick('members')}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onTreeClick && onTreeClick('members');
            }
          }}
        >
          <div className="stat-value">{memberCount}</div>
          <div className="stat-label">Members</div>
        </div>
        <div 
          className="stat-card"
          onClick={() => onTreeClick && onTreeClick('generations')}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onTreeClick && onTreeClick('generations');
            }
          }}
        >
          <div className="stat-value">{generationCount}</div>
          <div className="stat-label">Generations</div>
        </div>
      </div>
    </section>
  );
};

export default TreeOverview;
