# Implementation Plan

- [x] 1. Set up project structure and dependencies
  - Install required dependencies: react-router-dom, axios, react-hook-form, zod, fast-check
  - Configure routing structure with React Router
  - Set up context providers for Auth and User
  - Create folder structure for pages, components, services, contexts, and utils
  - _Requirements: All_

- [x] 2. Implement validation service and utilities
  - [x] 2.1 Create ValidationService with email, password, and file validation methods
    - Implement email format validation
    - Implement password strength validation (8+ chars, uppercase, lowercase, number)
    - Implement file size and type validation
    - _Requirements: 8.1, 8.2, 9.3, 10.4, 10.5_

  - [x] 2.2 Write property test for email validation
    - **Property 2: Invalid email formats are rejected**
    - **Validates: Requirements 2.5**

  - [x] 2.3 Write property test for password validation
    - **Property 11: Short passwords are rejected**
    - **Property 12: Passwords without required characters are rejected**
    - **Validates: Requirements 8.1, 8.2**

  - [x] 2.4 Write property test for file validation
    - **Property 22: Non-image files are rejected**
    - **Validates: Requirements 10.5**

- [x] 3. Create shared UI components
  - [x] 3.1 Implement Button component with variants (primary, secondary, outline)
    - Create reusable button with size and variant props
    - Add disabled state styling
    - _Requirements: 1.4, 1.5, 2.1_

  - [x] 3.2 Implement Input component with validation error display
    - Create text, email, password, and date input types
    - Add inline error message display
    - Add required field indicator
    - _Requirements: 2.2, 4.2, 6.2, 9.1_

  - [x] 3.3 Implement Select component for dropdown fields
    - Create dropdown with options and placeholder
    - Add error state display
    - _Requirements: 6.2_

  - [x] 3.4 Implement ImageUpload component
    - Create circular photo upload with camera icon
    - Add file picker integration
    - Add image preview functionality
    - Add file size and type validation
    - _Requirements: 6.3, 10.1, 10.2, 10.3, 10.4, 10.5_

  - [x] 3.5 Implement SSOButton component for Google and Apple
    - Create SSO button with provider icons
    - Add disabled state
    - _Requirements: 3.1, 4.5_

  - [x] 3.6 Implement FormError component for inline error messages
    - Create error message display component
    - _Requirements: 9.1_

  - [x] 3.7 Implement StepIndicator component
    - Create step progress indicator showing "STEP X OF Y"
    - _Requirements: 6.1_

  - [x] 3.8 Write unit tests for shared components
    - Test Button renders with correct variants
    - Test Input displays errors correctly
    - Test ImageUpload validates files
    - Test FormError displays messages

- [x] 4. Implement authentication service layer
  - [x] 4.1 Create AuthService with API methods
    - Implement register method for email/password signup
    - Implement login method for email/password signin
    - Implement loginWithGoogle for Google OAuth
    - Implement loginWithApple for Apple Sign-In
    - Implement requestPasswordReset method
    - Implement resetPassword method
    - Implement logout method
    - Add password hashing integration
    - _Requirements: 2.3, 3.2, 3.3, 4.3, 5.2, 5.4, 8.4_

  - [x] 4.2 Write property test for password hashing
    - **Property 14: Passwords are hashed before storage**
    - **Property 15: Authentication uses hashed comparison**
    - **Validates: Requirements 8.4, 8.5**

  - [x] 4.3 Write unit tests for AuthService
    - Test register calls API with correct parameters
    - Test login handles valid and invalid credentials
    - Test password reset sends email
    - Test error handling for API failures

- [x] 5. Implement user service layer
  - [x] 5.1 Create UserService with profile management methods
    - Implement getProfile method
    - Implement updateProfile method
    - Implement uploadPhoto method with compression
    - _Requirements: 6.4, 10.3_

  - [x] 5.2 Write unit tests for UserService
    - Test updateProfile calls API correctly
    - Test uploadPhoto handles file upload
    - Test error handling

- [x] 6. Implement AuthContext provider
  - [x] 6.1 Create AuthContext with authentication state management
    - Implement signUp method
    - Implement signIn method
    - Implement signInWithGoogle method
    - Implement signInWithApple method
    - Implement signOut method
    - Implement resetPassword method
    - Add loading and error state management
    - Add token persistence to localStorage
    - _Requirements: 2.3, 3.4, 4.3, 5.2_

  - [x] 6.2 Write property test for authentication flows
    - **Property 1: Valid account creation succeeds**
    - **Property 5: Valid credentials authenticate successfully**
    - **Validates: Requirements 2.3, 4.3**

  - [x] 6.3 Write property test for SSO flows
    - **Property 3: SSO success creates account**
    - **Property 4: SSO failure shows error**
    - **Validates: Requirements 3.4, 3.5**

  - [x] 6.4 Write property test for invalid credentials
    - **Property 6: Invalid credentials are rejected**
    - **Validates: Requirements 4.4**

- [x] 7. Implement UserContext provider
  - [x] 7.1 Create UserContext with profile state management
    - Implement updateProfile method
    - Implement uploadProfilePhoto method
    - Add loading state management
    - _Requirements: 6.4, 10.3_

  - [x] 7.2 Write unit tests for UserContext
    - Test profile updates correctly
    - Test photo upload works
    - Test state management

- [x] 8. Implement Landing Page
  - [x] 8.1 Create LandingPage component with all sections
    - Implement hero section with tagline and CTA buttons
    - Implement statistics section (2M+ families, 50M+ trees, 150+ countries)
    - Implement features grid (Interactive Tree, Privacy First, Collaborative Albums, Audio Stories)
    - Implement conversion section with "Ready to plant your tree?" CTA
    - Implement navigation header with Login/Get Started buttons
    - Add responsive styling
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

  - [x] 8.2 Write unit tests for LandingPage
    - Test hero section renders correctly
    - Test statistics display correctly
    - Test feature cards render
    - Test navigation buttons work
    - Test CTA buttons navigate correctly

- [x] 9. Implement Sign Up Page
  - [x] 9.1 Create SignUpPage component with form validation
    - Implement account creation form with Full Name, Email, Password fields
    - Add real-time validation with error display
    - Add SSO buttons for Google and Apple
    - Implement form submission with loading state
    - Add "Already have an account? Sign in" link
    - Handle duplicate email error
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 9.1, 9.2, 9.3, 9.4, 9.5_

  - [x] 9.2 Write property test for form validation
    - **Property 16: Invalid field data shows inline errors**
    - **Property 17: Empty required fields show errors**
    - **Property 18: Invalid email shows specific message**
    - **Property 19: Correcting fields clears errors**
    - **Property 20: Valid forms enable submit button**
    - **Validates: Requirements 9.1, 9.2, 9.3, 9.4, 9.5**

  - [x] 9.3 Write property test for password validation feedback
    - **Property 13: Invalid passwords show feedback**
    - **Validates: Requirements 8.3**

- [x] 10. Implement Sign In Page
  - [x] 10.1 Create SignInPage component with authentication
    - Implement sign-in form with Email and Password fields
    - Add validation and error display
    - Add SSO buttons for Google and Apple
    - Add "Forgot password?" link
    - Add "Don't have an account? Sign up" link
    - Handle invalid credentials error
    - Navigate to dashboard on success
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [x] 10.2 Write unit tests for SignInPage
    - Test form renders correctly
    - Test validation works
    - Test navigation on success
    - Test error display on failure

- [x] 11. Implement Forgot Password flow
  - [x] 11.1 Create ForgotPasswordPage component
    - Implement password reset request form
    - Add email input with validation
    - Show success message when email sent
    - _Requirements: 5.1, 5.2_

  - [x] 11.2 Create ResetPasswordPage component
    - Implement new password form
    - Add password validation
    - Handle expired token error
    - Navigate to sign-in on success
    - _Requirements: 5.3, 5.4, 5.5_

  - [x] 11.3 Write property test for password reset
    - **Property 7: Password reset sends email**
    - **Property 8: Valid password update succeeds**
    - **Validates: Requirements 5.2, 5.4**

- [x] 12. Implement Profile Setup Page
  - [x] 12.1 Create ProfileSetupPage component
    - Implement profile form with First Name, Last Name, DOB, Gender, Place of Birth
    - Add step indicator showing "STEP 1 OF 3"
    - Add profile photo upload with preview
    - Add validation for all fields
    - Add "Continue" button and "I'll do this later" link
    - Navigate to success screen on submit
    - Navigate to dashboard on skip
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 10.1, 10.2, 10.3_

  - [x] 12.2 Write property test for profile data
    - **Property 9: Valid profile data saves successfully**
    - **Validates: Requirements 6.4**

  - [x] 12.3 Write property test for image preview
    - **Property 21: Valid images show preview**
    - **Validates: Requirements 10.3**

- [x] 13. Implement Onboarding Success Page
  - [x] 13.1 Create OnboardingSuccessPage component
    - Display personalized success message "You're all set, [firstName]!"
    - Show user's profile photo
    - Add three action buttons: "Start a New Tree", "Join Existing Tree", "Skip for now, take me to Dashboard"
    - Implement navigation for each button
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

  - [x] 13.2 Write property test for personalization
    - **Property 10: Success message is personalized**
    - **Validates: Requirements 7.1**

  - [x] 13.3 Write unit tests for OnboardingSuccessPage
    - Test success message displays correctly
    - Test profile photo renders
    - Test navigation buttons work

- [-] 14. Implement routing and navigation
  - [x] 14.1 Set up React Router with all routes
    - Configure routes for landing, signup, signin, forgot-password, reset-password, profile-setup, success
    - Add protected routes for authenticated pages
    - Add redirect logic for authenticated users accessing auth pages
    - _Requirements: All navigation requirements_

  - [ ] 14.2 Write integration tests for routing
    - Test navigation between pages
    - Test protected route access
    - Test redirect behavior

- [-] 15. Add error handling and loading states
  - [x] 15.1 Implement error boundaries for component errors
    - Create ErrorBoundary component
    - Add fallback UI for errors
    - _Requirements: Error handling_

  - [x] 15.2 Add loading states to all async operations
    - Add loading spinners to form submissions
    - Add skeleton screens for page transitions
    - Add loading states to image uploads
    - _Requirements: All async operations_

  - [ ] 15.3 Write unit tests for error handling
    - Test error boundaries catch errors
    - Test loading states display correctly
    - Test error messages display correctly

- [-] 16. Implement accessibility features
  - [x] 16.1 Add ARIA labels and semantic HTML
    - Add labels to all form inputs
    - Add ARIA descriptions to error messages
    - Use semantic HTML elements
    - Add keyboard navigation support
    - _Requirements: Accessibility_

  - [ ] 16.2 Test accessibility compliance
    - Test keyboard navigation works
    - Test screen reader compatibility
    - Test color contrast ratios

- [-] 17. Add responsive design and styling
  - [x] 17.1 Implement responsive layouts for all pages
    - Add mobile-first CSS
    - Test on different screen sizes
    - Ensure touch-friendly tap targets
    - _Requirements: Responsive design_

  - [ ] 17.2 Test responsive design
    - Test on mobile viewports
    - Test on tablet viewports
    - Test on desktop viewports

- [x] 18. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
