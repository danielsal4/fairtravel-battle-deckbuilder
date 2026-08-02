import type { Card } from '../types/card';
import type { DeckEntry } from '../types/deck';
import type {
  DeckExportOptions,
  DeckImportIssue,
  DeckImportResult,
} from '../types/importExport';
import type { ValidationResult } from '../types/validation';

const quantityPattern = /^\s*(\d+)\s*[xX]?\s+(.+?)\s*$/;
const nameHeaderPattern = /^#\s*deck\s*:\s*(.+)$/i;

function normalizeCardName(value: string): string {
  return value
    .trim()
    .toLocaleLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/\s+/g, ' ');
}

export function parseDeckList(
  text: string,
  cards: Card[],
  maximumCopiesPerCard: number,
): DeckImportResult {
  const issues: DeckImportIssue[] = [];
  const quantities = new Map<number, number>();
  const cardsByName = new Map(
    cards.map((card) => [normalizeCardName(card.name), card]),
  );
  let deckName: string | null = null;

  text.split(/\r?\n/).forEach((rawLine, index) => {
    const lineNumber = index + 1;
    const line = rawLine.trim();

    if (!line) {
      return;
    }

    const nameMatch = line.match(nameHeaderPattern);
    if (nameMatch) {
      deckName = nameMatch[1]?.trim() || null;
      return;
    }

    if (line.startsWith('#')) {
      return;
    }

    const quantityMatch = line.match(quantityPattern);
    if (!quantityMatch) {
      issues.push({
        line: lineNumber,
        text: rawLine,
        message: 'Expected a quantity followed by a card name.',
      });
      return;
    }

    const quantity = Number(quantityMatch[1]);
    const cardName = quantityMatch[2] ?? '';
    const card = cardsByName.get(normalizeCardName(cardName));

    if (!Number.isInteger(quantity) || quantity < 1) {
      issues.push({
        line: lineNumber,
        text: rawLine,
        message: 'Quantity must be a positive whole number.',
      });
      return;
    }

    if (!card) {
      issues.push({
        line: lineNumber,
        text: rawLine,
        message: `Card not found: ${cardName}`,
      });
      return;
    }

    const cardLimit = card.isUnique
      ? 1
      : Math.min(card.deckLimit ?? maximumCopiesPerCard, maximumCopiesPerCard);
    const nextQuantity = (quantities.get(card.id) ?? 0) + quantity;

    if (nextQuantity > cardLimit) {
      issues.push({
        line: lineNumber,
        text: rawLine,
        message: `${card.name} is limited to ${cardLimit} ${
          cardLimit === 1 ? 'copy' : 'copies'
        }.`,
      });
      return;
    }

    quantities.set(card.id, nextQuantity);
  });

  const entries = [...quantities.entries()]
    .map(([cardId, quantity]) => {
      const card = cards.find((candidate) => candidate.id === cardId);

      if (!card) {
        return null;
      }

      return { card, quantity };
    })
    .filter((entry): entry is DeckEntry => entry !== null)
    .sort(
      (left, right) =>
        left.card.cost - right.card.cost ||
        left.card.name.localeCompare(right.card.name),
    );

  return {
    entries,
    deckName,
    issues,
  };
}

export function exportDeckList(
  deckName: string,
  entries: DeckEntry[],
  validation: ValidationResult,
  options: DeckExportOptions = {
    includeHeader: true,
    includeMetadata: true,
  },
): string {
  const sortedEntries = [...entries].sort(
    (left, right) =>
      left.card.cost - right.card.cost ||
      left.card.name.localeCompare(right.card.name),
  );
  const totalCards = sortedEntries.reduce(
    (sum, entry) => sum + entry.quantity,
    0,
  );
  const lines: string[] = [];

  if (options.includeHeader) {
    lines.push(`# Deck: ${deckName.trim() || 'Untitled Deck'}`);
  }

  if (options.includeMetadata) {
    lines.push(`# Cards: ${totalCards}`);
    lines.push(`# Status: ${validation.isValid ? 'Valid' : 'Invalid'}`);
  }

  if (options.includeHeader || options.includeMetadata) {
    lines.push('');
  }

  for (const entry of sortedEntries) {
    lines.push(`${entry.quantity} ${entry.card.name}`);
  }

  return lines.join('\n');
}
