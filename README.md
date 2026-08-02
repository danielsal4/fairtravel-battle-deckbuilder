# Fairtravel Battle Deck Builder

A web-based deckbuilding application for the Fairtravel Battle collectible card game.

## Features

- React and TypeScript frontend powered by Vite
- Node.js, Express, and TypeScript API
- Prisma with a local SQLite development database
- Searchable and filterable card library
- Colorless, single-color, and multicolor card support
- Local slug-based card artwork with fallback images
- Click-to-add deck building
- Quantity limits and deck validation
- Deck statistics, color distribution, rarity distribution, and cost curve
- Save, load, update, and delete decks
- Deck-list import and export
- JSON card-data import and export
- Unsaved-change warnings

## Requirements

- Node.js 20.19 or newer
- npm

## First-time setup

```bash
npm install
npm install --prefix client
npm install --prefix server
npm run db:generate
npm run db:migrate
npm run db:seed
```

Prisma may run the seed automatically after a development migration. Avoid
running the seed twice unless you intentionally want to update the seed data.

## Development

Start the client and server together:

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

The API runs at:

```text
http://localhost:3001
```

## Verification

```bash
npm run typecheck
npm run build
```

## Database commands

```bash
npm run db:generate
npm run db:migrate
npm run db:deploy
npm run db:seed
npm run db:studio
```

Use `db:migrate` while developing schema changes. Use `db:deploy` in a hosted
environment to apply committed Prisma migrations.

## Card colors

The database stores colors as serialized JSON because SQLite does not support
array columns directly.

Examples:

```json
[]
```

```json
["Blue"]
```

```json
["Red", "Black"]
```

An empty array represents a colorless card. The API converts the stored value
into a normal TypeScript `string[]` before returning cards to the client.

## Card artwork

Place JPG images in:

```text
client/public/card-images/
```

Use the card slug as the filename:

```text
a-dark-past.jpg
capital-guard.jpg
```

Cards without a matching image use the fallback artwork.

## Production

Build both applications:

```bash
npm run build
```

Apply committed database migrations:

```bash
npm run db:deploy
```

Start the built API:

```bash
npm run start --prefix server
```
