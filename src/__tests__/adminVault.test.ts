import { describe, it, expect, beforeEach } from 'vitest';
import {
  ADMIN_KEY_SALT,
  hashAdminKey,
  getActiveAdminKeyHash,
  verifyAndUnlockAdmin,
  getActiveAdminSession,
  lockAdminVault,
  rotateAdminKey,
  resetCustomKeyRotation,
  generateStrongAdminKey,
  checkAdminLockout,
} from '../utils/adminVault';
import { mergeCardCatalog, mergeLiveDevaluations } from '../utils/catalogMerge';
import { CREDIT_CARDS_DATA } from '../data/cards';
import { LiveDevaluationEntry } from '../types';

function installMockBrowserStorage() {
  const createStore = () => {
    const map = new Map<string, string>();
    return {
      getItem: (k: string) => (map.has(k) ? map.get(k)! : null),
      setItem: (k: string, v: string) => map.set(k, String(v)),
      removeItem: (k: string) => map.delete(k),
      clear: () => map.clear(),
    };
  };

  (globalThis as any).window = {
    localStorage: createStore(),
    sessionStorage: createStore(),
  };
}

describe('CARDWATCH Sovereign Admin Vault & Live CMS Logic', () => {
  beforeEach(() => {
    installMockBrowserStorage();
    resetCustomKeyRotation();
  });

  it('computes salted SHA-256 digests matching WebCrypto SHA-256 cleanly', async () => {
    const samplePass = 'CW-TEST-SAMPLE-PASSKEY-2026';
    const digestBuf = await globalThis.crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(`${ADMIN_KEY_SALT}${samplePass}`)
    );
    const expected = Array.from(new Uint8Array(digestBuf))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    const actual = await hashAdminKey(samplePass);
    expect(actual).toBe(expected);
    expect(actual).toHaveLength(64);
  });

  it('rejects empty and unauthorized keys without exposing the configured digest', async () => {
    const emptyRes = await verifyAndUnlockAdmin('   ');
    expect(emptyRes.valid).toBe(false);

    const wrongRes = await verifyAndUnlockAdmin('WRONG-ADMIN-KEY-0000');
    expect(wrongRes.valid).toBe(false);
    expect(getActiveAdminSession()).toBeNull();
  });

  it('enforces brute-force lockout after 5 invalid key attempts', async () => {
    for (let i = 0; i < 4; i++) {
      const res = await verifyAndUnlockAdmin(`wrong-key-${i}`);
      expect(res.valid).toBe(false);
    }

    const fifth = await verifyAndUnlockAdmin('wrong-key-4');
    expect(fifth.valid).toBe(false);
    expect(fifth.waitSeconds).toBe(120);

    const lockout = checkAdminLockout();
    expect(lockout.locked).toBe(true);
    expect(lockout.remainingAttempts).toBe(0);
  });

  it('generates formatted strong Master Admin Keys and supports browser key rotation', async () => {
    const generated = generateStrongAdminKey();
    expect(generated).toMatch(/^CW-ADM-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}$/);

    // Configure an active custom hash in mock browser storage to verify rotation cleanly
    const initialTestKey = 'CW-ADM-TEST-1111-2222';
    const initialHash = await hashAdminKey(initialTestKey);
    (globalThis as any).window.localStorage.setItem('cardwatch_admin_custom_hash_v1', initialHash);
    expect(getActiveAdminKeyHash()).toBe(initialHash);

    const unlockRes = await verifyAndUnlockAdmin(initialTestKey, true);
    expect(unlockRes.valid).toBe(true);
    expect(getActiveAdminSession()?.trustedDevice).toBe(true);

    // Reject weak rotation key
    const weakRot = await rotateAdminKey(initialTestKey, 'short');
    expect(weakRot.success).toBe(false);

    // Rotate to new strong key
    const rotatedKey = generateStrongAdminKey();
    const rotRes = await rotateAdminKey(initialTestKey, rotatedKey);
    expect(rotRes.success).toBe(true);
    expect(rotRes.newHash).toBe(await hashAdminKey(rotatedKey));

    // Old key fails immediately; new key succeeds
    lockAdminVault();
    expect(getActiveAdminSession()).toBeNull();
    expect((await verifyAndUnlockAdmin(initialTestKey)).valid).toBe(false);
    expect((await verifyAndUnlockAdmin(rotatedKey)).valid).toBe(true);
  });

  it('merges card overrides, custom new cards, and archived exclusions accurately', () => {
    const base = CREDIT_CARDS_DATA.slice(0, 3);
    const modifiedFirst = { ...base[0], annualFee: 9999 };
    const brandNewCard = {
      ...base[1],
      id: 'custom-new-test-card',
      name: 'Custom New Card',
    };

    const activeCatalog = mergeCardCatalog(
      base,
      { [base[0].id]: modifiedFirst, [brandNewCard.id]: brandNewCard },
      [base[2].id],
      false
    );

    expect(activeCatalog.some(c => c.id === brandNewCard.id)).toBe(true);
    expect(activeCatalog.find(c => c.id === base[0].id)?.annualFee).toBe(9999);
    expect(activeCatalog.some(c => c.id === base[2].id)).toBe(false);

    const fullCatalog = mergeCardCatalog(
      base,
      { [base[0].id]: modifiedFirst },
      [base[2].id],
      true
    );
    expect(fullCatalog.some(c => c.id === base[2].id)).toBe(true);
  });

  it('merges custom devaluations and removes dismissed alerts', () => {
    const baseDevals: LiveDevaluationEntry[] = [
      {
        id: 'deval-1',
        cardId: 'sbi-cashback',
        cardName: 'SBI Cashback',
        bank: 'SBI Card',
        date: 'Dec 01, 2026',
        announcedDate: 'Nov 01, 2026',
        deadline: 'Dec 01, 2026',
        type: 'devaluation',
        title: 'Base Notice 1',
        summary: 'Summary 1',
        oldValue: 'Old 1',
        newValue: 'New 1',
        officialRef: 'Ref 1',
        severity: 'high',
      },
      {
        id: 'deval-2',
        cardId: 'hdfc-infinia-metal',
        cardName: 'HDFC Infinia',
        bank: 'HDFC Bank',
        date: 'Dec 15, 2026',
        announcedDate: 'Nov 10, 2026',
        deadline: 'Dec 15, 2026',
        type: 'restriction',
        title: 'Base Notice 2',
        summary: 'Summary 2',
        oldValue: 'Old 2',
        newValue: 'New 2',
        officialRef: 'Ref 2',
        severity: 'critical',
      },
    ];

    const customAdded: LiveDevaluationEntry = {
      ...baseDevals[0],
      id: 'adm-new-3',
      title: 'Admin Published Notice 3',
    };

    const merged = mergeLiveDevaluations(
      baseDevals,
      { [customAdded.id]: customAdded },
      ['deval-2']
    );

    expect(merged).toHaveLength(2);
    expect(merged[0].id).toBe('adm-new-3');
    expect(merged.some(d => d.id === 'deval-2')).toBe(false);
  });
});
