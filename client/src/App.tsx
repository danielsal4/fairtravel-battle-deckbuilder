import { useCallback, useEffect, useState } from 'react';

import { DeckBuilder } from './components/DeckBuilder/DeckBuilder';
import { StatusSummary } from './components/StatusSummary/StatusSummary';
import { useCards } from './hooks/useCards';
import { getHealth } from './services/api';
import type { HealthResponse } from './types/health';

type HealthState = 'loading' | 'ready' | 'error';

export default function App() {
  const cards = useCards();
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [healthState, setHealthState] = useState<HealthState>('loading');

  const loadHealth = useCallback(async () => {
    setHealthState('loading');

    try {
      setHealth(await getHealth());
      setHealthState('ready');
    } catch {
      setHealthState('error');
    }
  }, []);

  useEffect(() => {
    void loadHealth();
  }, [loadHealth]);

  const reload = () => {
    void Promise.all([cards.reload(), loadHealth()]);
  };

  return (
    <div className="app-shell">
      <header className="site-header">
        <div>
          <p className="eyebrow">Fairtravel Battle</p>
          <h1>Deck Builder</h1>
          <p className="subtitle">
            Browse the card library, add cards to an in-memory deck, and review its totals and cost
            curve.
          </p>
        </div>
        {healthState === 'ready' && health && <StatusSummary health={health} />}
      </header>

      <main>
        {cards.state === 'loading' && (
          <section className="panel loading-panel" aria-live="polite">
            Loading cards…
          </section>
        )}

        {cards.state === 'error' && (
          <section className="panel error-panel" role="alert">
            <p className="eyebrow">Connection error</p>
            <h2>Unable to load the card library</h2>
            <p>{cards.error}</p>
            <button type="button" onClick={reload}>
              Retry
            </button>
          </section>
        )}

        {cards.state === 'ready' && <DeckBuilder cards={cards.cards} />}
      </main>
    </div>
  );
}
