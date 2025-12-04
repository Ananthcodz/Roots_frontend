import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import AuthService from '../services/AuthService';

// Mock axios
vi.mock('axios');

describe('AuthService Password Reset Property Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Feature: landing-auth-onboarding, Property 7: Password reset sends email
  // Validates: Requirements 5.2
  it('should send password reset email for any registered email address', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.emailAddress(),
        async (email) => {
          // Import axios to mock it
          const axios = (await import('axios')).default;
          
          // Clear mocks for this property test run
          vi.clearAllMocks();
          
          axios.post.mockResolvedValue({ data: {} });

          // Call requestPasswordReset
          await AuthService.requestPasswordReset(email);

          // Verify that axios.post was called with correct endpoint and email
          expect(axios.post).toHaveBeenCalledWith(
            expect.stringContaining('/auth/forgot-password'),
            { email }
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: landing-auth-onboarding, Property 8: Valid password update succeeds
  // Validates: Requirements 5.4
  it('should successfully update password for any valid token and password combination', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate valid reset token (simple string)
        fc.string({ minLength: 10, maxLength: 64 }),
        // Generate valid password (meets requirements: 8+ chars, uppercase, lowercase, number)
        fc.tuple(
          fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz'.split('')),
          fc.constantFrom(...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')),
          fc.constantFrom(...'0123456789'.split('')),
          fc.string({ minLength: 5 })
        ).map(([lower, upper, num, rest]) => {
          const chars = (lower + upper + num + rest).split('');
          for (let i = chars.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [chars[i], chars[j]] = [chars[j], chars[i]];
          }
          return chars.join('');
        }),
        async (token, newPassword) => {
          // Import axios to mock it
          const axios = (await import('axios')).default;
          
          // Clear mocks for this property test run
          vi.clearAllMocks();
          
          axios.post.mockResolvedValue({ data: {} });

          // Call resetPassword
          await AuthService.resetPassword(token, newPassword);

          // Verify that axios.post was called with correct parameters
          expect(axios.post).toHaveBeenCalledWith(
            expect.stringContaining('/auth/reset-password'),
            { token, newPassword }
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle expired token errors correctly', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 10, maxLength: 64 }),
        fc.tuple(
          fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz'.split('')),
          fc.constantFrom(...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')),
          fc.constantFrom(...'0123456789'.split('')),
          fc.string({ minLength: 5 })
        ).map(([lower, upper, num, rest]) => {
          const chars = (lower + upper + num + rest).split('');
          for (let i = chars.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [chars[i], chars[j]] = [chars[j], chars[i]];
          }
          return chars.join('');
        }),
        async (token, newPassword) => {
          // Import axios to mock it
          const axios = (await import('axios')).default;
          
          // Clear mocks for this property test run
          vi.clearAllMocks();
          
          const expiredError = new Error('Token has expired');
          axios.post.mockRejectedValue(expiredError);

          // Call resetPassword and expect it to throw
          await expect(AuthService.resetPassword(token, newPassword)).rejects.toThrow();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle invalid email errors for password reset', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.emailAddress(),
        async (email) => {
          // Import axios to mock it
          const axios = (await import('axios')).default;
          
          // Clear mocks for this property test run
          vi.clearAllMocks();
          
          const notFoundError = new Error('Email not found');
          axios.post.mockRejectedValue(notFoundError);

          // Call requestPasswordReset and expect it to throw
          await expect(AuthService.requestPasswordReset(email)).rejects.toThrow();
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('AuthContext Authentication Flow Property Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Feature: landing-auth-onboarding, Property 1: Valid account creation succeeds
  // Validates: Requirements 2.3
  it('should successfully create account for any valid registration data', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          email: fc.emailAddress(),
          password: fc.string({ minLength: 8, maxLength: 50 })
            .filter(p => /[A-Z]/.test(p) && /[a-z]/.test(p) && /[0-9]/.test(p)),
          fullName: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0)
        }),
        async ({ email, password, fullName }) => {
          const axios = (await import('axios')).default;
          
          // Clear mocks for this property test run
          vi.clearAllMocks();
          
          const mockResponse = {
            data: {
              user: {
                id: 'user-' + Date.now(),
                email,
                fullName,
                authProvider: 'email',
                createdAt: new Date().toISOString(),
                emailVerified: false
              },
              accessToken: 'mock-access-token',
              refreshToken: 'mock-refresh-token'
            }
          };
          axios.post.mockResolvedValue(mockResponse);

          // Call register
          const result = await AuthService.register(email, password, fullName);

          // Verify successful registration
          expect(result.user).toBeDefined();
          expect(result.user.email).toBe(email);
          expect(result.user.fullName).toBe(fullName);
          expect(result.accessToken).toBeDefined();
          expect(result.refreshToken).toBeDefined();
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: landing-auth-onboarding, Property 5: Valid credentials authenticate successfully
  // Validates: Requirements 4.3
  it('should successfully authenticate for any valid credentials', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          email: fc.emailAddress(),
          password: fc.string({ minLength: 8, maxLength: 50 })
            .filter(p => /[A-Z]/.test(p) && /[a-z]/.test(p) && /[0-9]/.test(p))
        }),
        async ({ email, password }) => {
          const axios = (await import('axios')).default;
          
          // Clear mocks for this property test run
          vi.clearAllMocks();
          
          const mockResponse = {
            data: {
              user: {
                id: 'user-' + Date.now(),
                email,
                fullName: 'Test User',
                authProvider: 'email',
                lastLoginAt: new Date().toISOString()
              },
              accessToken: 'mock-access-token',
              refreshToken: 'mock-refresh-token'
            }
          };
          axios.post.mockResolvedValue(mockResponse);

          // Call login
          const result = await AuthService.login(email, password);

          // Verify successful authentication
          expect(result.user).toBeDefined();
          expect(result.user.email).toBe(email);
          expect(result.accessToken).toBeDefined();
          expect(result.refreshToken).toBeDefined();
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: landing-auth-onboarding, Property 6: Invalid credentials are rejected
  // Validates: Requirements 4.4
  it('should reject invalid credentials', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          email: fc.emailAddress(),
          password: fc.string({ minLength: 8, maxLength: 50 })
        }),
        async ({ email, password }) => {
          const axios = (await import('axios')).default;
          
          // Clear mocks for this property test run
          vi.clearAllMocks();
          
          const invalidError = new Error('Invalid credentials');
          axios.post.mockRejectedValue(invalidError);

          // Call login and expect it to throw
          await expect(AuthService.login(email, password)).rejects.toThrow();
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('AuthContext SSO Flow Property Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Feature: landing-auth-onboarding, Property 3: SSO success creates account
  // Validates: Requirements 3.4
  it('should create account on successful SSO authentication', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom('google', 'apple'),
        fc.uuid(),
        async (provider, token) => {
          const axios = (await import('axios')).default;
          
          // Clear mocks for this property test run
          vi.clearAllMocks();
          
          const mockResponse = {
            data: {
              user: {
                id: 'user-' + Date.now(),
                email: 'test@example.com',
                fullName: 'Test User',
                authProvider: provider,
                createdAt: new Date().toISOString(),
                emailVerified: true
              },
              accessToken: 'mock-access-token',
              refreshToken: 'mock-refresh-token'
            }
          };
          axios.post.mockResolvedValue(mockResponse);

          // Call appropriate SSO method
          const result = provider === 'google' 
            ? await AuthService.loginWithGoogle(token)
            : await AuthService.loginWithApple(token);

          // Verify successful SSO authentication
          expect(result.user).toBeDefined();
          expect(result.user.authProvider).toBe(provider);
          expect(result.accessToken).toBeDefined();
          expect(result.refreshToken).toBeDefined();
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: landing-auth-onboarding, Property 4: SSO failure shows error
  // Validates: Requirements 3.5
  it('should handle SSO authentication failures', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom('google', 'apple'),
        fc.uuid(),
        async (provider, token) => {
          const axios = (await import('axios')).default;
          
          // Clear mocks for this property test run
          vi.clearAllMocks();
          
          const ssoError = new Error('SSO authentication failed');
          axios.post.mockRejectedValue(ssoError);

          // Call appropriate SSO method and expect it to throw
          const ssoCall = provider === 'google'
            ? AuthService.loginWithGoogle(token)
            : AuthService.loginWithApple(token);
          
          await expect(ssoCall).rejects.toThrow();
        }
      ),
      { numRuns: 100 }
    );
  });
});
