PRAGMA foreign_keys = ON;

-- Slug-based upserts keep IDs stable when the seed is run again.
INSERT INTO "Card" ("name","slug","cardNumber","cost","type","subtype","rarity","attack","health","rulesText","setCode","imageUrl","color","keywords","isUnique","deckLimit") VALUES ('A Dark Past','a-dark-past','FTB-001',0,'Quest',NULL,'Common',NULL,NULL,'Quest - If a friendly follower was destroyed since your last turn, pay 2 to draw a card.','FTB',NULL,'[]','Quest, Draw, Destroy',0,NULL)
ON CONFLICT("slug") DO UPDATE SET
  "name"=excluded."name", "cardNumber"=excluded."cardNumber", "cost"=excluded."cost",
  "type"=excluded."type", "subtype"=excluded."subtype", "rarity"=excluded."rarity",
  "attack"=excluded."attack", "health"=excluded."health", "rulesText"=excluded."rulesText",
  "setCode"=excluded."setCode", "imageUrl"=excluded."imageUrl", "color"=excluded."color",
  "keywords"=excluded."keywords", "isUnique"=excluded."isUnique",
  "deckLimit"=excluded."deckLimit", "updatedAt"=CURRENT_TIMESTAMP;

INSERT INTO "Card" ("name","slug","cardNumber","cost","type","subtype","rarity","attack","health","rulesText","setCode","imageUrl","color","keywords","isUnique","deckLimit") VALUES ('Hero Down!','hero-down','FTB-002',0,'Quest',NULL,'Common',NULL,NULL,'Quest - If a friendly hero has 15HP or less, pay 2 to heal 5HP to target hero.','FTB',NULL,'[]','Quest, Heal',0,NULL)
ON CONFLICT("slug") DO UPDATE SET
  "name"=excluded."name", "cardNumber"=excluded."cardNumber", "cost"=excluded."cost",
  "type"=excluded."type", "subtype"=excluded."subtype", "rarity"=excluded."rarity",
  "attack"=excluded."attack", "health"=excluded."health", "rulesText"=excluded."rulesText",
  "setCode"=excluded."setCode", "imageUrl"=excluded."imageUrl", "color"=excluded."color",
  "keywords"=excluded."keywords", "isUnique"=excluded."isUnique",
  "deckLimit"=excluded."deckLimit", "updatedAt"=CURRENT_TIMESTAMP;

INSERT INTO "Card" ("name","slug","cardNumber","cost","type","subtype","rarity","attack","health","rulesText","setCode","imageUrl","color","keywords","isUnique","deckLimit") VALUES ('Hero Training','hero-training','FTB-003',0,'Quest',NULL,'Common',NULL,NULL,'Quest - If your hero attacked this turn, pay 2 to draw a card.','FTB',NULL,'[]','Quest, Draw',0,NULL)
ON CONFLICT("slug") DO UPDATE SET
  "name"=excluded."name", "cardNumber"=excluded."cardNumber", "cost"=excluded."cost",
  "type"=excluded."type", "subtype"=excluded."subtype", "rarity"=excluded."rarity",
  "attack"=excluded."attack", "health"=excluded."health", "rulesText"=excluded."rulesText",
  "setCode"=excluded."setCode", "imageUrl"=excluded."imageUrl", "color"=excluded."color",
  "keywords"=excluded."keywords", "isUnique"=excluded."isUnique",
  "deckLimit"=excluded."deckLimit", "updatedAt"=CURRENT_TIMESTAMP;

INSERT INTO "Card" ("name","slug","cardNumber","cost","type","subtype","rarity","attack","health","rulesText","setCode","imageUrl","color","keywords","isUnique","deckLimit") VALUES ('Capital Guard','capital-guard','FTB-004',1,'Follower','Human Soldier','Common',1,3,'Guardian (Defends attacks unless it''s exhausted)','FTB',NULL,'["Blue"]','Follower, Guardian',0,NULL)
ON CONFLICT("slug") DO UPDATE SET
  "name"=excluded."name", "cardNumber"=excluded."cardNumber", "cost"=excluded."cost",
  "type"=excluded."type", "subtype"=excluded."subtype", "rarity"=excluded."rarity",
  "attack"=excluded."attack", "health"=excluded."health", "rulesText"=excluded."rulesText",
  "setCode"=excluded."setCode", "imageUrl"=excluded."imageUrl", "color"=excluded."color",
  "keywords"=excluded."keywords", "isUnique"=excluded."isUnique",
  "deckLimit"=excluded."deckLimit", "updatedAt"=CURRENT_TIMESTAMP;

INSERT INTO "Card" ("name","slug","cardNumber","cost","type","subtype","rarity","attack","health","rulesText","setCode","imageUrl","color","keywords","isUnique","deckLimit") VALUES ('Construct Factory','construct-factory','FTB-005',1,'Artifact','Unique, Item','Uncommon',NULL,NULL,'Whenever an artifact enters your support zone, summon a Blue 1/1 Construct artifact follower token.','FTB',NULL,'["Blue"]','Artifact, Item, Token, Unique',1,1)
ON CONFLICT("slug") DO UPDATE SET
  "name"=excluded."name", "cardNumber"=excluded."cardNumber", "cost"=excluded."cost",
  "type"=excluded."type", "subtype"=excluded."subtype", "rarity"=excluded."rarity",
  "attack"=excluded."attack", "health"=excluded."health", "rulesText"=excluded."rulesText",
  "setCode"=excluded."setCode", "imageUrl"=excluded."imageUrl", "color"=excluded."color",
  "keywords"=excluded."keywords", "isUnique"=excluded."isUnique",
  "deckLimit"=excluded."deckLimit", "updatedAt"=CURRENT_TIMESTAMP;

INSERT INTO "Card" ("name","slug","cardNumber","cost","type","subtype","rarity","attack","health","rulesText","setCode","imageUrl","color","keywords","isUnique","deckLimit") VALUES ('Commune with Nature','commune-with-nature','FTB-006',1,'Spell',NULL,'Common',NULL,NULL,'Draw a card. If you healed a character this turn, draw two instead.','FTB',NULL,'["Green"]','Draw, Heal, Spell',0,NULL)
ON CONFLICT("slug") DO UPDATE SET
  "name"=excluded."name", "cardNumber"=excluded."cardNumber", "cost"=excluded."cost",
  "type"=excluded."type", "subtype"=excluded."subtype", "rarity"=excluded."rarity",
  "attack"=excluded."attack", "health"=excluded."health", "rulesText"=excluded."rulesText",
  "setCode"=excluded."setCode", "imageUrl"=excluded."imageUrl", "color"=excluded."color",
  "keywords"=excluded."keywords", "isUnique"=excluded."isUnique",
  "deckLimit"=excluded."deckLimit", "updatedAt"=CURRENT_TIMESTAMP;

INSERT INTO "Card" ("name","slug","cardNumber","cost","type","subtype","rarity","attack","health","rulesText","setCode","imageUrl","color","keywords","isUnique","deckLimit") VALUES ('Campfire','campfire','FTB-007',2,'Artifact','Item','Common',NULL,NULL,'Deploy (Performs this effect when this is put into play) - Heal 2HP to all friendly characters. At the end of your turn, destroy this and draw a card.','FTB',NULL,'["Green"]','Deploy, Heal, Artifact, Item, Destroy, Draw',0,NULL)
ON CONFLICT("slug") DO UPDATE SET
  "name"=excluded."name", "cardNumber"=excluded."cardNumber", "cost"=excluded."cost",
  "type"=excluded."type", "subtype"=excluded."subtype", "rarity"=excluded."rarity",
  "attack"=excluded."attack", "health"=excluded."health", "rulesText"=excluded."rulesText",
  "setCode"=excluded."setCode", "imageUrl"=excluded."imageUrl", "color"=excluded."color",
  "keywords"=excluded."keywords", "isUnique"=excluded."isUnique",
  "deckLimit"=excluded."deckLimit", "updatedAt"=CURRENT_TIMESTAMP;

INSERT INTO "Card" ("name","slug","cardNumber","cost","type","subtype","rarity","attack","health","rulesText","setCode","imageUrl","color","keywords","isUnique","deckLimit") VALUES ('Chains','chains','FTB-008',2,'Enchantment','Follower Attachment','Common',NULL,NULL,'Attached follower has -4 attack. When the attach of attached follower becomes 0, destroy it.','FTB',NULL,'["Black"]','Enchantment, Follower, Attachment, Destroy',0,NULL)
ON CONFLICT("slug") DO UPDATE SET
  "name"=excluded."name", "cardNumber"=excluded."cardNumber", "cost"=excluded."cost",
  "type"=excluded."type", "subtype"=excluded."subtype", "rarity"=excluded."rarity",
  "attack"=excluded."attack", "health"=excluded."health", "rulesText"=excluded."rulesText",
  "setCode"=excluded."setCode", "imageUrl"=excluded."imageUrl", "color"=excluded."color",
  "keywords"=excluded."keywords", "isUnique"=excluded."isUnique",
  "deckLimit"=excluded."deckLimit", "updatedAt"=CURRENT_TIMESTAMP;
