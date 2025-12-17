import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { buildTreeStructure, calculateTreeStatistics } from '../utils/treeLayout';
import './TreeStatistics.css';

/**
 * TreeStatistics component displays statistics about the family tree,
 * including total member count and generation count.
 */
function TreeStatistics({ members, relationships, rootMemberId }) {
  // Calculate statistics whenever members or relationships change
  const statistics = useMemo(() => {
    if (!members || members.length === 0) {
      return { memberCount: 0, generationCount: 0 };
    }

    const rootNode = buildTreeStructure(members, relationships, rootMemberId);
    return calculateTreeStatistics(members, rootNode);
  }, [members, relationships, rootMemberId]);

  // Format member count with appropriate label
  const formatMemberCount = (count) => {
    if (count === 0) return '0 Members';
    if (count === 1) return '1 Member';
    return `${count} Members`;
  };

  // Format generation count with appropriate label
  const formatGenerationCount = (count) => {
    if (count === 0) return '0 Generations';
    if (count === 1) return '1 Generation';
    return `${count} Generations`;
  };

  return (
    <div className="tree-statistics">
      <h3 className="tree-statistics-heading">Tree Statistics</h3>
      <div className="tree-statistics-content">
        <div className="tree-statistic-item">
          <span className="tree-statistic-label">Total Members</span>
          <span className="tree-statistic-value" aria-label={formatMemberCount(statistics.memberCount)}>
            {formatMemberCount(statistics.memberCount)}
          </span>
        </div>
        <div className="tree-statistic-item">
          <span className="tree-statistic-label">Generations</span>
          <span className="tree-statistic-value" aria-label={formatGenerationCount(statistics.generationCount)}>
            {formatGenerationCount(statistics.generationCount)}
          </span>
        </div>
      </div>
    </div>
  );
}

TreeStatistics.propTypes = {
  members: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
  })).isRequired,
  relationships: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    fromUserId: PropTypes.string.isRequired,
    toUserId: PropTypes.string.isRequired,
    relationshipType: PropTypes.string.isRequired,
  })).isRequired,
  rootMemberId: PropTypes.string.isRequired,
};

export default TreeStatistics;
