import { createContext, useContext, useState, useCallback } from 'react';

const TreeContext = createContext(null);

export const useTree = () => {
  const context = useContext(TreeContext);
  if (!context) {
    throw new Error('useTree must be used within a TreeProvider');
  }
  return context;
};

export const TreeProvider = ({ children }) => {
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(100); // 10-200%
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [showFirstTimeTooltip, setShowFirstTimeTooltip] = useState(false);

  const handleMemberClick = useCallback((memberId) => {
    setSelectedMemberId(memberId);
  }, []);

  const handleSearch = useCallback((query, members) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const results = members
      .filter(member => 
        member.firstName.toLowerCase().includes(lowerQuery) ||
        member.lastName.toLowerCase().includes(lowerQuery)
      )
      .map(member => member.id);
    
    setSearchResults(results);
  }, []);

  const handleZoomIn = useCallback(() => {
    setZoomLevel(prev => Math.min(200, prev + 10));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomLevel(prev => Math.max(10, prev - 10));
  }, []);

  const handleZoom = useCallback((delta) => {
    setZoomLevel(prev => Math.max(10, Math.min(200, prev + delta)));
  }, []);

  const handlePan = useCallback((deltaX, deltaY) => {
    setPanOffset(prev => ({
      x: prev.x + deltaX,
      y: prev.y + deltaY
    }));
  }, []);

  const handleReset = useCallback(() => {
    setZoomLevel(100);
    setPanOffset({ x: 0, y: 0 });
    setSelectedMemberId(null);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
  }, []);

  const dismissTooltip = useCallback(() => {
    setShowFirstTimeTooltip(false);
    localStorage.setItem('familyTreeTooltipDismissed', 'true');
  }, []);

  const checkFirstTimeVisit = useCallback(() => {
    const dismissed = localStorage.getItem('familyTreeTooltipDismissed');
    if (!dismissed) {
      setShowFirstTimeTooltip(true);
    }
  }, []);

  const value = {
    selectedMemberId,
    searchQuery,
    searchResults,
    zoomLevel,
    panOffset,
    showFirstTimeTooltip,
    handleMemberClick,
    handleSearch,
    handleZoomIn,
    handleZoomOut,
    handleZoom,
    handlePan,
    handleReset,
    clearSearch,
    dismissTooltip,
    checkFirstTimeVisit,
    setSelectedMemberId,
    setZoomLevel,
    setPanOffset,
  };

  return <TreeContext.Provider value={value}>{children}</TreeContext.Provider>;
};

export default TreeContext;
