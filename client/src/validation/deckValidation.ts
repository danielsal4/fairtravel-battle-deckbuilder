import type { DeckEntry } from '../types/deck';
import type {
  DeckValidationConfig,
  ValidationIssue,
  ValidationResult,
} from '../types/validation';

export type DeckValidationContext = {
  entries: DeckEntry[];
  config: DeckValidationConfig;
};

export type DeckValidationRule = {
  id: string;
  validate: (context: DeckValidationContext) => ValidationIssue;
};

export const defaultDeckValidationConfig: DeckValidationConfig = {
  minimumCards: 40,
  maximumCards: 40,
  maximumCopiesPerCard: 4,
  allowEmptyDeck: true,
};

function totalCards(entries: DeckEntry[]): number {
  return entries.reduce((sum, entry) => sum + entry.quantity, 0);
}

const emptyDeckRule: DeckValidationRule = {
  id: 'empty-deck',
  validate: ({ entries, config }) => {
    const count = totalCards(entries);

    if (count === 0 && !config.allowEmptyDeck) {
      return {
        ruleId: 'empty-deck',
        severity: 'error',
        title: 'Deck is empty',
        message: 'Add at least one card before saving this deck.',
      };
    }

    if (count === 0) {
      return {
        ruleId: 'empty-deck',
        severity: 'warning',
        title: 'Deck is empty',
        message: 'Add cards to begin building the deck.',
      };
    }

    return {
      ruleId: 'empty-deck',
      severity: 'success',
      title: 'Deck contains cards',
      message: `${count} card${count === 1 ? '' : 's'} currently added.`,
    };
  },
};

const minimumCardsRule: DeckValidationRule = {
  id: 'minimum-cards',
  validate: ({ entries, config }) => {
    const count = totalCards(entries);

    if (count >= config.minimumCards) {
      return {
        ruleId: 'minimum-cards',
        severity: 'success',
        title: 'Minimum deck size met',
        message: `The deck contains at least ${config.minimumCards} cards.`,
      };
    }

    return {
      ruleId: 'minimum-cards',
      severity: count === 0 && config.allowEmptyDeck ? 'warning' : 'error',
      title: 'Deck is too small',
      message: `Add ${config.minimumCards - count} more card${
        config.minimumCards - count === 1 ? '' : 's'
      } to reach the ${config.minimumCards}-card minimum.`,
    };
  },
};

const maximumCardsRule: DeckValidationRule = {
  id: 'maximum-cards',
  validate: ({ entries, config }) => {
    const count = totalCards(entries);

    if (count <= config.maximumCards) {
      return {
        ruleId: 'maximum-cards',
        severity: 'success',
        title: 'Maximum deck size satisfied',
        message: `${count}/${config.maximumCards} cards used.`,
      };
    }

    return {
      ruleId: 'maximum-cards',
      severity: 'error',
      title: 'Deck is too large',
      message: `Remove ${count - config.maximumCards} card${
        count - config.maximumCards === 1 ? '' : 's'
      } to meet the ${config.maximumCards}-card maximum.`,
    };
  },
};

const maximumCopiesRule: DeckValidationRule = {
  id: 'maximum-copies',
  validate: ({ entries, config }) => {
    const violations = entries.filter(
      (entry) => entry.quantity > config.maximumCopiesPerCard,
    );

    if (violations.length === 0) {
      return {
        ruleId: 'maximum-copies',
        severity: 'success',
        title: 'Copy limits satisfied',
        message: `No card exceeds ${config.maximumCopiesPerCard} copies.`,
      };
    }

    return {
      ruleId: 'maximum-copies',
      severity: 'error',
      title: 'Copy limit exceeded',
      message: violations
        .map(
          (entry) =>
            `${entry.card.name} has ${entry.quantity} copies; maximum is ${config.maximumCopiesPerCard}.`,
        )
        .join(' '),
    };
  },
};


const cardSpecificLimitRule: DeckValidationRule = {
  id: 'card-specific-limits',
  validate: ({ entries }) => {
    const violations = entries.filter((entry) => {
      const limit = entry.card.isUnique ? 1 : entry.card.deckLimit;
      return limit !== null && entry.quantity > limit;
    });

    if (violations.length === 0) {
      return {
        ruleId: 'card-specific-limits',
        severity: 'success',
        title: 'Card-specific limits satisfied',
        message: 'Unique and limited cards are within their allowed quantities.',
      };
    }

    return {
      ruleId: 'card-specific-limits',
      severity: 'error',
      title: 'Card-specific limit exceeded',
      message: violations
        .map((entry) => {
          const limit = entry.card.isUnique ? 1 : entry.card.deckLimit;
          return `${entry.card.name} is limited to ${limit ?? 0}.`;
        })
        .join(' '),
    };
  },
};

export const defaultDeckValidationRules: DeckValidationRule[] = [
  emptyDeckRule,
  minimumCardsRule,
  maximumCardsRule,
  maximumCopiesRule,
  cardSpecificLimitRule,
];

export function validateDeck(
  entries: DeckEntry[],
  config: DeckValidationConfig = defaultDeckValidationConfig,
  rules: DeckValidationRule[] = defaultDeckValidationRules,
): ValidationResult {
  const issues = rules.map((rule) => rule.validate({ entries, config }));
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
