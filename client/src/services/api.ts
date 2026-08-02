import type { Card } from '../types/card';
import type {
  SavedDeck,
  SaveDeckRequest,
} from '../types/deck';
import type { HealthResponse } from '../types/health';
import type { ValidationResult } from '../types/validation';

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL as string | undefined
)?.replace(/\/+$/, '') ?? '';

function apiUrl(path: string): string {
  return `${API_BASE_URL}${path}`;
}

async function readJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message = `Request failed with status ${response.status}.`;

    try {
      const payload = (await response.json()) as {
        error?: string;
      };

      if (payload.error) {
        message = payload.error;
      }
    } catch {
      // Keep the status-based fallback.
    }

    throw new Error(message);
  }

  return (await response.json()) as T;
}

export async function getHealth(): Promise<HealthResponse> {
  const response = await fetch(apiUrl('/api/health'));
  return readJson<HealthResponse>(response);
}

export async function getCards(): Promise<Card[]> {
  const response = await fetch(apiUrl('/api/cards'));
  return readJson<Card[]>(response);
}

export async function getCard(id: number): Promise<Card> {
  const response = await fetch(apiUrl(`/api/cards/${id}`));
  return readJson<Card>(response);
}

export async function getDecks(): Promise<SavedDeck[]> {
  const response = await fetch(apiUrl('/api/decks'));
  return readJson<SavedDeck[]>(response);
}

export async function createDeck(
  input: SaveDeckRequest,
): Promise<SavedDeck> {
  const response = await fetch(apiUrl('/api/decks'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  return readJson<SavedDeck>(response);
}

export async function updateDeck(
  id: number,
  input: SaveDeckRequest,
): Promise<SavedDeck> {
  const response = await fetch(apiUrl(`/api/decks/${id}`), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  return readJson<SavedDeck>(response);
}

export async function deleteDeck(id: number): Promise<void> {
  const response = await fetch(apiUrl(`/api/decks/${id}`), {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(
      `Delete failed with status ${response.status}.`,
    );
  }
}

export async function validateDeckRequest(
  input: SaveDeckRequest,
): Promise<ValidationResult> {
  const response = await fetch(
    apiUrl('/api/decks/validate'),
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    },
  );

  return readJson<ValidationResult>(response);
}