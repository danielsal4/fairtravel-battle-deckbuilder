import { useEffect, useMemo } from 'react';

import type { DeckEntry, SavedDeck } from '../types/deck';

type UseUnsavedChangesOptions = {
  entries: DeckEntry[];
  deckName: string;
  selectedDeck: SavedDeck | null;
};

function normalizeEntries(entries: DeckEntry[]) {
  return entries
    .map((entry) => ({
      cardId: entry.card.id,
      quantity: entry.quantity,
    }))
    .sort((left, right) => left.cardId - right.cardId);
}

function normalizeSavedDeck(deck: SavedDeck | null) {
  if (!deck) {
    return [];
  }

  return deck.cards
    .map((entry) => ({
      cardId: entry.cardId,
      quantity: entry.quantity,
    }))
    .sort((left, right) => left.cardId - right.cardId);
}

export function useUnsavedChanges({
  entries,
  deckName,
  selectedDeck,
}: UseUnsavedChangesOptions) {
  const isDirty = useMemo(() => {
    if (!selectedDeck) {
      return entries.length > 0 || deckName.trim() !== 'Untitled Deck';
    }

    const nameChanged = deckName.trim() !== selectedDeck.name.trim();
    const entriesChanged =
      JSON.stringify(normalizeEntries(entries)) !==
      JSON.stringify(normalizeSavedDeck(selectedDeck));

    return nameChanged || entriesChanged;
  }, [deckName, entries, selectedDeck]);

  useEffect(() => {
    if (!isDirty) {
      return undefined;
    }

    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [isDirty]);

  return isDirty;
}
