export type DeckColorCount = {
  color: string;
  count: number;
  percentage: number;
};

export type DeckRarityCount = {
  rarity: string;
  count: number;
  percentage: number;
};

export type DeckAnalytics = {
  totalCards: number;
  totalAttack: number;
  totalHealth: number;
  averageAttack: number;
  averageHealth: number;
  uniqueCards: number;
  colorlessCards: number;
  colorCounts: DeckColorCount[];
  rarityCounts: DeckRarityCount[];
};
