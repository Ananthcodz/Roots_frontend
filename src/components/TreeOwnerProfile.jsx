import PropTypes from 'prop-types';
import './TreeOwnerProfile.css';

/**
 * TreeOwnerProfile component displays the tree owner's profile information
 * in the sidebar, including their photo, name, and birth year.
 */
function TreeOwnerProfile({ treeOwner, onAddParents, onAddSpouse, onAddChildren, hasSpouse }) {
  // Extract birth year from dateOfBirth (format: YYYY-MM-DD or DD/MM/YYYY)
  const getBirthYear = (dateOfBirth) => {
    if (!dateOfBirth) return null;
    
    // Try parsing as YYYY-MM-DD format first
    const isoMatch = dateOfBirth.match(/^(\d{4})-\d{2}-\d{2}$/);
    if (isoMatch) {
      return isoMatch[1];
    }
    
    // Try parsing as DD/MM/YYYY format
    const dmyMatch = dateOfBirth.match(/^\d{2}\/\d{2}\/(\d{4})$/);
    if (dmyMatch) {
      return dmyMatch[1];
    }
    
    // Fallback: try to extract any 4-digit year
    const yearMatch = dateOfBirth.match(/\d{4}/);
    return yearMatch ? yearMatch[0] : null;
  };

  const birthYear = getBirthYear(treeOwner.dateOfBirth);

  return (
    <div className="tree-owner-profile">
      <div className="tree-owner-header">
        <div className="tree-owner-photo-container">
          {treeOwner.photoUrl ? (
            <img 
              src={treeOwner.photoUrl} 
              alt={`${treeOwner.firstName} ${treeOwner.lastName}`}
              className="tree-owner-photo"
              loading="lazy"
            />
          ) : (
            <div className="tree-owner-photo-placeholder">
              {treeOwner.firstName.charAt(0)}{treeOwner.lastName.charAt(0)}
            </div>
          )}
        </div>
        <div className="tree-owner-info">
          <h2 className="tree-owner-name">
            {treeOwner.firstName} {treeOwner.lastName}
          </h2>
          <p className="tree-owner-label">Tree Owner</p>
          {birthYear && (
            <p className="tree-owner-birth-year">Born {birthYear}</p>
          )}
        </div>
      </div>

      <div className="tree-owner-actions">
        <h3 className="tree-owner-actions-heading">GROW YOUR TREE</h3>
        <div className="tree-owner-action-buttons">
          <button 
            className="tree-owner-action-button"
            onClick={onAddParents}
            aria-label="Add parents to family tree"
          >
            <span className="action-button-icon">👨‍👩‍👦</span>
            <span className="action-button-text">Add Parents</span>
          </button>
          <button 
            className="tree-owner-action-button"
            onClick={onAddSpouse}
            aria-label={hasSpouse ? "View spouse" : "Add spouse to family tree"}
            disabled={hasSpouse}
          >
            <span className="action-button-icon">💑</span>
            <span className="action-button-text">
              {hasSpouse ? 'Spouse Added' : 'Add Spouse'}
            </span>
          </button>
          <button 
            className="tree-owner-action-button"
            onClick={onAddChildren}
            aria-label="Add children to family tree"
          >
            <span className="action-button-icon">👶</span>
            <span className="action-button-text">Add Children</span>
          </button>
        </div>
      </div>
    </div>
  );
}

TreeOwnerProfile.propTypes = {
  treeOwner: PropTypes.shape({
    id: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    dateOfBirth: PropTypes.string,
    photoUrl: PropTypes.string,
  }).isRequired,
  onAddParents: PropTypes.func.isRequired,
  onAddSpouse: PropTypes.func.isRequired,
  onAddChildren: PropTypes.func.isRequired,
  hasSpouse: PropTypes.bool,
};

TreeOwnerProfile.defaultProps = {
  hasSpouse: false,
};

export default TreeOwnerProfile;
