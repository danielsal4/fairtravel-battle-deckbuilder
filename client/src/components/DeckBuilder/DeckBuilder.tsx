import { useCallback, useEffect, useMemo, useState } from 'react';

import { createDeck, deleteDeck, getDecks, updateDeck } from '../../services/api';
import type { Card } from '../../types/card';
import type { SavedDeck, SaveDeckRequest } from '../../types/deck';
import { CardBrowser } from '../CardBrowser/CardBrowser';
import { DeckManager } from '../DeckManager/DeckManager';
import { DeckPanel } from '../DeckPanel/DeckPanel';
import { useDeck } from '../../hooks/useDeck';
import { validateDeck } from '../../validation/deckValidation';
import { ImportExportDialog } from '../ImportExportDialog/ImportExportDialog';
import { useUnsavedChanges } from '../../hooks/useUnsavedChanges';
import { calculateDeckAnalytics } from '../../utils/deckAnalytics';

type DeckBuilderProps = {
  cards: Card[];
};

export function DeckBuilder({ cards }: DeckBuilderProps) {
  const deck = useDeck();
  const [savedDecks, setSavedDecks] = useState<SavedDeck[]>([]);
  const [selectedDeckId, setSelectedDeckId] = useState<number | null>(null);
  const [deckName, setDeckName] = useState('Untitled Deck');
  const [isBusy, setIsBusy] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [dialogMode, setDialogMode] = useState<'import' | 'export' | null>(null);

  const cardsById = useMemo(
    () => new Map(cards.map((card) => [card.id, card])),
    [cards],
  );

  const validationResult = useMemo(
    () => validateDeck(deck.entries),
    [deck.entries],
  );

  const selectedSavedDeck =
    savedDecks.find((candidate) => candidate.id === selectedDeckId) ?? null;

  const isDirty = useUnsavedChanges({
    entries: deck.entries,
    deckName,
    selectedDeck: selectedSavedDeck,
  });

  const analytics = useMemo(
    () => calculateDeckAnalytics(deck.entries),
    [deck.entries],
  );

  const refreshDecks = useCallback(async () => {
    setSavedDecks(await getDecks());
  }, []);

  useEffect(() => {
    void refreshDecks().catch((error: unknown) => {
      setStatusMessage(error instanceof Error ? error.message : 'Unable to load saved decks.');
    });
  }, [refreshDecks]);

  const addCardById = (cardId: number) => {
    const card = cardsById.get(cardId);

    if (card) {
      deck.addCard(card);
      setStatusMessage('');
    }
  };

  const loadSavedDeck = (savedDeck: SavedDeck) => {
    deck.replaceDeck(
      savedDeck.cards.map((entry) => ({
        card: entry.card,
        quantity: entry.quantity,
      })),
    );
    setSelectedDeckId(savedDeck.id);
    setDeckName(savedDeck.name);
    setStatusMessage(`Loaded “${savedDeck.name}”.`);
  };

  const selectDeck = (id: number | null) => {
    if (id === null) {
      newDeck();
      return;
    }

    if (isDirty && !window.confirm('Discard unsaved deck changes?')) {
      return;
    }

    const savedDeck = savedDecks.find((candidate) => candidate.id === id);

    if (savedDeck) {
      loadSavedDeck(savedDeck);
    }
  };

  const newDeck = () => {
    if (isDirty && !window.confirm('Discard unsaved deck changes?')) {
      return;
    }

    deck.clearDeck();
    setSelectedDeckId(null);
    setDeckName('Untitled Deck');
    setStatusMessage('Started a new deck.');
  };

  const buildRequest = (): SaveDeckRequest => ({
    name: deckName.trim(),
    cards: deck.entries.map((entry) => ({
      cardId: entry.card.id,
      quantity: entry.quantity,
    })),
  });

  const saveDeck = async () => {
    if (!validationResult.isValid) {
      setStatusMessage('Resolve the deck validation errors before saving.');
      return;
    }

    if (!deckName.trim()) {
      setStatusMessage('Enter a deck name before saving.');
      return;
    }

    setIsBusy(true);
    setStatusMessage('');

    try {
      const savedDeck = selectedDeckId
        ? await updateDeck(selectedDeckId, buildRequest())
        : await createDeck(buildRequest());

      await refreshDecks();
      setSelectedDeckId(savedDeck.id);
      setDeckName(savedDeck.name);
      setStatusMessage(selectedDeckId ? 'Deck updated.' : 'Deck saved.');
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : 'Unable to save deck.');
    } finally {
      setIsBusy(false);
    }
  };

  const removeSavedDeck = async () => {
    if (!selectedDeckId) {
      return;
    }

    const selectedDeck = savedDecks.find((candidate) => candidate.id === selectedDeckId);
    const confirmed = window.confirm(
      `Delete “${selectedDeck?.name ?? deckName}”? This cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    setIsBusy(true);
    setStatusMessage('');

    try {
      await deleteDeck(selectedDeckId);
      await refreshDecks();
      newDeck();
      setStatusMessage('Deck deleted.');
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : 'Unable to delete deck.');
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <>
      <DeckManager
        decks={savedDecks}
        selectedDeckId={selectedDeckId}
        deckName={deckName}
        statusMessage={statusMessage}
        isBusy={isBusy}
        canSave={Boolean(deckName.trim()) && validationResult.isValid}
        onNameChange={(name) => {
          setDeckName(name);
          setStatusMessage('');
        }}
        onSelectDeck={selectDeck}
        onNewDeck={newDeck}
        onSave={() => void saveDeck()}
        onDelete={() => void removeSavedDeck()}
        onImport={() => setDialogMode('import')}
        onExport={() => setDialogMode('export')}
        isDirty={isDirty}
      />

      <ImportExportDialog
        isOpen={dialogMode !== null}
        mode={dialogMode ?? 'import'}
        cards={cards}
        deckName={deckName}
        entries={deck.entries}
        validation={validationResult}
        maximumCopiesPerCard={deck.rules.maximumCopiesPerCard}
        onClose={() => setDialogMode(null)}
        onImport={(entries, importedName) => {
          if (isDirty && !window.confirm('Discard unsaved deck changes?')) {
            return;
          };
          deck.replaceDeck(entries);
          setSelectedDeckId(null);

          if (importedName) {
            setDeckName(importedName);
          }

          setStatusMessage(
            `Imported ${entries.reduce(
              (sum, entry) => sum + entry.quantity,
              0,
            )} cards.`,
          );
        }}
      />

      <div className="deck-builder-layout">
        <div className="deck-builder-library">
          <CardBrowser
            cards={cards}
            onAddCard={(card) => {
              deck.addCard(card);
              setStatusMessage('');
            }}
            canAddCard={(card) => deck.canAddCard(card.id)}
            deckQuantities={Object.fromEntries(
              deck.entries.map((entry) => [entry.card.id, entry.quantity]),
            )}
          />
        </div>

        <DeckPanel
          deckName={deckName}
          entries={deck.entries}
          rules={deck.rules}
          stats={deck.stats}
          onAdd={addCardById}
          onRemove={(cardId) => {
            deck.removeCard(cardId);
            setStatusMessage('');
          }}
          onClear={() => {
            deck.clearDeck();
            setStatusMessage('');
          }}
          canAdd={deck.canAddCard}
          validationResult={validationResult}
          analytics={analytics}
        />
      </div>
    </>
  );
}
