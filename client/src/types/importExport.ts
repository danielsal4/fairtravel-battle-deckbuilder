import type { DeckEntry } from './deck';

export type DeckImportIssue = {
  line: number;
  text: string;
  message: string;
};

export type DeckImportResult = {
  entries: DeckEntry[];
  deckName: string | null;
  issues: DeckImportIssue[];
};

export type DeckExportOptions = {
  includeHeader: boolean;
  includeMetadata: boolean;
};
