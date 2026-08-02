import type { Card } from '../../types/card';
import { CardArtwork } from '../CardArtwork/CardArtwork';

type CardTileProps = {
  card: Card;
  onAdd: (card: Card) => void;
  canAdd: boolean;
  quantity: number;
};

export function CardTile({
  card,
  onAdd,
  canAdd,
  quantity,
}: CardTileProps) {
  return (
    <button
      className="collection-card"
      type="button"
      onClick={() => {
        if (canAdd) {
          onAdd(card);
        }
      }}
      disabled={!canAdd}
      aria-label={
        canAdd
          ? `Add ${card.name} to deck`
          : `${card.name} cannot be added because its limit was reached`
      }
    >
      <div className="collection-card__art">
        <CardArtwork card={card} className="card-artwork" decorative />
      </div>

      <div className="collection-card__details">
        <div className="collection-card__topline">
          <span>{card.type}</span>
          <strong aria-label={`Cost ${card.cost}`}>{card.cost}</strong>
        </div>

        <h3>{card.name}</h3>

        <p className="collection-card__classification">
          {[
            card.subtype,
            card.rarity,
            card.color.length > 0
              ? card.color.join(' / ')
              : 'Colorless',
          ]
            .filter(Boolean)
            .join(' · ')}
        </p>

        <p className="collection-card__rules">
          {card.rulesText || 'No rules text.'}
        </p>

        <div className="card-badges">
          {card.isUnique && <span>Unique</span>}
          {card.deckLimit !== null && <span>Limit {card.deckLimit}</span>}
        </div>

        <div className="collection-card__footer">
          <span>
            {card.setCode} · {card.cardNumber}
          </span>

          {(card.attack !== null || card.health !== null) && (
            <span className="collection-card__stats">
              {card.attack ?? '—'} / {card.health ?? '—'}
            </span>
          )}
        </div>

        <div className="collection-card__deck-status">
          {quantity > 0 ? `${quantity} in deck` : 'Click to add'}
        </div>
      </div>
    </button>
  );
}
