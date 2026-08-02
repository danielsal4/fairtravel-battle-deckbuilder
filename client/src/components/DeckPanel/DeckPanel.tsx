import type { DeckEntry, DeckRules, DeckStats } from '../../types/deck';
import type { ValidationResult } from '../../types/validation';
import { ValidationPanel } from '../ValidationPanel/ValidationPanel';
import { DeckStats as DeckStatsView } from '../DeckStats/DeckStats';
import type { DeckAnalytics } from '../../types/deckAnalytics';
import { DeckAnalyticsPanel } from '../DeckAnalyticsPanel/DeckAnalyticsPanel';

type DeckPanelProps = {
  deckName: string;
  entries: DeckEntry[];
  rules: DeckRules;
  stats: DeckStats;
  onAdd: (cardId: number) => void;
  onRemove: (cardId: number) => void;
  onClear: () => void;
  canAdd: (cardId: number) => boolean;
  validationResult: ValidationResult;
  analytics: DeckAnalytics;
};

export function DeckPanel({
  deckName,
  entries,
  rules,
  stats,
  onAdd,
  onRemove,
  onClear,
  canAdd,
  validationResult,
  analytics,
}: DeckPanelProps) {
  const sortedEntries = [...entries].sort(
    (left, right) =>
      left.card.cost - right.card.cost || left.card.name.localeCompare(right.card.name),
  );

  return (
    <aside className="deck-panel">
      <div className="deck-panel__header">
        <div>
          <p className="eyebrow">Current deck</p>
          <h2>{deckName || 'Untitled Deck'}</h2>
        </div>
        <button
          className="secondary-button"
          type="button"
          onClick={onClear}
          disabled={entries.length === 0}
        >
          Clear
        </button>
      </div>

      {entries.length === 0 ? (
        <div className="deck-empty">
          <h3>Your deck is empty</h3>
          <p>Use the Add button on a card to begin building.</p>
        </div>
      ) : (
        <ol className="deck-list">
          {sortedEntries.map((entry) => (
            <li key={entry.card.id}>
              <div className="deck-list__identity">
                <span className="deck-list__cost">{entry.card.cost}</span>
                <div>
                  <strong>{entry.card.name}</strong>
                  <span>{entry.card.type}</span>
                </div>
              </div>

              <div className="quantity-control" aria-label={`${entry.card.name} quantity`}>
                <button type="button" onClick={() => onRemove(entry.card.id)} aria-label="Remove one">
                  −
                </button>
                <strong>{entry.quantity}</strong>
                <button
                  type="button"
                  onClick={() => onAdd(entry.card.id)}
                  disabled={!canAdd(entry.card.id)}
                  aria-label="Add one"
                >
                  +
                </button>
              </div>
            </li>
          ))}
        </ol>
      )}

      <p className="deck-rule-note">
        Maximum {rules.maximumCards} cards and {rules.maximumCopiesPerCard} copies per card.
      </p>

      <ValidationPanel result={validationResult} />
      <DeckStatsView stats={stats} rules={rules} />
      <DeckAnalyticsPanel analytics={analytics} />
    </aside>
  );
}
