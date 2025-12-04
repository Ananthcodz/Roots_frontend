import { useRef, useEffect } from 'react';
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
  onPlaceholderClick 
}) => {
  const { 
    selectedMemberId, 
    searchResults, 
    zoomLevel, 
    panOffset,
    handlePan,
    handleZoom
  } = useTree();
  
  const canvasRef = useRef(null);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const lastPanOffset = useRef({ x: 0, y: 0 });

  // Build tree structure from members and relationships
  const rootNode = buildTreeStructure(members, relationships, rootMemberId);

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

  // Handle mouse move - pan the canvas
  const handleMouseMove = (e) => {
    if (!isDragging.current) return;

    const deltaX = e.clientX - dragStart.current.x;
    const deltaY = e.clientY - dragStart.current.y;

    // Update pan offset
    handlePan(
      deltaX - (panOffset.x - lastPanOffset.current.x),
      deltaY - (panOffset.y - lastPanOffset.current.y)
    );
  };

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

  // Handle touch move - pan or pinch zoom
  const handleTouchMove = (e) => {
    e.preventDefault();
    
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
  };

  // Handle touch end - stop dragging
  const handleTouchEnd = () => {
    isDragging.current = false;
  };

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
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('wheel', handleWheel);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, [panOffset, zoomLevel]); // Re-attach when pan/zoom changes

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
        />
      </div>
    </div>
  );
};

export default TreeCanvas;
