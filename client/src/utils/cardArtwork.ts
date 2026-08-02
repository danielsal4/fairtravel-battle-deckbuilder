import type { Card } from '../types/card';

const defaultExtension = 'jpg';

export function getCardArtworkUrl(card: Card): string {
  if (card.imageUrl?.trim()) {
    return card.imageUrl.trim();
  }

  return `/card-images/${card.slug}.${defaultExtension}`;
}

export const fallbackCardArtworkUrl = '/card-images/artwork-coming-soon.svg';
