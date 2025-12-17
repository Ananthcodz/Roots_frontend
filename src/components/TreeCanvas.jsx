import { useRef, useEffect, useMemo, useCallback } from 'react';
import { useTree } from '../contexts/TreeContext';
import { buildTreeStructure } from '../utils/treeLayout';
import TreeNode from './TreeNode';
import './TreeCanvas.css';

/**
 * TreeCanvas component - Scrollable, zoomable canvas for family tree visualization
 * Handles pan and zoom interactions, renders tree structure
 */
const TreeCanvas = ({ 
  members, 
  relationships, 
  rootMemberId,
  onMemberClick, 
  onPlaceholderClick,
  rootCardRef
}) => {
  const { 
    selectedMemberId, 
    searchResults, 
    zoomLevel, 
    panOffset,
    handlePan,
    handleZoom,
    setSelectedMemberId
  } = useTree();
  
  const canvasRef = useRef(null);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const lastPanOffset = useRef({ x: 0, y: 0 });
  const rafId = useRef(null);
  const focusableNodesRef = useRef([]);

  // Memoize tree structure calculation - only recalculate when data changes
  const rootNode = useMemo(() => {
    return buildTreeStructure(members, relationships, rootMemberId);
  }, [members, relationships, rootMemberId]);

  // Handle mouse down - start dragging
  const handleMouseDown = (e) => {
    // Only start drag on left mouse button
    if (e.button !== 0) return;
    
    isDragging.current = true;
    dragStart.current = {
      x: e.clientX,
      y: e.clientY
    };
    lastPanOffset.current = { ...panOffset };
    
    // Change cursor
    if (canvasRef.current) {
      canvasRef.current.style.cursor = 'grabbing';
    }
  };

  // Handle mouse move - pan the canvas (debounced with RAF)
  const handleMouseMove = useCallback((e) => {
    if (!isDragging.current) return;

    // Cancel previous RAF if exists
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
    }

    // Schedule update for next frame
    rafId.current = requestAnimationFrame(() => {
      const deltaX = e.clientX - dragStart.current.x;
      const deltaY = e.clientY - dragStart.current.y;

      // Update pan offset
      handlePan(
        deltaX - (panOffset.x - lastPanOffset.current.x),
        deltaY - (panOffset.y - lastPanOffset.current.y)
      );
    });
  }, [handlePan, panOffset]);

  // Handle mouse up - stop dragging
  const handleMouseUp = () => {
    isDragging.current = false;
    
    // Reset cursor
    if (canvasRef.current) {
      canvasRef.current.style.cursor = 'grab';
    }
  };

  // Handle wheel - zoom
  const handleWheel = (e) => {
    e.preventDefault();
    
    // Determine zoom direction
    const delta = e.deltaY > 0 ? -10 : 10;
    handleZoom(delta);
  };

  // Handle touch start - start dragging or pinch zoom
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      // Single touch - pan
      isDragging.current = true;
      dragStart.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      };
      lastPanOffset.current = { ...panOffset };
    } else if (e.touches.length === 2) {
      // Two touches - pinch zoom
      isDragging.current = false;
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      dragStart.current = { distance, zoom: zoomLevel };
    }
  };

  // Handle touch move - pan or pinch zoom (debounced with RAF)
  const handleTouchMove = useCallback((e) => {
    e.preventDefault();
    
    // Cancel previous RAF if exists
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
    }

    // Schedule update for next frame
    rafId.current = requestAnimationFrame(() => {
      if (e.touches.length === 1 && isDragging.current) {
        // Single touch - pan
        const deltaX = e.touches[0].clientX - dragStart.current.x;
        const deltaY = e.touches[0].clientY - dragStart.current.y;

        handlePan(
          deltaX - (panOffset.x - lastPanOffset.current.x),
          deltaY - (panOffset.y - lastPanOffset.current.y)
        );
      } else if (e.touches.length === 2) {
        // Two touches - pinch zoom
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const distance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
        
        const scale = distance / dragStart.current.distance;
        const newZoom = dragStart.current.zoom * scale;
        const clampedZoom = Math.max(10, Math.min(200, newZoom));
        const zoomDelta = clampedZoom - zoomLevel;
        
        if (Math.abs(zoomDelta) > 1) {
          handleZoom(zoomDelta);
        }
      }
    });
  }, [handlePan, handleZoom, panOffset, zoomLevel]);

  // Handle touch end - stop dragging
  const handleTouchEnd = () => {
    isDragging.current = false;
  };

  // Collect focusable nodes for keyboard navigation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Get all focusable elements (member cards and placeholder cards)
    const focusableElements = canvas.querySelectorAll('[role="button"][tabindex="0"]');
    focusableNodesRef.current = Array.from(focusableElements);
  }, [members, relationships]); // Update when tree structure changes

  // Handle arrow key navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      const canvas = canvasRef.current;
      if (!canvas || !canvas.contains(document.activeElement)) return;

      const focusableNodes = focusableNodesRef.current;
      const currentIndex = focusableNodes.indexOf(document.activeElement);
      
      if (currentIndex === -1) return;

      let nextIndex = currentIndex;

      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          nextIndex = Math.min(currentIndex + 1, focusableNodes.length - 1);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          nextIndex = Math.max(currentIndex - 1, 0);
          break;
        case 'ArrowDown':
          e.preventDefault();
          // Move to next row (approximate by jumping several nodes)
          nextIndex = Math.min(currentIndex + 3, focusableNodes.length - 1);
          break;
        case 'ArrowUp':
          e.preventDefault();
          // Move to previous row (approximate by jumping several nodes)
          nextIndex = Math.max(currentIndex - 3, 0);
          break;
        default:
          return;
      }

      if (nextIndex !== currentIndex && focusableNodes[nextIndex]) {
        focusableNodes[nextIndex].focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Add event listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Mouse events
    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    // Wheel event
    canvas.addEventListener('wheel', handleWheel, { passive: false });
    
    // Touch events
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd);

    return () => {
      // Cancel any pending RAF
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
      
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('wheel', handleWheel);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleMouseMove, handleTouchMove]); // Only re-attach when callbacks change

  if (!rootNode) {
    return (
      <div className="tree-canvas-empty">
        <p>No family tree data available</p>
      </div>
    );
  }

  return (
    <div 
      ref={canvasRef}
      className="tree-canvas"
      style={{ cursor: 'grab' }}
    >
      <div 
        className="tree-canvas-content"
        style={{
          transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel / 100})`,
          transformOrigin: 'center center'
        }}
      >
        <TreeNode
          node={rootNode}
          allMembers={members}
          relationships={relationships}
          isRoot={true}
          isSelected={selectedMemberId === rootMemberId}
          isHighlighted={searchResults.includes(rootMemberId)}
          onMemberClick={onMemberClick}
          onPlaceholderClick={onPlaceholderClick}
          showPlaceholders={true}
          zoomLevel={zoomLevel}
          searchResults={searchResults}
          rootCardRef={rootCardRef}
        />
      </div>
    </div>
  );
};

export default TreeCanvas;
