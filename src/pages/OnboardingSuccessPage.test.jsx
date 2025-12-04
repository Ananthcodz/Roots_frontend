import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import * as fc from 'fast-check';
import OnboardingSuccessPage from './OnboardingSuccessPage';
import UserContext from '../contexts/UserContext';

// Mock the useNavigate hook
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe('OnboardingSuccessPage Property Tests', () => {
  afterEach(() => {
    cleanup();
  });

  // Feature: landing-auth-onboarding, Property 10: Success message is personalized
  // Validates: Requirements 7.1
  it('should display personalized success message with user first name', () => {
    fc.assert(
      fc.property(
        // Generate valid first names
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
        (firstName) => {
          const mockProfile = {
            firstName: firstName.trim(),
            lastName: 'TestUser',
            photoUrl: null
          };

          const mockUserContext = {
            profile: mockProfile,
            isLoading: false,
            updateProfile: vi.fn(),
            uploadProfilePhoto: vi.fn()
          };

          const { container } = render(
            <BrowserRouter>
              <UserContext.Provider value={mockUserContext}>
                <OnboardingSuccessPage />
              </UserContext.Provider>
            </BrowserRouter>
          );

          // Verify the success message contains the user's first name
          const heading = container.querySelector('h1');
          expect(heading).toBeInTheDocument();
          expect(heading.textContent).toContain(firstName.trim());
          // Escape special regex characters in firstName
          const escapedName = firstName.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          expect(heading.textContent).toMatch(new RegExp(`You're all set, ${escapedName}!`));
          
          // Cleanup after each property test run
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should display profile photo when photoUrl is provided', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
        fc.webUrl(),
        (firstName, photoUrl) => {
          const mockProfile = {
            firstName: firstName.trim(),
            lastName: 'TestUser',
            photoUrl
          };

          const mockUserContext = {
            profile: mockProfile,
            isLoading: false,
            updateProfile: vi.fn(),
            uploadProfilePhoto: vi.fn()
          };

          const { container } = render(
            <BrowserRouter>
              <UserContext.Provider value={mockUserContext}>
                <OnboardingSuccessPage />
              </UserContext.Provider>
            </BrowserRouter>
          );

          // Verify profile photo is displayed
          const profilePhoto = container.querySelector('.onboarding-success-photo img');
          expect(profilePhoto).toBeInTheDocument();
          expect(profilePhoto).toHaveAttribute('src', photoUrl);
          expect(profilePhoto).toHaveAttribute('alt', `${firstName.trim()}'s profile`);
          
          // Cleanup after each property test run
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should not display profile photo section when photoUrl is null', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
        (firstName) => {
          const mockProfile = {
            firstName: firstName.trim(),
            lastName: 'TestUser',
            photoUrl: null
          };

          const mockUserContext = {
            profile: mockProfile,
            isLoading: false,
            updateProfile: vi.fn(),
            uploadProfilePhoto: vi.fn()
          };

          const { container } = render(
            <BrowserRouter>
              <UserContext.Provider value={mockUserContext}>
                <OnboardingSuccessPage />
              </UserContext.Provider>
            </BrowserRouter>
          );

          // Verify profile photo section is not displayed
          const profilePhoto = container.querySelector('.onboarding-success-photo');
          expect(profilePhoto).not.toBeInTheDocument();
          
          // Cleanup after each property test run
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should use fallback greeting when profile is null', () => {
    const mockUserContext = {
      profile: null,
      isLoading: false,
      updateProfile: vi.fn(),
      uploadProfilePhoto: vi.fn()
    };

    const { container } = render(
      <BrowserRouter>
        <UserContext.Provider value={mockUserContext}>
          <OnboardingSuccessPage />
        </UserContext.Provider>
      </BrowserRouter>
    );

    // Verify fallback greeting is used
    const heading = container.querySelector('h1');
    expect(heading).toBeInTheDocument();
    expect(heading.textContent).toContain("You're all set, there!");
  });
});


describe('OnboardingSuccessPage Unit Tests', () => {
  it('should render success message correctly', () => {
    const mockUserContext = {
      profile: {
        firstName: 'John',
        lastName: 'Doe',
        photoUrl: null
      },
      isLoading: false,
      updateProfile: vi.fn(),
      uploadProfilePhoto: vi.fn()
    };

    const { container } = render(
      <BrowserRouter>
        <UserContext.Provider value={mockUserContext}>
          <OnboardingSuccessPage />
        </UserContext.Provider>
      </BrowserRouter>
    );

    const heading = container.querySelector('h1');
    expect(heading.textContent).toContain("You're all set, John!");
  });

  it('should render profile photo when provided', () => {
    const mockUserContext = {
      profile: {
        firstName: 'Jane',
        lastName: 'Smith',
        photoUrl: 'https://example.com/photo.jpg'
      },
      isLoading: false,
      updateProfile: vi.fn(),
      uploadProfilePhoto: vi.fn()
    };

    const { container } = render(
      <BrowserRouter>
        <UserContext.Provider value={mockUserContext}>
          <OnboardingSuccessPage />
        </UserContext.Provider>
      </BrowserRouter>
    );

    const photo = container.querySelector('.onboarding-success-photo img');
    expect(photo).toBeInTheDocument();
    expect(photo).toHaveAttribute('src', 'https://example.com/photo.jpg');
  });

  it('should render all action options', () => {
    const mockUserContext = {
      profile: {
        firstName: 'Test',
        lastName: 'User',
        photoUrl: null
      },
      isLoading: false,
      updateProfile: vi.fn(),
      uploadProfilePhoto: vi.fn()
    };

    const { container } = render(
      <BrowserRouter>
        <UserContext.Provider value={mockUserContext}>
          <OnboardingSuccessPage />
        </UserContext.Provider>
      </BrowserRouter>
    );

    // Check for option cards
    const optionCards = container.querySelectorAll('.option-card');
    expect(optionCards.length).toBe(2);
    
    // Check for skip button
    const skipButton = container.querySelector('.onboarding-success-skip');
    expect(skipButton).toBeInTheDocument();
    expect(skipButton.textContent).toContain('Skip for now, take me to Dashboard');
  });

  it('should display option titles and descriptions', () => {
    const mockUserContext = {
      profile: {
        firstName: 'Test',
        lastName: 'User',
        photoUrl: null
      },
      isLoading: false,
      updateProfile: vi.fn(),
      uploadProfilePhoto: vi.fn()
    };

    const { container } = render(
      <BrowserRouter>
        <UserContext.Provider value={mockUserContext}>
          <OnboardingSuccessPage />
        </UserContext.Provider>
      </BrowserRouter>
    );

    const optionTitles = container.querySelectorAll('.option-title');
    expect(optionTitles.length).toBe(2);
    
    const titleTexts = Array.from(optionTitles).map(item => item.textContent);
    expect(titleTexts).toContain('Start a New Tree');
    expect(titleTexts).toContain('Join Existing Tree');
  });
});
