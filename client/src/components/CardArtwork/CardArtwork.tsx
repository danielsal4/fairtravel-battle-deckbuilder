import { useEffect, useState } from 'react';

import type { Card } from '../../types/card';
import {
  fallbackCardArtworkUrl,
  getCardArtworkUrl,
} from '../../utils/cardArtwork';

type CardArtworkProps = {
  card: Card;
  className?: string;
  decorative?: boolean;
};

export function CardArtwork({
  card,
  className,
  decorative = false,
}: CardArtworkProps) {
  const requestedUrl = getCardArtworkUrl(card);
  const [source, setSource] = useState(requestedUrl);

  useEffect(() => {
    setSource(requestedUrl);
  }, [requestedUrl]);

  return (
    <img
      className={className}
      src={source}
      alt={decorative ? '' : `${card.name} artwork`}
      aria-hidden={decorative || undefined}
      loading="lazy"
      decoding="async"
      onError={() => {
        if (source !== fallbackCardArtworkUrl) {
          setSource(fallbackCardArtworkUrl);
        }
      }}
    />
  );
}
