import type { DeckEntry } from '../types/deck';
import type { DeckAnalytics } from '../types/deckAnalytics';

function percentage(count: number, total: number): number {
  return total === 0 ? 0 : (count / total) * 100;
}

export function calculateDeckAnalytics(entries: DeckEntry[]): DeckAnalytics {
  const totalCards = entries.reduce(
    (sum, entry) => sum + entry.quantity,
    0,
  );

  let totalAttack = 0;
  let totalHealth = 0;
  let combatCardCount = 0;
  let uniqueCards = 0;
  let colorlessCards = 0;

  const colorMap = new Map<string, number>();
  const rarityMap = new Map<string, number>();

  for (const entry of entries) {
    const { card, quantity } = entry;

    if (card.color.length === 0) {
      colorlessCards += quantity;
      colorMap.set(
        'Colorless',
        (colorMap.get('Colorless') ?? 0) + quantity,
      );
    } else {
      for (const color of card.color) {
        colorMap.set(
          color,
          (colorMap.get(color) ?? 0) + quantity,
        );
      }
    }

    if (card.attack !== null || card.health !== null) {
      totalAttack += (card.attack ?? 0) * quantity;
      totalHealth += (card.health ?? 0) * quantity;
      combatCardCount += quantity;
    }

    if (card.isUnique) {
      uniqueCards += quantity;
    }

    rarityMap.set(
      card.rarity,
      (rarityMap.get(card.rarity) ?? 0) + quantity,
    );
  }

  return {
    totalCards,
    totalAttack,
    totalHealth,
    averageAttack:
      combatCardCount === 0 ? 0 : totalAttack / combatCardCount,
    averageHealth:
      combatCardCount === 0 ? 0 : totalHealth / combatCardCount,
    uniqueCards,
    colorlessCards,
    colorCounts: [...colorMap.entries()]
      .map(([color, count]) => ({
        color,
        count,
        percentage: percentage(count, totalCards),
      }))
      .sort(
        (left, right) =>
          right.count - left.count ||
          left.color.localeCompare(right.color),
      ),
    rarityCounts: [...rarityMap.entries()]
      .map(([rarity, count]) => ({
        rarity,
        count,
        percentage: percentage(count, totalCards),
      }))
      .sort(
        (left, right) =>
          right.count - left.count ||
          left.rarity.localeCompare(right.rarity),
      ),
  };
}
