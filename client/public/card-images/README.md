# Card Images

Place card artwork in this folder using the card slug as the filename.

Examples:

```text
emberroad-vanguard.jpg
lady-pyra-roadbreaker.jpg
stormglass-cartographer.jpg
```

The application resolves artwork in this order:

1. The card's explicit `imageUrl`, when present.
2. `/card-images/<card-slug>.jpg`
3. `artwork-coming-soon.svg`

## Recommended image preparation

- Use JPG for painted or photographic artwork.
- Use a consistent aspect ratio for every card.
- Recommended source size: 800 × 1000 pixels.
- Aim for roughly 150–350 KB per image.
- Use lowercase slug filenames exactly matching the database.
- Do not use spaces in filenames.

Vite copies everything under `client/public` into the production build unchanged.
