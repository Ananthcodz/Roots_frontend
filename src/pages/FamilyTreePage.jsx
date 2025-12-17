import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFamily } from '../contexts/FamilyContext';
import { useUser } from '../contexts/UserContext';
import { TreeProvider, useTree } from '../contexts/TreeContext';
import NavigationBar from '../components/NavigationBar';
import TreeCanvas from '../components/TreeCanvas';
import ZoomControls from '../components/ZoomControls';
import SearchInput from '../components/SearchInput';
import TreeOwnerProfile from '../components/TreeOwnerProfile';
import MemberDetailPanel from '../components/MemberDetailPanel';
import FirstTimeTooltip from '../components/FirstTimeTooltip';
import './FamilyTreePage.css';

function FamilyTreePageContent() {
  const { familyMembers, relationships, getFamilyMembers, getRelationships, isLoading, error } = useFamily();
  const { user } = useUser();
  const { 
    handleMemberClick, 
    searchQuery, 
    handleSearch, 
    clearSearch, 
    selectedMemberId,
    setSelectedMemberId,
    searchResults,
    showFirstTimeTooltip,
    dismissTooltip,
    checkFirstTimeVisit
  } = useTree();
  const navigate = useNavigate();
  const rootCardRef = useRef(null);
  const toolbarRef = useRef(null);
  const sidebarRef = useRef(null);
  const treeContentRef = useRef(null);

  useEffect(() => {
    // Load family data on mount and when returning to the page
    const loadData = async () => {
      try {
        await getFamilyMembers();
        await getRelationships();
      } catch (err) {
        console.error('Failed to load family tree data:', err);
      }
    };

    loadData();
    
    // Also refresh when the page becomes visible (user returns from another tab/page)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadData();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [getFamilyMembers, getRelationships]);

  // Check for first-time visit after data loads
  useEffect(() => {
    if (!isLoading && familyMembers.length > 0) {
      // Check if this is first visit (no family members added yet, only tree owner)
      const hasAddedMembers = familyMembers.length > 1 || relationships.length > 0;
      
      if (!hasAddedMembers) {
        checkFirstTimeVisit();
      }
    }
  }, [isLoading, familyMembers, relationships, checkFirstTimeVisit]);

  // Dismiss tooltip when first member is added
  useEffect(() => {
    if (showFirstTimeTooltip && (familyMembers.length > 1 || relationships.length > 0)) {
      dismissTooltip();
    }
  }, [familyMembers.length, relationships.length, showFirstTimeTooltip, dismissTooltip]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Escape key closes detail panel
      if (e.key === 'Escape' && selectedMemberId) {
        e.preventDefault();
        setSelectedMemberId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedMemberId, setSelectedMemberId]);

  const handlePlaceholderClick = (type, relatedTo) => {
    // Navigate to add member form with relationship type and related member
    navigate(`/add-family-member?type=${type}&relatedTo=${relatedTo}`);
  };

  const handleAddParents = () => {
    navigate(`/add-family-member?type=parent&relatedTo=${user?.id}`);
  };

  const handleAddSpouse = () => {
    navigate(`/add-family-member?type=spouse&relatedTo=${user?.id}`);
  };

  const handleAddChildren = () => {
    navigate(`/add-family-member?type=child&relatedTo=${user?.id}`);
  };

  const handleProfileClick = () => {
    // Navigate to member profile page (to be implemented)
    console.log('Profile clicked for member:', selectedMemberId);
  };

  const handleEditClick = () => {
    // Navigate to edit member page (to be implemented)
    navigate(`/edit-family-member/${selectedMemberId}`);
  };

  const handleAddRelativeClick = () => {
    // Navigate to add member form with selected member as related to
    navigate(`/add-family-member?relatedTo=${selectedMemberId}`);
  };

  const handleRelatedMemberClick = (memberId) => {
    // Select the related member
    handleMemberClick(memberId);
  };

  const handleTracePath = (startId, targetId) => {
    // Path calculation is now handled in RelationshipExplorer component
    // This callback can be used for analytics or additional actions
    console.log('Tracing path from', startId, 'to', targetId);
  };

  // Check if user has a spouse
  const hasSpouse = relationships.some(
    rel => 
      (rel.fromUserId === user?.id && rel.relationshipType === 'spouse') ||
      (rel.toUserId === user?.id && rel.relationshipType === 'spouse')
  );

  // Find the tree owner (current user) as a family member
  const treeOwner = familyMembers.find(member => member.userId === user?.id) || {
    id: user?.id || 'unknown',
    firstName: user?.firstName || 'User',
    lastName: user?.lastName || '',
    dateOfBirth: user?.dateOfBirth || null,
    photoUrl: user?.photoUrl || null,
  };

  if (isLoading) {
    return (
      <div className="family-tree-page">
        <NavigationBar />
        <div className="loading-container" role="status" aria-live="polite">
          <p>Loading your family tree...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="family-tree-page">
        <NavigationBar />
        <div className="error-container" role="alert" aria-live="assertive">
          <p className="error-message">{error}</p>
          <button onClick={() => window.location.reload()} aria-label="Retry loading family tree">
            Retry
          </button>
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
      <div className="tree-toolbar" ref={toolbarRef}>
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
            resultsCount={searchQuery ? searchResults.length : null}
          />
        </div>
      </div>
      <ZoomControls />
      <div className="tree-main-content">
        <aside className="tree-sidebar" ref={sidebarRef}>
          {!selectedMemberId ? (
            <TreeOwnerProfile
              treeOwner={treeOwner}
              onAddParents={handleAddParents}
              onAddSpouse={handleAddSpouse}
              onAddChildren={handleAddChildren}
              hasSpouse={hasSpouse}
            />
          ) : (
            <MemberDetailPanel
              selectedMember={familyMembers.find(m => m.id === selectedMemberId)}
              allMembers={familyMembers}
              relationships={relationships}
              treeOwner={treeOwner}
              onProfileClick={handleProfileClick}
              onEditClick={handleEditClick}
              onAddRelativeClick={handleAddRelativeClick}
              onRelatedMemberClick={handleRelatedMemberClick}
              onTracePath={handleTracePath}
            />
          )}
        </aside>
        <div className="tree-content" ref={treeContentRef}>
          <TreeCanvas
            members={familyMembers}
            relationships={relationships}
            rootMemberId={user?.id}
            onMemberClick={handleMemberClick}
            onPlaceholderClick={handlePlaceholderClick}
            rootCardRef={rootCardRef}
          />
          <FirstTimeTooltip
            show={showFirstTimeTooltip}
            onDismiss={dismissTooltip}
            targetRef={rootCardRef}
          />
        </div>
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
