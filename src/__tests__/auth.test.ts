import { describe, it, expect, beforeEach } from 'vitest';
import { validatePassword, authRateLimiter, getGenericAuthError } from '../utils/security';

describe('Password Policy & Validation (Fintech Standard)', () => {
  it('should reject passwords with less than 12 characters', () => {
    const result = validatePassword('Short1@');
    expect(result.valid).toBe(false);
    expect(result.hasMinLength).toBe(false);
    expect(result.errors).toContain('Password must be at least 12 characters long.');
  });

  it('should reject passwords missing uppercase letters', () => {
    const result = validatePassword('lowercaseonly123!');
    expect(result.valid).toBe(false);
    expect(result.hasUppercase).toBe(false);
    expect(result.errors).toContain('Password must contain at least one uppercase letter (A-Z).');
  });

  it('should reject passwords missing lowercase letters', () => {
    const result = validatePassword('UPPERCASEONLY123!');
    expect(result.valid).toBe(false);
    expect(result.hasLowercase).toBe(false);
    expect(result.errors).toContain('Password must contain at least one lowercase letter (a-z).');
  });

  it('should reject passwords missing numeric digits', () => {
    const result = validatePassword('NoNumbersHereAtAll!');
    expect(result.valid).toBe(false);
    expect(result.hasNumber).toBe(false);
    expect(result.errors).toContain('Password must contain at least one number (0-9).');
  });

  it('should reject passwords missing special characters', () => {
    const result = validatePassword('NoSpecialChar12345');
    expect(result.valid).toBe(false);
    expect(result.hasSpecial).toBe(false);
    expect(result.errors).toContain('Password must contain at least one special character (!@#$%^&* etc.).');
  });

  it('should reject commonly compromised passwords even if 12+ chars', () => {
    const result = validatePassword('Password12345!');
    expect(result.valid).toBe(false);
    expect(result.isCommon).toBe(true);
    expect(result.errors).toContain('This password is too common or easily guessable. Please choose a unique passphrase.');
  });

  it('should accept strong, complex passwords that meet all fintech requirements', () => {
    const result = validatePassword('Kestrel#Vault2026!Secure');
    expect(result.valid).toBe(true);
    expect(result.hasMinLength).toBe(true);
    expect(result.hasUppercase).toBe(true);
    expect(result.hasLowercase).toBe(true);
    expect(result.hasNumber).toBe(true);
    expect(result.hasSpecial).toBe(true);
    expect(result.isCommon).toBe(false);
    expect(result.score).toBe(4);
    expect(result.errors).toHaveLength(0);
  });

  it('should support long passphrases per NIST SP 800-63B', () => {
    const result = validatePassword('correct-horse-battery-staple-aurum-99');
    expect(result.valid).toBe(true);
    expect(result.hasMinLength).toBe(true);
    expect(result.score).toBeGreaterThanOrEqual(3);
  });

  it('should correctly score passwords across the 0-4 spectrum', () => {
    expect(validatePassword('short').score).toBe(0);
    expect(validatePassword('twelvecharacters').score).toBe(1);
    expect(validatePassword('TwelveCharacters').score).toBe(2);
    expect(validatePassword('TwelveChar1!').score).toBe(3);
    expect(validatePassword('TwelveChars99!ExtraSecure').score).toBe(4);
  });
});

describe('Rate Limiter & Brute-Force Defense', () => {
  const testAccount = 'security-test@cardwatch.in';

  beforeEach(() => {
    authRateLimiter.reset(testAccount);
  });

  it('should allow initial attempts within threshold', () => {
    const check1 = authRateLimiter.check(testAccount, 5, 60000);
    expect(check1.allowed).toBe(true);
    expect(check1.waitSeconds).toBe(0);
  });

  it('should lock out account after exceeding 5 failed attempts within 60s', () => {
    for (let i = 0; i < 5; i++) {
      authRateLimiter.recordFailure(testAccount, 5, 60000);
    }

    const checkLocked = authRateLimiter.check(testAccount, 5, 60000);
    expect(checkLocked.allowed).toBe(false);
    expect(checkLocked.waitSeconds).toBeGreaterThan(0);
    expect(checkLocked.waitSeconds).toBeLessThanOrEqual(60);
  });

  it('should successfully reset lockout when reset() is called on successful login', () => {
    for (let i = 0; i < 5; i++) {
      authRateLimiter.recordFailure(testAccount, 5, 60000);
    }
    expect(authRateLimiter.check(testAccount, 5, 60000).allowed).toBe(false);

    authRateLimiter.reset(testAccount);
    expect(authRateLimiter.check(testAccount, 5, 60000).allowed).toBe(true);
    expect(authRateLimiter.check(testAccount, 5, 60000).waitSeconds).toBe(0);
  });
});

describe('Generic Error Messages & Anti-Enumeration', () => {
  it('should return generic error for invalid login credentials', () => {
    const error = { message: 'Invalid login credentials' };
    const result = getGenericAuthError(error);
    expect(result).toBe('Invalid email or password.');
  });

  it('should not leak whether an email exists on duplicate sign-up', () => {
    const error = { message: 'User already registered' };
    const result = getGenericAuthError(error);
    expect(result).toBe('If this email is already registered, please sign in or use the password recovery option.');
  });

  it('should return a user-friendly generic message on unknown internal errors without leaking port or system info', () => {
    const error = new Error('Database connection failed on port 5432: FATAL password authentication failed');
    const result = getGenericAuthError(error);
    expect(result).toBe('Invalid credentials or authentication request failed. Please verify your details.');
    expect(result).not.toContain('5432');
    expect(result).not.toContain('FATAL');
    expect(result).not.toContain('Database');
  });

  it('should handle rate limit messages safely', () => {
    const error = { message: 'too many requests rate limit exceeded' };
    const result = getGenericAuthError(error);
    expect(result).toContain('Too many login attempts.');
  });
});
