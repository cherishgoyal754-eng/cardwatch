/**
 * CARDWATCH Security Utility
 * Implements strong password policy, NIST SP 800-63B passphrase support,
 * client-side rate limiting, and generic error mapping to prevent user enumeration.
 */

// Top commonly compromised passwords / patterns to reject
const COMMON_PASSWORDS_BLACKLIST = new Set([
  'password123456',
  'password1234!',
  'password12345!',
  '123456789012',
  'qwertyuiop12',
  'admin1234567',
  'admin1234567!',
  'welcome123456',
  'welcome12345!',
  'cardwatch1234',
  'iloveyou12345',
  'monkey1234567',
  'dragon1234567',
  'master1234567',
  'football12345',
  'superman12345',
  'trustno112345',
  'charlie123456',
  'donald1234567',
  'michael123456',
  'shadow1234567',
  'sunshine12345',
  'princess12345',
]);

export interface PasswordValidationResult {
  valid: boolean;
  score: 0 | 1 | 2 | 3 | 4;
  strengthLabel: 'Very Weak' | 'Weak' | 'Fair' | 'Strong' | 'Very Strong';
  errors: string[];
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
  isCommon: boolean;
}

/**
 * Validates a password according to fintech security standards:
 * - Minimum 12 characters (or long passphrases >= 20 chars)
 * - Uppercase letter (A-Z)
 * - Lowercase letter (a-z)
 * - Numeric digit (0-9)
 * - Special character (!@#$%^&* etc.)
 * - Rejects commonly compromised passwords
 */
export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];

  const hasMinLength = password.length >= 12;
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password);

  const normalized = password.toLowerCase().trim();
  const isCommon =
    COMMON_PASSWORDS_BLACKLIST.has(normalized) ||
    normalized.startsWith('password123') ||
    normalized.startsWith('admin123');

  if (!hasMinLength) {
    errors.push('Password must be at least 12 characters long.');
  }

  // Passphrase exception: if passphrase is 20+ chars with separators, lower restrictions apply per NIST
  const isLongPassphrase = password.length >= 20 && (password.includes(' ') || password.includes('-') || password.includes('_'));

  if (!isLongPassphrase) {
    if (!hasLowercase) {
      errors.push('Password must contain at least one lowercase letter (a-z).');
    }
    if (!hasUppercase) {
      errors.push('Password must contain at least one uppercase letter (A-Z).');
    }
    if (!hasNumber) {
      errors.push('Password must contain at least one number (0-9).');
    }
    if (!hasSpecial) {
      errors.push('Password must contain at least one special character (!@#$%^&* etc.).');
    }
  }

  if (isCommon) {
    errors.push('This password is too common or easily guessable. Please choose a unique passphrase.');
  }

  // Calculate score 0-4
  let score: 0 | 1 | 2 | 3 | 4 = 0;
  if (hasMinLength) score++;
  if (hasLowercase && hasUppercase) score++;
  if (hasNumber) score++;
  if ((hasSpecial && password.length >= 14) || isLongPassphrase) score++;

  if ((errors.length > 0 || isCommon) && score > 2) {
    score = 2;
  }

  const strengthLabels: Record<number, PasswordValidationResult['strengthLabel']> = {
    0: 'Very Weak',
    1: 'Weak',
    2: 'Fair',
    3: 'Strong',
    4: 'Very Strong',
  };

  return {
    valid: errors.length === 0,
    score,
    strengthLabel: strengthLabels[score],
    errors,
    hasMinLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecial,
    isCommon,
  };
}

/**
 * Client-side rate limiter for sensitive authentication operations
 * (e.g. login attempts, password reset requests)
 */
class RateLimiter {
  private attempts: Map<string, { count: number; lockUntil: number }> = new Map();

  /**
   * Check if action is allowed for the given key (e.g. email)
   */
  public check(key: string, maxAttempts = 5, lockDurationMs = 60000): { allowed: boolean; waitSeconds: number } {
    const now = Date.now();
    const record = this.attempts.get(key);

    if (!record) {
      return { allowed: true, waitSeconds: 0 };
    }

    if (record.lockUntil > now) {
      const waitSeconds = Math.ceil((record.lockUntil - now) / 1000);
      return { allowed: false, waitSeconds };
    }

    // Reset if lock has expired
    if (record.lockUntil > 0 && record.lockUntil <= now) {
      this.attempts.delete(key);
      return { allowed: true, waitSeconds: 0 };
    }

    if (record.count >= maxAttempts) {
      record.lockUntil = now + lockDurationMs;
      const waitSeconds = Math.ceil(lockDurationMs / 1000);
      return { allowed: false, waitSeconds };
    }

    return { allowed: true, waitSeconds: 0 };
  }

  /**
   * Record a failed attempt
   */
  public recordFailure(key: string, maxAttempts = 5, lockDurationMs = 60000): void {
    const now = Date.now();
    const record = this.attempts.get(key) || { count: 0, lockUntil: 0 };
    record.count++;

    if (record.count >= maxAttempts) {
      record.lockUntil = now + lockDurationMs;
    }

    this.attempts.set(key, record);
  }

  /**
   * Reset attempts upon successful authentication
   */
  public reset(key: string): void {
    this.attempts.delete(key);
  }
}

export const authRateLimiter = new RateLimiter();

/**
 * Sanitizes auth error messages into user-friendly generic messages
 * to prevent account enumeration and avoid exposing internal database stack traces.
 */
export function getGenericAuthError(error: any): string {
  if (!error) return 'An unexpected error occurred. Please try again.';

  const message = (error.message || '').toLowerCase();

  if (message.includes('invalid login credentials') || message.includes('invalid_grant')) {
    return 'Invalid email or password.';
  }

  if (message.includes('email not confirmed')) {
    return 'Please verify your email address before signing in. Check your inbox for the verification link.';
  }

  if (message.includes('user already registered') || message.includes('already exists')) {
    // Avoid confirming account existence
    return 'If this email is already registered, please sign in or use the password recovery option.';
  }

  if (message.includes('rate limit') || message.includes('too many requests')) {
    return 'Too many login attempts. For security reasons, please wait a minute before trying again.';
  }

  return 'Invalid credentials or authentication request failed. Please verify your details.';
}
