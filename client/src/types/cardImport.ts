import type { Card } from './card';

export type CardImportRecord = Omit<Card, 'id'> & {
  createdAt?: never;
  updatedAt?: never;
};

export type CardImportResponse = {
  imported: number;
  cards: Card[];
};
