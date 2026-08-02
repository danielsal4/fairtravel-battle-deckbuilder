import { useMemo, useState } from 'react';

import type { Card } from '../types/card';
import type { DeckEntry, DeckRules, DeckStats } from '../types/deck';

const defaultRules: DeckRules = {
  maximumCards: 40,
  maximumCopiesPerCard: 4,
};

export function useDeck(rules: DeckRules = defaultRules) {
  const [entries, setEntries] = useState<DeckEntry[]>([]);

  const totalCards = entries.reduce((sum, entry) => sum + entry.quantity, 0);

  const addCard = (card: Card) => {
    setEntries((currentEntries) => {
      const currentTotal = currentEntries.reduce((sum, entry) => sum + entry.quantity, 0);
      const existingEntry = currentEntries.find((entry) => entry.card.id === card.id);

      if (currentTotal >= rules.maximumCards) {
        return currentEntries;
      }

      const cardLimit = card.isUnique
        ? 1
        : Math.min(card.deckLimit ?? rules.maximumCopiesPerCard, rules.maximumCopiesPerCard);

      if (existingEntry && existingEntry.quantity >= cardLimit) {
        return currentEntries;
      }

      if (existingEntry) {
        return currentEntries.map((entry) =>
          entry.card.id === card.id ? { ...entry, quantity: entry.quantity + 1 } : entry,
        );
      }

      return [...currentEntries, { card, quantity: 1 }];
    });
  };

  const removeCard = (cardId: number) => {
    setEntries((currentEntries) =>
      currentEntries
        .map((entry) =>
          entry.card.id === cardId ? { ...entry, quantity: entry.quantity - 1 } : entry,
        )
        .filter((entry) => entry.quantity > 0),
    );
  };

  const clearDeck = () => setEntries([]);

  const replaceDeck = (nextEntries: DeckEntry[]) => {
    setEntries(
      nextEntries
        .filter((entry) => entry.quantity > 0)
        .map((entry) => ({ ...entry })),
    );
  };

  const canAddCard = (cardId: number) => {
    const entry = entries.find((candidate) => candidate.card.id === cardId);

    const card = entry?.card;
    const cardLimit = card?.isUnique
      ? 1
      : Math.min(card?.deckLimit ?? rules.maximumCopiesPerCard, rules.maximumCopiesPerCard);

    return (
      totalCards < rules.maximumCards &&
      (!entry || entry.quantity < cardLimit)
    );
  };

  const stats = useMemo<DeckStats>(() => {
    const totalCost = entries.reduce(
      (sum, entry) => sum + entry.card.cost * entry.quantity,
      0,
    );

    const typeCounts = entries.reduce<Record<string, number>>((counts, entry) => {
      counts[entry.card.type] = (counts[entry.card.type] ?? 0) + entry.quantity;
      return counts;
    }, {});

    const costCurve = entries.reduce<Record<number, number>>((curve, entry) => {
      curve[entry.card.cost] = (curve[entry.card.cost] ?? 0) + entry.quantity;
      return curve;
    }, {});

    return {
      totalCards,
      uniqueCards: entries.length,
      totalCost,
      averageCost: totalCards === 0 ? 0 : totalCost / totalCards,
      typeCounts,
      costCurve,
    };
  }, [entries, totalCards]);

  return {
    entries,
    rules,
    stats,
    addCard,
    removeCard,
    clearDeck,
    replaceDeck,
    canAddCard,
  };
}
