import { Hono } from 'hono';

import { createPrisma } from './lib/prisma';
import type { Bindings, DeckInput } from './types';
import { mapCard } from './utils/cardColors';
import {
  buildValidation,
  MAXIMUM_COPIES,
  validateDeckInput,
} from './utils/decks';
import { parsePositiveId } from './utils/responses';

const app = new Hono<{ Bindings: Bindings }>();

app.use('*', async (c, next) => {
  if (c.req.method === 'OPTIONS') {
    return new Response(null, { status: 204 });
  }

  await next();

  const allowedOrigin = c.env.CLIENT_ORIGIN || '*';
  c.header('Access-Control-Allow-Origin', allowedOrigin);
  c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  c.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
});

app.onError((error, c) => {
  console.error(error);
  return c.json({ error: 'Internal server error.' }, 500);
});

app.get('/api/health', async (c) => {
  const prisma = createPrisma(c.env.DB);
  const cardCount = await prisma.card.count();

  return c.json({
    status: 'ok',
    application: 'Fairtravel Battle Deck Builder',
    version: '0.8.0',
    database: 'connected',
    cardCount,
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/cards', async (c) => {
  const prisma = createPrisma(c.env.DB);
  const cards = await prisma.card.findMany({
    orderBy: [{ cost: 'asc' }, { name: 'asc' }],
  });

  return c.json(cards.map(mapCard));
});

app.get('/api/cards/:id', async (c) => {
  const id = parsePositiveId(c.req.param('id'));

  if (!id) {
    return c.json({ error: 'Card id must be a positive integer.' }, 400);
  }

  const prisma = createPrisma(c.env.DB);
  const card = await prisma.card.findUnique({ where: { id } });

  if (!card) {
    return c.json({ error: 'Card not found.' }, 404);
  }

  return c.json(mapCard(card));
});

const deckInclude = {
  cards: {
    include: { card: true },
    orderBy: { card: { name: 'asc' as const } },
  },
};

function mapDeck<T extends { cards: Array<{ card: { color: string | null } }> }>(
  deck: T,
) {
  return {
    ...deck,
    cards: deck.cards.map((entry) => ({
      ...entry,
      card: mapCard(entry.card),
    })),
  };
}

async function loadCardLimits(
  database: D1Database,
  input: DeckInput,
): Promise<Map<number, number> | null> {
  const prisma = createPrisma(database);
  const cardIds = input.cards.map((entry) => entry.cardId);

  if (cardIds.length === 0) {
    return new Map();
  }

  const cards = await prisma.card.findMany({
    where: { id: { in: cardIds } },
    select: {
      id: true,
      isUnique: true,
      deckLimit: true,
    },
  });

  if (cards.length !== cardIds.length) {
    return null;
  }

  return new Map(
    cards.map((card) => [
      card.id,
      card.isUnique ? 1 : (card.deckLimit ?? MAXIMUM_COPIES),
    ]),
  );
}

app.post('/api/decks/validate', async (c) => {
  const parsed = validateDeckInput(await c.req.json());

  if (!parsed.input) {
    return c.json({ error: parsed.error }, 400);
  }

  const limits = await loadCardLimits(c.env.DB, parsed.input);

  if (!limits) {
    return c.json({ error: 'One or more cards do not exist.' }, 400);
  }

  return c.json(buildValidation(parsed.input.cards, limits));
});

app.get('/api/decks', async (c) => {
  const prisma = createPrisma(c.env.DB);
  const decks = await prisma.deck.findMany({
    include: deckInclude,
    orderBy: { updatedAt: 'desc' },
  });

  return c.json(decks.map(mapDeck));
});

app.get('/api/decks/:id', async (c) => {
  const id = parsePositiveId(c.req.param('id'));

  if (!id) {
    return c.json({ error: 'Deck id must be a positive integer.' }, 400);
  }

  const prisma = createPrisma(c.env.DB);
  const deck = await prisma.deck.findUnique({
    where: { id },
    include: deckInclude,
  });

  if (!deck) {
    return c.json({ error: 'Deck not found.' }, 404);
  }

  return c.json(mapDeck(deck));
});

app.post('/api/decks', async (c) => {
  const parsed = validateDeckInput(await c.req.json());

  if (!parsed.input) {
    return c.json({ error: parsed.error }, 400);
  }

  const limits = await loadCardLimits(c.env.DB, parsed.input);

  if (!limits) {
    return c.json({ error: 'One or more cards do not exist.' }, 400);
  }

  const validation = buildValidation(parsed.input.cards, limits);

  if (!validation.isValid) {
    return c.json({ error: 'Deck validation failed.', validation }, 400);
  }

  const prisma = createPrisma(c.env.DB);
  const deck = await prisma.deck.create({
    data: {
      name: parsed.input.name,
      cards: {
        create: parsed.input.cards.map((entry) => ({
          cardId: entry.cardId,
          quantity: entry.quantity,
        })),
      },
    },
    include: deckInclude,
  });

  return c.json(mapDeck(deck), 201);
});

app.put('/api/decks/:id', async (c) => {
  const id = parsePositiveId(c.req.param('id'));

  if (!id) {
    return c.json({ error: 'Deck id must be a positive integer.' }, 400);
  }

  const parsed = validateDeckInput(await c.req.json());

  if (!parsed.input) {
    return c.json({ error: parsed.error }, 400);
  }

  const limits = await loadCardLimits(c.env.DB, parsed.input);

  if (!limits) {
    return c.json({ error: 'One or more cards do not exist.' }, 400);
  }

  const validation = buildValidation(parsed.input.cards, limits);

  if (!validation.isValid) {
    return c.json({ error: 'Deck validation failed.', validation }, 400);
  }

  const prisma = createPrisma(c.env.DB);
  const existing = await prisma.deck.findUnique({ where: { id } });

  if (!existing) {
    return c.json({ error: 'Deck not found.' }, 404);
  }

  await prisma.deckCard.deleteMany({ where: { deckId: id } });

  const deck = await prisma.deck.update({
    where: { id },
    data: {
      name: parsed.input.name,
      cards: {
        create: parsed.input.cards.map((entry) => ({
          cardId: entry.cardId,
          quantity: entry.quantity,
        })),
      },
    },
    include: deckInclude,
  });

  return c.json(mapDeck(deck));
});

app.delete('/api/decks/:id', async (c) => {
  const id = parsePositiveId(c.req.param('id'));

  if (!id) {
    return c.json({ error: 'Deck id must be a positive integer.' }, 400);
  }

  const prisma = createPrisma(c.env.DB);
  const existing = await prisma.deck.findUnique({ where: { id } });

  if (!existing) {
    return c.json({ error: 'Deck not found.' }, 404);
  }

  await prisma.deck.delete({ where: { id } });
  return c.body(null, 204);
});

app.notFound((c) => c.json({ error: 'Not found.' }, 404));

export default app;
