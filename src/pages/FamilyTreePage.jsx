import { useEffect } from 'react';
import { useFamily } from '../contexts/FamilyContext';
import { useUser } from '../contexts/UserContext';
import { TreeProvider, useTree } from '../contexts/TreeContext';
import NavigationBar from '../components/NavigationBar';
import TreeCanvas from '../components/TreeCanvas';
import ZoomControls from '../components/ZoomControls';
import SearchInput from '../components/SearchInput';
import './FamilyTreePage.css';

function FamilyTreePageContent() {
  const { familyMembers, relationships, getFamilyMembers, getRelationships, isLoading, error } = useFamily();
  const { user } = useUser();
  const { handleMemberClick, searchQuery, handleSearch, clearSearch } = useTree();

  useEffect(() => {
    // Load family data on mount
    const loadData = async () => {
      try {
        await getFamilyMembers();
        await getRelationships();
      } catch (err) {
        console.error('Failed to load family tree data:', err);
      }
    };

    loadData();
  }, [getFamilyMembers, getRelationships]);

  const handlePlaceholderClick = (type, relatedTo) => {
    // Navigate to add member form with relationship type and related member
    console.log('Add member:', type, relatedTo);
    // TODO: Implement navigation to add member form
  };

  if (isLoading) {
    return (
      <div className="family-tree-page">
        <NavigationBar />
        <div className="loading-container">
          <p>Loading your family tree...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="family-tree-page">
        <NavigationBar />
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  const handleSearchChange = (query) => {
    handleSearch(query, familyMembers);
  };

  return (
    <div className="family-tree-page">
      <NavigationBar />
      <div className="tree-toolbar">
        <div className="tree-toolbar-header">
          <div className="tree-toolbar-title">
            <h1>Family Tree</h1>
            <p>Welcome, {user?.firstName || 'User'}</p>
          </div>
          <SearchInput
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search tree..."
            debounceMs={300}
          />
        </div>
      </div>
      <ZoomControls />
      <div className="tree-content">
        <TreeCanvas
          members={familyMembers}
          relationships={relationships}
          rootMemberId={user?.id}
          onMemberClick={handleMemberClick}
          onPlaceholderClick={handlePlaceholderClick}
        />
      </div>
    </div>
  );
}

function FamilyTreePage() {
  return (
    <TreeProvider>
      <FamilyTreePageContent />
    </TreeProvider>
  );
}

export default FamilyTreePage;
