import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import FamilyTreePage from './FamilyTreePage';
import { TreeProvider } from '../contexts/TreeContext';
import { FamilyProvider } from '../contexts/FamilyContext';
import { UserProvider } from '../contexts/UserContext';
import { AuthProvider } from '../contexts/AuthContext';

const AllProviders = ({ children }) => (
  <BrowserRouter>
    <AuthProvider>
      <UserProvider>
        <FamilyProvider>
          <TreeProvider>
            {children}
          </TreeProvider>
        </FamilyProvider>
      </UserProvider>
    </AuthProvider>
  </BrowserRouter>
);

describe('FamilyTreePage Integration Tests', () => {
  it('should render the family tree page without errors', () => {
    render(
      <AllProviders>
        <FamilyTreePage />
      </AllProviders>
    );

    // Verify page renders
    expect(screen.getByText(/loading your family tree/i) || screen.getByText(/family tree/i)).toBeTruthy();
  });

  it('should render navigation bar', () => {
    render(
      <AllProviders>
        <FamilyTreePage />
      </AllProviders>
    );

    // Check if navigation is present
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
  });

  it('should have proper page structure', () => {
    const { container } = render(
      <AllProviders>
        <FamilyTreePage />
      </AllProviders>
    );

    // Verify main page container exists
    const pageContainer = container.querySelector('.family-tree-page');
    expect(pageContainer).toBeInTheDocument();
  });
});
