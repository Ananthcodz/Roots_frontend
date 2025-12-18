import { useEffect, useRef, useState } from 'react';
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
import AddRelativeModal from '../components/AddRelativeModal';
import './FamilyTreePage.css';

function FamilyTreePageContent() {
  const { familyMembers, relationships, getFamilyMembers, getRelationships, addFamilyMember, error } = useFamily();
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [showAddRelativeModal, setShowAddRelativeModal] = useState(false);
  const [addRelativeType, setAddRelativeType] = useState(null);
  const [addRelativeRelatedTo, setAddRelativeRelatedTo] = useState(null);
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
      } finally {
        setInitialLoadComplete(true);
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
    if (initialLoadComplete) {
      // Check if this is first visit (no family members added yet, only tree owner)
      const hasAddedMembers = familyMembers.length > 1 || relationships.length > 0;
      
      if (!hasAddedMembers) {
        checkFirstTimeVisit();
      }
    }
  }, [initialLoadComplete, familyMembers, relationships, checkFirstTimeVisit]);

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

  const openAddRelativeModal = (type, relatedTo) => {
    setAddRelativeType(type);
    setAddRelativeRelatedTo(relatedTo);
    setShowAddRelativeModal(true);
  };

  const handlePlaceholderClick = (type, relatedTo) => {
    openAddRelativeModal(type, relatedTo);
  };

  const handleAddParents = () => {
    openAddRelativeModal('parent', user?.id);
  };

  const handleAddSpouse = () => {
    openAddRelativeModal('spouse', user?.id);
  };

  const handleAddChildren = () => {
    openAddRelativeModal('child', user?.id);
  };

  const handleCloseAddRelativeModal = () => {
    setShowAddRelativeModal(false);
    setAddRelativeType(null);
    setAddRelativeRelatedTo(null);
  };

  const handleAddRelativeSubmit = async (formData) => {
    try {
      await addFamilyMember({
        ...formData,
        relatedTo: addRelativeRelatedTo,
        relationshipType: addRelativeType,
      });
      handleCloseAddRelativeModal();
      // Refresh the family data
      await getFamilyMembers(true);
      await getRelationships(true);
    } catch (err) {
      console.error('Failed to add family member:', err);
    }
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
    // Open modal to add relative to selected member
    openAddRelativeModal(null, selectedMemberId);
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

  if (!initialLoadComplete) {
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
      <div className="tree-controls-bar">
        <SearchInput
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search tree..."
          debounceMs={300}
          resultsCount={searchQuery ? searchResults.length : null}
        />
        <ZoomControls />
      </div>
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
      
      {showAddRelativeModal && (
        <AddRelativeModal
          isOpen={showAddRelativeModal}
          onClose={handleCloseAddRelativeModal}
          onSubmit={handleAddRelativeSubmit}
          relationshipType={addRelativeType}
          relatedToMember={familyMembers.find(m => m.id === addRelativeRelatedTo) || treeOwner}
        />
      )}
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
