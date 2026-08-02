import { useCallback, useEffect, useState } from 'react';

import { getCards } from '../services/api';
import type { Card } from '../types/card';

type LoadState = 'loading' | 'ready' | 'error';

export function useCards() {
  const [cards, setCards] = useState<Card[]>([]);
  const [state, setState] = useState<LoadState>('loading');
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    setState('loading');
    setError('');

    try {
      setCards(await getCards());
      setState('ready');
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to load cards.');
      setState('error');
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { cards, state, error, reload };
}
