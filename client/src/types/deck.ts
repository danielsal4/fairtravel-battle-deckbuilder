import type { Card } from './card';

export type DeckEntry = {
  card: Card;
  quantity: number;
};

export type DeckStats = {
  totalCards: number;
  uniqueCards: number;
  averageCost: number;
  totalCost: number;
  typeCounts: Record<string, number>;
  costCurve: Record<number, number>;
};

export type DeckRules = {
  maximumCards: number;
  maximumCopiesPerCard: number;
};

export type SavedDeckCard = {
  deckId: number;
  cardId: number;
  quantity: number;
  card: Card;
};

export type SavedDeck = {
  id: number;
  name: string;
  cards: SavedDeckCard[];
  createdAt: string;
  updatedAt: string;
};

export type SaveDeckRequest = {
  name: string;
  cards: Array<{
    cardId: number;
    quantity: number;
  }>;
};
