# Deck Validation

The project now validates decks in both the React client and Express server.

## Current rules

- Empty-deck status
- Minimum deck size: 40
- Maximum deck size: 40
- Maximum copies per card: 4

## Architecture

Each rule implements a small interface with an `id` and `validate` function. Rules return a structured issue with a severity, title, and message.

The client runs validation on every deck change for immediate feedback. The server runs validation again before creating or updating a saved deck.

## Adding a rule

Add a new `DeckValidationRule` to the rule list. Future examples include:

- Color restrictions
- Unique-card limits
- Banned cards