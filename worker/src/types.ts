export type Bindings = {
  DB: D1Database;
  CLIENT_ORIGIN?: string;
  ADMIN_TOKEN?: string;
};

export type DeckCardInput = {
  cardId: number;
  quantity: number;
};

export type DeckInput = {
  name: string;
  cards: DeckCardInput[];
};
