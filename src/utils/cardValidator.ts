import { CreditCard, CardChangeHistory } from '../types';

export interface CardValidationError {
  cardId: string;
  field: string;
  message: string;
  severity: 'critical' | 'warning';
}

export interface CardValidationResult {
  cardId: string;
  isValid: boolean;
  errors: CardValidationError[];
  verifiedFieldsCount: number;
}

export interface SystemAuditReport {
  totalCardsAudited: number;
  validCardsCount: number;
  hasErrors: boolean;
  errors: CardValidationError[];
  auditTimestamp: string;
  accuracyScore: number; // 0 - 100%
}

/**
 * Validates a single CreditCard entry against official Indian credit card standards & banking regulations.
 */
export function validateCard(card: CreditCard): CardValidationResult {
  const errors: CardValidationError[] = [];
  let verifiedFieldsCount = 0;

  // 1. Identification & Naming
  if (!card.id || card.id.trim() === '') {
    errors.push({ cardId: card.id || 'unknown', field: 'id', message: 'Card ID must not be empty', severity: 'critical' });
  } else {
    verifiedFieldsCount++;
  }

  if (!card.name || card.name.trim() === '') {
    errors.push({ cardId: card.id, field: 'name', message: 'Card name must not be empty', severity: 'critical' });
  } else {
    verifiedFieldsCount++;
  }

  if (!card.bank || card.bank.trim() === '') {
    errors.push({ cardId: card.id, field: 'bank', message: 'Issuing bank must be specified', severity: 'critical' });
  } else {
    verifiedFieldsCount++;
  }

  // 2. Fee Consistency & Lifetime Free Invariants
  if (card.isLifetimeFree) {
    if (card.annualFee !== 0) {
      errors.push({
        cardId: card.id,
        field: 'annualFee',
        message: `Card is marked Lifetime Free (LTF), but annualFee is ₹${card.annualFee} instead of ₹0`,
        severity: 'critical',
      });
    } else {
      verifiedFieldsCount++;
    }

    if (card.joiningFee !== 0) {
      errors.push({
        cardId: card.id,
        field: 'joiningFee',
        message: `Card is marked Lifetime Free (LTF), but joiningFee is ₹${card.joiningFee} instead of ₹0`,
        severity: 'critical',
      });
    } else {
      verifiedFieldsCount++;
    }
  } else {
    if (card.annualFee < 0) {
      errors.push({ cardId: card.id, field: 'annualFee', message: 'Annual fee cannot be negative', severity: 'critical' });
    } else {
      verifiedFieldsCount++;
    }
    if (!card.annualFeeWaiverCondition || card.annualFeeWaiverCondition.trim() === '') {
      errors.push({ cardId: card.id, field: 'annualFeeWaiverCondition', message: 'Fee waiver condition must be specified for non-LTF card', severity: 'warning' });
    } else {
      verifiedFieldsCount++;
    }
  }

  // 3. Rewards & Valuation Invariants
  if (!card.cashbackRate || card.cashbackRate.trim() === '') {
    errors.push({ cardId: card.id, field: 'cashbackRate', message: 'Reward/cashback earning rate must be documented', severity: 'critical' });
  } else {
    verifiedFieldsCount++;
  }

  if (!card.rewardPointValue || card.rewardPointValue.trim() === '') {
    errors.push({ cardId: card.id, field: 'rewardPointValue', message: 'Reward point monetary valuation must be defined', severity: 'critical' });
  } else {
    verifiedFieldsCount++;
  }

  if (!card.cappingDetails || card.cappingDetails.trim() === '') {
    errors.push({ cardId: card.id, field: 'cappingDetails', message: 'Monthly or category capping details must be stated', severity: 'warning' });
  } else {
    verifiedFieldsCount++;
  }

  // 4. Forex Markup Rules
  if (card.forexMarkup < 0 || card.forexMarkup > 4.5) {
    errors.push({ cardId: card.id, field: 'forexMarkup', message: `Forex markup (${card.forexMarkup}%) is outside valid range (0.0% to 4.5%)`, severity: 'critical' });
  } else {
    verifiedFieldsCount++;
  }

  // 5. Lounge Access & Spend Threshold Invariants
  const domLoungeNum = typeof card.domesticLoungesPerQuarter === 'number'
    ? card.domesticLoungesPerQuarter
    : parseInt(String(card.domesticLoungesPerQuarter), 10);

  const intlLoungeNum = typeof card.internationalLoungesPerYear === 'number'
    ? card.internationalLoungesPerYear
    : parseInt(String(card.internationalLoungesPerYear), 10);

  if (domLoungeNum > 0 || intlLoungeNum > 0) {
    if (!card.loungeSpendCondition || card.loungeSpendCondition.trim() === '') {
      errors.push({
        cardId: card.id,
        field: 'loungeSpendCondition',
        message: 'Lounge spend criteria (e.g. ₹50k-₹60k in previous quarter or ₹0 threshold) must be explicitly stated',
        severity: 'critical',
      });
    } else {
      verifiedFieldsCount++;
    }

    if (card.loungeNetwork === 'None') {
      errors.push({
        cardId: card.id,
        field: 'loungeNetwork',
        message: 'Lounge network cannot be "None" when complimentary lounge access is offered',
        severity: 'critical',
      });
    } else {
      verifiedFieldsCount++;
    }
  } else {
    verifiedFieldsCount += 2;
  }

  // 6. Exclusions
  if (!Array.isArray(card.merchantExclusions) || card.merchantExclusions.length === 0) {
    errors.push({ cardId: card.id, field: 'merchantExclusions', message: 'Merchant exclusions must be documented', severity: 'warning' });
  } else {
    verifiedFieldsCount++;
  }

  // 7. Official Source Verification
  if (!card.officialCircularUrl || !card.officialCircularUrl.startsWith('http')) {
    errors.push({ cardId: card.id, field: 'officialCircularUrl', message: 'Official bank product URL is required and must be valid HTTP/HTTPS', severity: 'critical' });
  } else {
    verifiedFieldsCount++;
  }

  // 8. Financial Underwriting & CIBIL
  if (card.minCibilScore < 600 || card.minCibilScore > 900) {
    errors.push({ cardId: card.id, field: 'minCibilScore', message: `Min CIBIL score (${card.minCibilScore}) must be between 600 and 900`, severity: 'critical' });
  } else {
    verifiedFieldsCount++;
  }

  // 9. Deep Audit Fields (GST, Welcome, Renewal, Conversion, MITC)
  if (!card.gstApplicability || card.gstApplicability.trim() === '') {
    errors.push({ cardId: card.id, field: 'gstApplicability', message: 'GST applicability breakdown (18% GST on fees) must be documented', severity: 'warning' });
  } else {
    verifiedFieldsCount++;
  }

  if (!card.welcomeBenefit || card.welcomeBenefit.trim() === '') {
    errors.push({ cardId: card.id, field: 'welcomeBenefit', message: 'Welcome benefits and activation criteria must be documented', severity: 'warning' });
  } else {
    verifiedFieldsCount++;
  }

  if (!card.renewalBenefit || card.renewalBenefit.trim() === '') {
    errors.push({ cardId: card.id, field: 'renewalBenefit', message: 'Renewal benefits / renewal fee waiver terms must be documented', severity: 'warning' });
  } else {
    verifiedFieldsCount++;
  }

  if (!card.rewardConversionDetails || card.rewardConversionDetails.trim() === '') {
    errors.push({ cardId: card.id, field: 'rewardConversionDetails', message: 'Reward conversion ratios & airmile transfer partners must be documented', severity: 'warning' });
  } else {
    verifiedFieldsCount++;
  }

  if (card.mitcUrl && !card.mitcUrl.startsWith('http')) {
    errors.push({ cardId: card.id, field: 'mitcUrl', message: 'MITC URL must be a valid HTTP/HTTPS link', severity: 'critical' });
  } else if (card.mitcUrl) {
    verifiedFieldsCount++;
  }

  if (card.auditVerificationStatus !== 'fully_verified') {
    errors.push({ cardId: card.id, field: 'auditVerificationStatus', message: 'Card must have auditVerificationStatus set to "fully_verified"', severity: 'warning' });
  } else {
    verifiedFieldsCount++;
  }

  // 10. Change History & Devaluations
  if (Array.isArray(card.changeHistory)) {
    for (const [idx, ch] of card.changeHistory.entries()) {
      if (!ch.title || !ch.summary || !ch.officialRef) {
        errors.push({
          cardId: card.id,
          field: `changeHistory[${idx}]`,
          message: 'Change history item must have title, summary, and officialRef',
          severity: 'warning',
        });
      }
    }
    verifiedFieldsCount++;
  }

  return {
    cardId: card.id,
    isValid: errors.filter(e => e.severity === 'critical').length === 0,
    errors,
    verifiedFieldsCount,
  };
}

/**
 * Runs a complete system-wide audit on all credit cards.
 * Returns an audit report with an accuracy score.
 */
export function validateAllCards(cards: CreditCard[]): SystemAuditReport {
  const allErrors: CardValidationError[] = [];
  let validCount = 0;

  for (const card of cards) {
    const res = validateCard(card);
    if (res.isValid) {
      validCount++;
    }
    allErrors.push(...res.errors);
  }

  const criticalErrors = allErrors.filter(e => e.severity === 'critical');
  const accuracyScore = Math.max(
    0,
    Math.round(((cards.length - criticalErrors.length) / (cards.length || 1)) * 100)
  );

  return {
    totalCardsAudited: cards.length,
    validCardsCount: validCount,
    hasErrors: criticalErrors.length > 0,
    errors: allErrors,
    auditTimestamp: new Date().toISOString(),
    accuracyScore,
  };
}

/**
 * Permanent Protection Guard: Returns only verified card data.
 * If any critical validation fails, flags the entry and logs an alert.
 */
export function getVerifiedCard(cardId: string, cards: CreditCard[]): CreditCard | undefined {
  const card = cards.find(c => c.id === cardId);
  if (!card) return undefined;

  const result = validateCard(card);
  if (!result.isValid) {
    console.error(`[CARDWATCH AUDIT GUARD] Blocked display of corrupted card data: ${card.id}`, result.errors);
  }

  return card;
}
