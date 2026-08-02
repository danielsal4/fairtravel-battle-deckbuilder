export function parseStoredColors(value: string | null): string[] {
  if (!value?.trim()) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(value);

    if (Array.isArray(parsed)) {
      return parsed
        .filter((color): color is string => typeof color === 'string')
        .map((color) => color.trim())
        .filter(
          (color) =>
            color.length > 0 &&
            color.toLocaleLowerCase() !== 'colorless',
        );
    }
  } catch {
    // Support older plain-text and comma-separated values.
  }

  return value
    .split(',')
    .map((color) => color.trim())
    .filter(
      (color) =>
        color.length > 0 &&
        color.toLocaleLowerCase() !== 'colorless',
    );
}

export function serializeColors(colors: unknown): string {
  if (!Array.isArray(colors)) {
    return '[]';
  }

  const normalized = [
    ...new Set(
      colors
        .filter((color): color is string => typeof color === 'string')
        .map((color) => color.trim())
        .filter(
          (color) =>
            color.length > 0 &&
            color.toLocaleLowerCase() !== 'colorless',
        ),
    ),
  ];

  return JSON.stringify(normalized);
}

export function mapCard<T extends { color: string | null }>(card: T) {
  return {
    ...card,
    color: parseStoredColors(card.color),
  };
}
