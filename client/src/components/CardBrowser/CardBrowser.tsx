import { useMemo, useState } from 'react';

import type { Card, CardFilters } from '../../types/card';
import { CardGrid } from '../CardGrid/CardGrid';
import { FilterBar } from '../FilterBar/FilterBar';

const initialFilters: CardFilters = {
  search: '',
  type: '',
  rarity: '',
  color: [],
  cost: '',
  sort: 'name-asc',
};

type CardBrowserProps = {
  cards: Card[];
  onAddCard: (card: Card) => void;
  canAddCard: (card: Card) => boolean;
  deckQuantities: Record<number, number>;
};

export function CardBrowser({
  cards,
  onAddCard,
  canAddCard,
  deckQuantities,
}: CardBrowserProps) {
  const [filters, setFilters] = useState<CardFilters>(initialFilters);

  const types = useMemo(
    () => [...new Set(cards.map((card) => card.type))].sort((a, b) => a.localeCompare(b)),
    [cards],
  );

  const rarities = useMemo(
    () => [...new Set(cards.map((card) => card.rarity))].sort((a, b) => a.localeCompare(b)),
    [cards],
  );

  const colors = useMemo(() => {
    const availableColors = new Set(
      cards.flatMap((card) => card.color),
    );

    if (cards.some((card) => card.color.length === 0)) {
      availableColors.add('Colorless');
    }

    return [...availableColors].sort((a, b) =>
      a.localeCompare(b),
    );
  }, [cards]);

  const costs = useMemo(
    () => [...new Set(cards.map((card) => card.cost))].sort((a, b) => a - b),
    [cards],
  );

  const visibleCards = useMemo(() => {
    const search = filters.search.trim().toLocaleLowerCase();

    return cards
      .filter((card) => {
        const colorMatches =
          filters.color.length === 0 ||
          filters.color.some((selectedColor) => {
            if (selectedColor === 'Colorless') {
              return card.color.length === 0;
            }

            return card.color.includes(selectedColor as any);
          });
        const searchableText = [
          card.name,
          card.type,
          card.subtype ?? '',
          card.rarity,
          card.rulesText,
          card.setCode,
          card.cardNumber,
          card.color,
          card.keywords,
        ]
          .join(' ')
          .toLocaleLowerCase();

        return (
          (!search || searchableText.includes(search)) &&
          (!filters.type || card.type === filters.type) &&
          (!filters.rarity || card.rarity === filters.rarity) &&
          colorMatches &&
          (!filters.cost || card.cost === Number(filters.cost))
        );
      })
      .sort((left, right) => {
        switch (filters.sort) {
          case 'name-desc':
            return right.name.localeCompare(left.name);
          case 'cost-asc':
            return left.cost - right.cost || left.name.localeCompare(right.name);
          case 'cost-desc':
            return right.cost - left.cost || left.name.localeCompare(right.name);
          case 'type-asc':
            return left.type.localeCompare(right.type) || left.name.localeCompare(right.name);
          case 'name-asc':
          default:
            return left.name.localeCompare(right.name);
        }
      });
  }, [cards, filters]);

  return (
    <>
      <FilterBar
        filters={filters}
        types={types}
        rarities={rarities}
        colors={colors}
        costs={costs}
        resultCount={visibleCards.length}
        totalCount={cards.length}
        onChange={setFilters}
        onReset={() => setFilters(initialFilters)}
      />
      <CardGrid
        cards={visibleCards}
        onAdd={onAddCard}
        canAdd={canAddCard}
        deckQuantities={deckQuantities}
      />
    </>
  );
}
