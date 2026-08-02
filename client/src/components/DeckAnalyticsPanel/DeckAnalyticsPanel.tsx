import type { DeckAnalytics } from '../../types/deckAnalytics';

type DeckAnalyticsPanelProps = {
  analytics: DeckAnalytics;
};

function formatPercent(value: number): string {
  return `${value.toFixed(0)}%`;
}

export function DeckAnalyticsPanel({ analytics }: DeckAnalyticsPanelProps) {
  return (
    <section className="deck-analytics" aria-label="Detailed deck statistics">
      <div className="deck-analytics__heading">
        <div>
          <p className="eyebrow">Analytics</p>
          <h3>Deck composition</h3>
        </div>
      </div>

      <div className="deck-analytics__summary">
        <div>
          <span>Average attack</span>
          <strong>{analytics.averageAttack.toFixed(1)}</strong>
        </div>
        <div>
          <span>Average health</span>
          <strong>{analytics.averageHealth.toFixed(1)}</strong>
        </div>
        <div>
          <span>Unique cards</span>
          <strong>{analytics.uniqueCards}</strong>
        </div>
      </div>

      <div className="deck-analytics__section">
        <h4>Color distribution</h4>
        {analytics.colorCounts.length === 0 ? (
          <p>No color data yet.</p>
        ) : (
          <ul className="analytics-bars">
            {analytics.colorCounts.map((entry) => (
              <li key={entry.color}>
                <div>
                  <span>{entry.color}</span>
                  <strong>
                    {entry.count} · {formatPercent(entry.percentage)}
                  </strong>
                </div>
                <div className="analytics-bars__track" aria-hidden="true">
                  <span style={{ width: `${entry.percentage}%` }} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="deck-analytics__section">
        <h4>Rarity distribution</h4>
        {analytics.rarityCounts.length === 0 ? (
          <p>No rarity data yet.</p>
        ) : (
          <ul className="analytics-bars">
            {analytics.rarityCounts.map((entry) => (
              <li key={entry.rarity}>
                <div>
                  <span>{entry.rarity}</span>
                  <strong>
                    {entry.count} · {formatPercent(entry.percentage)}
                  </strong>
                </div>
                <div className="analytics-bars__track" aria-hidden="true">
                  <span style={{ width: `${entry.percentage}%` }} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
