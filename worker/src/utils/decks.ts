import type { DeckInput } from '../types';

export const MAXIMUM_DECK_SIZE = 40;
export const MAXIMUM_COPIES = 4;

export type ValidationIssue = {
  ruleId: string;
  severity: 'error' | 'warning' | 'success';
  title: string;
  message: string;
};

export function validateDeckInput(body: unknown): {
  input?: DeckInput;
  error?: string;
} {
  if (!body || typeof body !== 'object') {
    return { error: 'Request body must be an object.' };
  }

  const candidate = body as { name?: unknown; cards?: unknown };
  const name = typeof candidate.name === 'string' ? candidate.name.trim() : '';

  if (!name) {
    return { error: 'Deck name is required.' };
  }

  if (name.length > 100) {
    return { error: 'Deck name must be 100 characters or fewer.' };
  }

  if (!Array.isArray(candidate.cards)) {
    return { error: 'Deck cards must be an array.' };
  }

  const cards: DeckInput['cards'] = [];
  const seen = new Set<number>();

  for (const rawEntry of candidate.cards) {
    if (!rawEntry || typeof rawEntry !== 'object') {
      return { error: 'Each deck card must be an object.' };
    }

    const entry = rawEntry as { cardId?: unknown; quantity?: unknown };
    const cardId = Number(entry.cardId);
    const quantity = Number(entry.quantity);

    if (!Number.isInteger(cardId) || cardId < 1) {
      return { error: 'Each card id must be a positive integer.' };
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      return { error: 'Each quantity must be a positive integer.' };
    }

    if (seen.has(cardId)) {
      return { error: 'A card may appear only once in the cards array.' };
    }

    seen.add(cardId);
    cards.push({ cardId, quantity });
  }

  return { input: { name, cards } };
}

export function buildValidation(
  cards: DeckInput['cards'],
  cardLimits: Map<number, number>,
) {
  const total = cards.reduce((sum, entry) => sum + entry.quantity, 0);
  const issues: ValidationIssue[] = [];

  issues.push(
    total === MAXIMUM_DECK_SIZE
      ? {
          ruleId: 'deck-size',
          severity: 'success',
          title: 'Deck size satisfied',
          message: `${total}/${MAXIMUM_DECK_SIZE} cards used.`,
        }
      : {
          ruleId: 'deck-size',
          severity: 'error',
          title: total < MAXIMUM_DECK_SIZE ? 'Deck is too small' : 'Deck is too large',
          message:
            total < MAXIMUM_DECK_SIZE
              ? `Add ${MAXIMUM_DECK_SIZE - total} more cards.`
              : `Remove ${total - MAXIMUM_DECK_SIZE} cards.`,
        },
  );

  const violations = cards.filter((entry) => {
    const limit = cardLimits.get(entry.cardId) ?? MAXIMUM_COPIES;
    return entry.quantity > limit;
  });

  issues.push(
    violations.length === 0
      ? {
          ruleId: 'copy-limits',
          severity: 'success',
          title: 'Copy limits satisfied',
          message: 'All card quantities are legal.',
        }
      : {
          ruleId: 'copy-limits',
          severity: 'error',
          title: 'Copy limit exceeded',
          message: 'One or more cards exceed their allowed quantity.',
        },
  );

  const errors = issues.filter((issue) => issue.severity === 'error');
  const warnings = issues.filter((issue) => issue.severity === 'warning');
  const successes = issues.filter((issue) => issue.severity === 'success');

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    successes,
    issues,
  };
}
