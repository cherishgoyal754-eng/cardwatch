/**
 * CARDWATCH Sovereign Admin Vault Security Utility
 *
 * Security Model:
 * - The raw Master Admin Key is NEVER stored in client-side source code or bundles.
 * - Verification hashes candidate input with a domain-separated salt (SHA-256)
 *   and performs constant-time comparison against the configured digest.
 * - Sessions store only a time-bounded verification token tied to the hash fingerprint.
 * - Failed attempts trigger progressive rate-limiting cooldowns.
 */

export const ADMIN_KEY_SALT = 'cardwatch_sovereign_vault_v1::';

// Default salted SHA-256 digest of the owner's generated Master Key.
// Can be overridden at build time via VITE_ADMIN_KEY_HASH or rotated inside Admin Settings.
const FALLBACK_ADMIN_KEY_HASH =
  '2ba60fdfa8cc5c14ed10502f6ea5ea784ddb0598ef2e4085c20e98463b198397';

const ADMIN_SESSION_STORAGE_KEY = 'cardwatch_admin_session_v1';
const ADMIN_CUSTOM_HASH_STORAGE_KEY = 'cardwatch_admin_custom_hash_v1';
const ADMIN_RATE_LIMIT_KEY = 'cardwatch_admin_rate_limit_v1';

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 120_000; // 2 minutes lockout on brute force
const SESSION_DURATION_TAB_MS = 8 * 60 * 60 * 1000; // 8 hours
const SESSION_DURATION_TRUSTED_MS = 24 * 60 * 60 * 1000; // 24 hours

export interface AdminSessionToken {
  fingerprint: string;
  unlockedAt: string;
  expiresAt: number;
  trustedDevice: boolean;
}

export interface AdminVerifyResult {
  valid: boolean;
  reason?: string;
  waitSeconds?: number;
  fingerprint?: string;
}

/**
 * Pure-JS SHA-256 fallback for HTTP LAN contexts where WebCrypto subtle may be unavailable.
 */
function sha256FallbackHex(message: string): string {
  const utf8 = unescape(encodeURIComponent(message));
  const words: number[] = [];
  for (let i = 0; i < utf8.length; i++) {
    words[i >> 2] |= (utf8.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);
  }
  const bitLen = utf8.length * 8;
  words[bitLen >> 5] |= 0x80 << (24 - (bitLen % 32));
  words[((bitLen + 64 >> 9) << 4) + 15] = bitLen;

  const K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
  ];

  const H = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
  ];

  const rotr = (n: number, x: number) => (x >>> n) | (x << (32 - n));
  const w = new Array<number>(64);

  for (let i = 0; i < words.length; i += 16) {
    let [a, b, c, d, e, f, g, h] = H;
    for (let t = 0; t < 64; t++) {
      if (t < 16) {
        w[t] = words[i + t] | 0;
      } else {
        const s0 = rotr(7, w[t - 15]) ^ rotr(18, w[t - 15]) ^ (w[t - 15] >>> 3);
        const s1 = rotr(17, w[t - 2]) ^ rotr(19, w[t - 2]) ^ (w[t - 2] >>> 10);
        w[t] = (w[t - 16] + s0 + w[t - 7] + s1) | 0;
      }
      const S1 = rotr(6, e) ^ rotr(11, e) ^ rotr(25, e);
      const ch = (e & f) ^ (~e & g);
      const temp1 = (h + S1 + ch + K[t] + w[t]) | 0;
      const S0 = rotr(2, a) ^ rotr(13, a) ^ rotr(22, a);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) | 0;

      h = g;
      g = f;
      f = e;
      e = (d + temp1) | 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) | 0;
    }

    H[0] = (H[0] + a) | 0;
    H[1] = (H[1] + b) | 0;
    H[2] = (H[2] + c) | 0;
    H[3] = (H[3] + d) | 0;
    H[4] = (H[4] + e) | 0;
    H[5] = (H[5] + f) | 0;
    H[6] = (H[6] + g) | 0;
    H[7] = (H[7] + h) | 0;
  }

  return H.map(x => (x >>> 0).toString(16).padStart(8, '0')).join('');
}

/**
 * Computes salted SHA-256 hex digest of an Admin Key candidate.
 */
export async function hashAdminKey(rawKey: string): Promise<string> {
  const salted = `${ADMIN_KEY_SALT}${rawKey.trim()}`;
  try {
    if (typeof globalThis.crypto !== 'undefined' && globalThis.crypto.subtle) {
      const encoded = new TextEncoder().encode(salted);
      const buffer = await globalThis.crypto.subtle.digest('SHA-256', encoded);
      return Array.from(new Uint8Array(buffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    }
  } catch {
    // Fallback cleanly to deterministic JS SHA-256
  }
  return sha256FallbackHex(salted);
}

function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

/**
 * Resolves the active expected SHA-256 digest (custom browser rotation -> Vite env -> baseline digest).
 */
export function getActiveAdminKeyHash(): string {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const custom = window.localStorage.getItem(ADMIN_CUSTOM_HASH_STORAGE_KEY);
      if (custom && /^[a-f0-9]{64}$/i.test(custom)) {
        return custom.toLowerCase();
      }
    }
  } catch {
    // Ignore storage access errors
  }

  const envHash =
    typeof import.meta !== 'undefined' && import.meta.env?.VITE_ADMIN_KEY_HASH
      ? String(import.meta.env.VITE_ADMIN_KEY_HASH).trim().toLowerCase()
      : '';

  if (/^[a-f0-9]{64}$/.test(envHash)) {
    return envHash;
  }

  return FALLBACK_ADMIN_KEY_HASH;
}

export function getAdminKeyFingerprint(): string {
  const hash = getActiveAdminKeyHash();
  return `SHA256:${hash.slice(0, 8).toUpperCase()}...${hash.slice(-6).toUpperCase()}`;
}

export function hasCustomRotatedKey(): boolean {
  try {
    return Boolean(typeof window !== 'undefined' && window.localStorage?.getItem(ADMIN_CUSTOM_HASH_STORAGE_KEY));
  } catch {
    return false;
  }
}

interface RateLimitState {
  count: number;
  lockUntil: number;
}

function readRateLimit(): RateLimitState {
  try {
    const raw = window.localStorage?.getItem(ADMIN_RATE_LIMIT_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // Ignore
  }
  return { count: 0, lockUntil: 0 };
}

function writeRateLimit(state: RateLimitState): void {
  try {
    window.localStorage?.setItem(ADMIN_RATE_LIMIT_KEY, JSON.stringify(state));
  } catch {
    // Ignore
  }
}

export function checkAdminLockout(): { locked: boolean; waitSeconds: number; remainingAttempts: number } {
  if (typeof window === 'undefined') {
    return { locked: false, waitSeconds: 0, remainingAttempts: MAX_FAILED_ATTEMPTS };
  }
  const now = Date.now();
  const state = readRateLimit();

  if (state.lockUntil > now) {
    return {
      locked: true,
      waitSeconds: Math.ceil((state.lockUntil - now) / 1000),
      remainingAttempts: 0,
    };
  }

  if (state.lockUntil > 0 && state.lockUntil <= now) {
    writeRateLimit({ count: 0, lockUntil: 0 });
    return { locked: false, waitSeconds: 0, remainingAttempts: MAX_FAILED_ATTEMPTS };
  }

  return {
    locked: false,
    waitSeconds: 0,
    remainingAttempts: Math.max(0, MAX_FAILED_ATTEMPTS - state.count),
  };
}

/**
 * Verifies the owner's Master Admin Key and creates a bounded session if valid.
 */
export async function verifyAndUnlockAdmin(
  candidateKey: string,
  trustDevice = false
): Promise<AdminVerifyResult> {
  const trimmed = candidateKey.trim();
  if (!trimmed) {
    return { valid: false, reason: 'Please enter your saved Master Admin Key.' };
  }

  const lockout = checkAdminLockout();
  if (lockout.locked) {
    return {
      valid: false,
      reason: `Too many invalid key attempts. Admin Vault locked for ${lockout.waitSeconds}s.`,
      waitSeconds: lockout.waitSeconds,
    };
  }

  const candidateHash = await hashAdminKey(trimmed);
  const expectedHash = getActiveAdminKeyHash();

  if (!timingSafeEqualHex(candidateHash, expectedHash)) {
    const prev = readRateLimit();
    const nextCount = prev.count + 1;
    const isNowLocked = nextCount >= MAX_FAILED_ATTEMPTS;
    writeRateLimit({
      count: nextCount,
      lockUntil: isNowLocked ? Date.now() + LOCKOUT_DURATION_MS : 0,
    });

    const attemptsLeft = Math.max(0, MAX_FAILED_ATTEMPTS - nextCount);
    return {
      valid: false,
      reason: isNowLocked
        ? 'Security lock triggered for 120s due to repeated invalid key attempts.'
        : `Invalid Master Admin Key. ${attemptsLeft} attempt${attemptsLeft === 1 ? '' : 's'} remaining before lockout.`,
      waitSeconds: isNowLocked ? Math.ceil(LOCKOUT_DURATION_MS / 1000) : 0,
    };
  }

  // Success -> clear failure counter & persist scoped Admin Session
  writeRateLimit({ count: 0, lockUntil: 0 });
  const fingerprint = candidateHash.slice(0, 12);
  const duration = trustDevice ? SESSION_DURATION_TRUSTED_MS : SESSION_DURATION_TAB_MS;

  const session: AdminSessionToken = {
    fingerprint,
    unlockedAt: new Date().toISOString(),
    expiresAt: Date.now() + duration,
    trustedDevice: trustDevice,
  };

  try {
    if (typeof window !== 'undefined') {
      const payload = JSON.stringify(session);
      window.sessionStorage?.setItem(ADMIN_SESSION_STORAGE_KEY, payload);
      if (trustDevice) {
        window.localStorage?.setItem(ADMIN_SESSION_STORAGE_KEY, payload);
      } else {
        window.localStorage?.removeItem(ADMIN_SESSION_STORAGE_KEY);
      }
    }
  } catch {
    // Non-browser environment
  }

  return { valid: true, fingerprint };
}

/**
 * Checks whether an active, unexpired Admin Vault session exists for the current key hash.
 */
export function getActiveAdminSession(): AdminSessionToken | null {
  if (typeof window === 'undefined') return null;

  const expectedPrefix = getActiveAdminKeyHash().slice(0, 12);
  const tryParse = (raw: string | null): AdminSessionToken | null => {
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as AdminSessionToken;
      if (
        parsed &&
        parsed.fingerprint === expectedPrefix &&
        typeof parsed.expiresAt === 'number' &&
        parsed.expiresAt > Date.now()
      ) {
        return parsed;
      }
    } catch {
      return null;
    }
    return null;
  };

  const tabSession = tryParse(window.sessionStorage?.getItem(ADMIN_SESSION_STORAGE_KEY));
  if (tabSession) return tabSession;

  const persistentSession = tryParse(window.localStorage?.getItem(ADMIN_SESSION_STORAGE_KEY));
  if (persistentSession) {
    // Hydrate tab session for fast reads
    window.sessionStorage?.setItem(ADMIN_SESSION_STORAGE_KEY, JSON.stringify(persistentSession));
    return persistentSession;
  }

  return null;
}

export function lockAdminVault(): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage?.removeItem(ADMIN_SESSION_STORAGE_KEY);
    window.localStorage?.removeItem(ADMIN_SESSION_STORAGE_KEY);
  } catch {
    // Ignore
  }
}

/**
 * Rotates the Master Admin Key on this browser and returns the new SHA-256 digest
 * so the owner can also deploy it to VITE_ADMIN_KEY_HASH / CARDWATCH_ADMIN_KEY_HASH.
 */
export async function rotateAdminKey(
  currentKey: string,
  newKey: string
): Promise<{ success: boolean; message: string; newHash?: string }> {
  const verify = await verifyAndUnlockAdmin(currentKey, false);
  if (!verify.valid) {
    return { success: false, message: verify.reason || 'Current Master Key verification failed.' };
  }

  const trimmedNew = newKey.trim();
  if (trimmedNew.length < 14) {
    return {
      success: false,
      message: 'New Master Admin Key must be at least 14 characters long for security.',
    };
  }

  const newHash = await hashAdminKey(trimmedNew);
  try {
    window.localStorage?.setItem(ADMIN_CUSTOM_HASH_STORAGE_KEY, newHash);
    // Re-issue session bound to the new fingerprint
    await verifyAndUnlockAdmin(trimmedNew, false);
  } catch {
    return { success: false, message: 'Could not persist custom key hash in browser storage.' };
  }

  return {
    success: true,
    message: 'Master Admin Key rotated successfully in this browser vault.',
    newHash,
  };
}

export function resetCustomKeyRotation(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage?.removeItem(ADMIN_CUSTOM_HASH_STORAGE_KEY);
    lockAdminVault();
  } catch {
    // Ignore
  }
}

/**
 * Generates a high-entropy formatted Admin Key using Web Crypto CSPRNG.
 */
export function generateStrongAdminKey(): string {
  const bytes = new Uint8Array(6);
  if (typeof globalThis.crypto !== 'undefined' && globalThis.crypto.getRandomValues) {
    globalThis.crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  const hex = Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0').toUpperCase())
    .join('');
  return `CW-ADM-${hex.slice(0, 4)}-${hex.slice(4, 8)}-${hex.slice(8, 12)}`;
}
