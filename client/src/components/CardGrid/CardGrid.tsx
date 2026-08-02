import type { Card } from '../../types/card';
import { CardTile } from '../CardTile/CardTile';

type CardGridProps = {
  cards: Card[];
  onAdd: (card: Card) => void;
  canAdd: (card: Card) => boolean;
  deckQuantities: Record<number, number>;
};

export function CardGrid({
  cards,
  onAdd,
  canAdd,
  deckQuantities,
}: CardGridProps) {
  if (cards.length === 0) {
    return (
      <section className="empty-state">
        <h3>No cards match those filters</h3>
        <p>Try clearing one or more filters or searching for a broader term.</p>
      </section>
    );
  }

  return (
    <section className="card-grid" aria-label="Cards">
      {cards.map((card) => (
        <CardTile
          card={card}
          key={card.id}
          onAdd={onAdd}
          canAdd={canAdd(card)}
          quantity={deckQuantities[card.id] ?? 0}
        />
      ))}
    </section>
  );
}
