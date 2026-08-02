import type { SavedDeck } from '../../types/deck';
import { UnsavedBadge } from '../UnsavedBadge/UnsavedBadge';

type DeckManagerProps = {
  decks: SavedDeck[];
  selectedDeckId: number | null;
  deckName: string;
  statusMessage: string;
  isBusy: boolean;
  canSave: boolean;
  onNameChange: (name: string) => void;
  onSelectDeck: (id: number | null) => void;
  onNewDeck: () => void;
  onSave: () => void;
  onDelete: () => void;
  onImport: () => void;
  onExport: () => void;
  isDirty: boolean;
};

export function DeckManager({
  decks,
  selectedDeckId,
  deckName,
  statusMessage,
  isBusy,
  canSave,
  onNameChange,
  onSelectDeck,
  onNewDeck,
  onSave,
  onDelete,
  onImport,
  onExport,
  isDirty,
}: DeckManagerProps) {
  return (
    <section className="deck-manager" aria-label="Saved deck controls">
      <label className="field">
        <span>Saved decks</span>
        <select
          value={selectedDeckId ?? ''}
          onChange={(event) =>
            onSelectDeck(event.target.value ? Number(event.target.value) : null)
          }
          disabled={isBusy}
        >
          <option value="">New unsaved deck</option>
          {decks.map((deck) => (
            <option value={deck.id} key={deck.id}>
              {deck.name}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>Deck name</span>
        <input
          value={deckName}
          maxLength={100}
          placeholder="Enter a deck name"
          onChange={(event) => onNameChange(event.target.value)}
          disabled={isBusy}
        />
      </label>

      <div className="deck-manager__actions">
        <button className="secondary-button" type="button" onClick={onNewDeck} disabled={isBusy}>
          New
        </button>
        <button className="secondary-button" type="button" onClick={onImport} disabled={isBusy}>
          Import
        </button>
        <button className="secondary-button" type="button" onClick={onExport} disabled={isBusy}>
          Export
        </button>
        <button
          className="primary-button"
          type="button"
          onClick={onSave}
          disabled={isBusy || !canSave}
        >
          {selectedDeckId ? 'Update' : 'Save'}
        </button>
        <button
          className="danger-button"
          type="button"
          onClick={onDelete}
          disabled={isBusy || !selectedDeckId}
        >
          Delete
        </button>
      </div>

      <div className="deck-manager__status-row">
        <p className="deck-manager__status" aria-live="polite">
          {statusMessage || 'Decks are saved to the local SQLite database.'}
        </p>
        <UnsavedBadge isDirty={isDirty} />
      </div>
    </section>
  );
}
