# API

## Health

### `GET /api/health`

Returns application, database, version, and card-count information.

## Cards

### `GET /api/cards`

Returns every card.

### `GET /api/cards/:id`

Returns one card by numeric ID.

## Decks

### `GET /api/decks`

Returns all saved decks with their cards.

### `GET /api/decks/:id`

Returns one saved deck with its cards.

### `POST /api/decks`

Creates a deck.

```json
{
  "name": "Forest Control",
  "cards": [
    { "cardId": 1, "quantity": 4 },
    { "cardId": 2, "quantity": 2 }
  ]
}
```

### `PUT /api/decks/:id`

Replaces a saved deck's name and card list.

### `DELETE /api/decks/:id`

Deletes a saved deck.

Deck writes enforce a 40-card maximum and a four-copy maximum.


### `POST /api/decks/validate`

Validates a deck request without saving it. Returns structured errors, warnings, and successes.
