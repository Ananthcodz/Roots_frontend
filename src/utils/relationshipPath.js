/**
 * Utility functions for calculating relationship paths between family members
 */

/**
 * Builds a graph representation of family relationships
 * @param {Array} relationships - Array of relationship objects
 * @returns {Map} - Map of member IDs to their connected members with relationship types
 */
function buildRelationshipGraph(relationships) {
  const graph = new Map();

  relationships.forEach(rel => {
    // Add forward edge
    if (!graph.has(rel.fromUserId)) {
      graph.set(rel.fromUserId, []);
    }
    graph.get(rel.fromUserId).push({
      memberId: rel.toUserId,
      relationshipType: rel.relationshipType,
      specificLabel: rel.specificLabel,
      direction: 'forward'
    });

    // Add reverse edge (relationships are bidirectional)
    if (!graph.has(rel.toUserId)) {
      graph.set(rel.toUserId, []);
    }
    graph.get(rel.toUserId).push({
      memberId: rel.fromUserId,
      relationshipType: getInverseRelationship(rel.relationshipType),
      specificLabel: rel.specificLabel,
      direction: 'reverse'
    });
  });

  return graph;
}

/**
 * Gets the inverse relationship type
 * @param {string} relationshipType - The original relationship type
 * @returns {string} - The inverse relationship type
 */
function getInverseRelationship(relationshipType) {
  const inverseMap = {
    'parent': 'child',
    'child': 'parent',
    'spouse': 'spouse',
    'sibling': 'sibling',
    'grandparent': 'grandchild',
    'grandchild': 'grandparent',
    'aunt': 'nephew/niece',
    'uncle': 'nephew/niece',
    'cousin': 'cousin',
    'other': 'other'
  };

  return inverseMap[relationshipType] || relationshipType;
}

/**
 * Finds the shortest path between two family members using BFS
 * @param {string} startId - ID of the starting member
 * @param {string} targetId - ID of the target member
 * @param {Array} relationships - Array of relationship objects
 * @param {Array} allMembers - Array of all family member objects
 * @returns {Object|null} - Path object with members and relationships, or null if not connected
 */
export function findRelationshipPath(startId, targetId, relationships, allMembers) {
  if (startId === targetId) {
    return {
      path: [],
      description: 'Same person',
      connected: true
    };
  }

  const graph = buildRelationshipGraph(relationships);
  
  // BFS to find shortest path
  const queue = [[startId]];
  const visited = new Set([startId]);

  while (queue.length > 0) {
    const path = queue.shift();
    const currentId = path[path.length - 1];

    // Get neighbors
    const neighbors = graph.get(currentId) || [];

    for (const neighbor of neighbors) {
      if (neighbor.memberId === targetId) {
        // Found the target! Build the complete path
        const completePath = [...path, targetId];
        return buildPathDescription(completePath, graph, allMembers);
      }

      if (!visited.has(neighbor.memberId)) {
        visited.add(neighbor.memberId);
        queue.push([...path, neighbor.memberId]);
      }
    }
  }

  // No path found
  return {
    path: [],
    description: 'Not connected',
    connected: false
  };
}

/**
 * Builds a human-readable description of the relationship path
 * @param {Array} pathIds - Array of member IDs in the path
 * @param {Map} graph - Relationship graph
 * @param {Array} allMembers - Array of all family member objects
 * @returns {Object} - Path object with description
 */
function buildPathDescription(pathIds, graph, allMembers) {
  const memberMap = new Map(allMembers.map(m => [m.id, m]));
  const pathSteps = [];

  for (let i = 0; i < pathIds.length - 1; i++) {
    const fromId = pathIds[i];
    const toId = pathIds[i + 1];
    const fromMember = memberMap.get(fromId);
    const toMember = memberMap.get(toId);

    // Find the relationship between these two members
    const neighbors = graph.get(fromId) || [];
    const relationship = neighbors.find(n => n.memberId === toId);

    if (fromMember && toMember && relationship) {
      pathSteps.push({
        member: toMember,
        relationship: relationship.specificLabel || formatRelationshipType(relationship.relationshipType)
      });
    }
  }

  // Build description string
  const description = pathSteps
    .map(step => `${step.member.firstName} ${step.member.lastName} (${step.relationship})`)
    .join(' → ');

  return {
    path: pathSteps,
    description: description || 'Connected',
    connected: true
  };
}

/**
 * Formats a relationship type into a human-readable label
 * @param {string} relationshipType - The relationship type
 * @returns {string} - Formatted relationship label
 */
function formatRelationshipType(relationshipType) {
  const labelMap = {
    'parent': 'Parent',
    'child': 'Child',
    'spouse': 'Spouse',
    'sibling': 'Sibling',
    'grandparent': 'Grandparent',
    'grandchild': 'Grandchild',
    'aunt': 'Aunt',
    'uncle': 'Uncle',
    'cousin': 'Cousin',
    'nephew/niece': 'Nephew/Niece',
    'other': 'Relative'
  };

  return labelMap[relationshipType] || relationshipType;
}
