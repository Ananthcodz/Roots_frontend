import { createContext, useContext, useState } from 'react';
import FamilyService from '../services/FamilyService';

const FamilyContext = createContext(null);

export const useFamily = () => {
  const context = useContext(FamilyContext);
  if (!context) {
    throw new Error('useFamily must be used within a FamilyProvider');
  }
  return context;
};

export const FamilyProvider = ({ children }) => {
  const [familyMembers, setFamilyMembers] = useState([]);
  const [relationships, setRelationships] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mock mode for development (when no backend is available)
  const MOCK_MODE = import.meta.env.VITE_MOCK_API === 'true';

  const addFamilyMember = async (memberData) => {
    try {
      setIsLoading(true);
      setError(null);

      if (MOCK_MODE) {
        // Mock response for development
        await new Promise(resolve => setTimeout(resolve, 500));
        const newMember = {
          id: 'mock-member-' + Date.now(),
          userId: null,
          ...memberData,
          createdBy: 'mock-user-id',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setFamilyMembers(prev => [...prev, newMember]);
        
        // Create relationship if provided
        if (memberData.relatedTo && memberData.relationshipType) {
          const newRelationship = {
            id: 'mock-relationship-' + Date.now(),
            fromUserId: memberData.relatedTo,
            toUserId: newMember.id,
            relationshipType: memberData.relationshipType,
            specificLabel: memberData.specificLabel || null,
            createdAt: new Date().toISOString(),
          };
          setRelationships(prev => [...prev, newRelationship]);
        }
        
        return newMember;
      }

      const newMember = await FamilyService.addFamilyMember(memberData);
      setFamilyMembers(prev => [...prev, newMember]);
      
      // Refresh relationships if a relationship was created
      if (memberData.relatedTo && memberData.relationshipType) {
        await getRelationships();
      }
      
      return newMember;
    } catch (err) {
      setError(err.message || 'Failed to add family member');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateFamilyMember = async (memberId, memberData) => {
    try {
      setIsLoading(true);
      setError(null);

      if (MOCK_MODE) {
        // Mock response for development
        await new Promise(resolve => setTimeout(resolve, 500));
        const updatedMember = {
          ...memberData,
          id: memberId,
          updatedAt: new Date().toISOString(),
        };
        setFamilyMembers(prev =>
          prev.map(member => (member.id === memberId ? updatedMember : member))
        );
        return updatedMember;
      }

      const updatedMember = await FamilyService.updateFamilyMember(memberId, memberData);
      setFamilyMembers(prev =>
        prev.map(member => (member.id === memberId ? updatedMember : member))
      );
      return updatedMember;
    } catch (err) {
      setError(err.message || 'Failed to update family member');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getFamilyMembers = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (MOCK_MODE) {
        // Mock response for development
        await new Promise(resolve => setTimeout(resolve, 500));
        // Return existing family members from state
        return familyMembers;
      }

      const members = await FamilyService.getFamilyMembers();
      setFamilyMembers(members);
      return members;
    } catch (err) {
      setError(err.message || 'Failed to fetch family members');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getRelationships = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (MOCK_MODE) {
        // Mock response for development
        await new Promise(resolve => setTimeout(resolve, 500));
        // Return existing relationships from state
        return relationships;
      }

      const rels = await FamilyService.getRelationships();
      setRelationships(rels);
      return rels;
    } catch (err) {
      setError(err.message || 'Failed to fetch relationships');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    familyMembers,
    relationships,
    isLoading,
    error,
    addFamilyMember,
    updateFamilyMember,
    getFamilyMembers,
    getRelationships,
  };

  return <FamilyContext.Provider value={value}>{children}</FamilyContext.Provider>;
};

export default FamilyContext;
