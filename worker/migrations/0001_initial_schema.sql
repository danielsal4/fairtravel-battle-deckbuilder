PRAGMA foreign_keys = ON;

CREATE TABLE "Card" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "cardNumber" TEXT NOT NULL,
  "cost" INTEGER NOT NULL DEFAULT 0,
  "type" TEXT NOT NULL,
  "subtype" TEXT,
  "rarity" TEXT NOT NULL,
  "attack" INTEGER,
  "health" INTEGER,
  "rulesText" TEXT NOT NULL DEFAULT '',
  "setCode" TEXT NOT NULL DEFAULT 'FTB',
  "imageUrl" TEXT,
  "color" TEXT NOT NULL DEFAULT '[]',
  "keywords" TEXT NOT NULL DEFAULT '',
  "isUnique" INTEGER NOT NULL DEFAULT 0,
  "deckLimit" INTEGER,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX "Card_slug_key" ON "Card"("slug");
CREATE UNIQUE INDEX "Card_cardNumber_key" ON "Card"("cardNumber");
CREATE INDEX "Card_name_idx" ON "Card"("name");
CREATE INDEX "Card_type_idx" ON "Card"("type");
CREATE INDEX "Card_rarity_idx" ON "Card"("rarity");
CREATE INDEX "Card_cost_idx" ON "Card"("cost");
CREATE INDEX "Card_color_idx" ON "Card"("color");

CREATE TABLE "Deck" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "name" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "Deck_name_idx" ON "Deck"("name");
CREATE INDEX "Deck_updatedAt_idx" ON "Deck"("updatedAt");

CREATE TABLE "DeckCard" (
  "deckId" INTEGER NOT NULL,
  "cardId" INTEGER NOT NULL,
  "quantity" INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY ("deckId", "cardId"),
  CONSTRAINT "DeckCard_deckId_fkey"
    FOREIGN KEY ("deckId") REFERENCES "Deck" ("id")
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "DeckCard_cardId_fkey"
    FOREIGN KEY ("cardId") REFERENCES "Card" ("id")
    ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX "DeckCard_cardId_idx" ON "DeckCard"("cardId");
