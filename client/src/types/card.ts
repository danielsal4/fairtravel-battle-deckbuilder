export const CARD_COLORS = ['Colorless', 'Red', 'Green', 'Blue', 'Black'] as const;

export type CardColor = (typeof CARD_COLORS)[number];

export type Card = {
  id: number;
  name: string;
  slug: string;
  cardNumber: string;
  cost: number;
  type: string;
  subtype: string | null;
  rarity: string;
  attack: number | null;
  health: number | null;
  rulesText: string;
  setCode: string;
  imageUrl: string | null;
  color: CardColor[];
  keywords: string;
  isUnique: boolean;
  deckLimit: number | null;
};

export type CardSortOption =
  | 'name-asc'
  | 'name-desc'
  | 'cost-asc'
  | 'cost-desc'
  | 'type-asc';

export type CardFilters = {
  search: string;
  type: string;
  rarity: string;
  color: string[];
  cost: string;
  sort: CardSortOption;
};
