import type { Card } from '../types/card';

const defaultExtension = 'png';

export function getCardArtworkUrl(card: Card): string {
  if (card.imageUrl?.trim()) {
    return card.imageUrl.trim();
  }

  return `/card-images/${card.cardNumber}.${defaultExtension}`;
}

export const fallbackCardArtworkUrl = '/card-images/artwork-coming-soon.svg';
