import type { DeckRules, DeckStats as DeckStatsModel } from '../../types/deck';

type DeckStatsProps = {
  stats: DeckStatsModel;
  rules: DeckRules;
};

export function DeckStats({ stats, rules }: DeckStatsProps) {
  const curveEntries = Object.entries(stats.costCurve).sort(
    ([left], [right]) => Number(left) - Number(right),
  );
  const highestCurveValue = Math.max(1, ...curveEntries.map(([, count]) => count));

  return (
    <section className="deck-stats" aria-label="Deck statistics">
      <div className="deck-stat-grid">
        <div>
          <span>Cards</span>
          <strong>
            {stats.totalCards}/{rules.maximumCards}
          </strong>
        </div>
        <div>
          <span>Unique</span>
          <strong>{stats.uniqueCards}</strong>
        </div>
        <div>
          <span>Average cost</span>
          <strong>{stats.averageCost.toFixed(1)}</strong>
        </div>
      </div>

      <div className="deck-breakdown">
        <h3>Card types</h3>
        {Object.keys(stats.typeCounts).length === 0 ? (
          <p>No cards added yet.</p>
        ) : (
          <ul>
            {Object.entries(stats.typeCounts)
              .sort(([left], [right]) => left.localeCompare(right))
              .map(([type, count]) => (
                <li key={type}>
                  <span>{type}</span>
                  <strong>{count}</strong>
                </li>
              ))}
          </ul>
        )}
      </div>

      <div className="cost-curve">
        <h3>Cost curve</h3>
        {curveEntries.length === 0 ? (
          <p>Add cards to see the curve.</p>
        ) : (
          <div className="cost-curve__chart">
            {curveEntries.map(([cost, count]) => (
              <div className="cost-curve__column" key={cost}>
                <span className="cost-curve__count">{count}</span>
                <div
                  className="cost-curve__bar"
                  style={{ height: `${Math.max(10, (count / highestCurveValue) * 92)}px` }}
                />
                <span className="cost-curve__label">{cost}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
