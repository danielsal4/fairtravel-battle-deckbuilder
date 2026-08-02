import { useEffect, useMemo, useState } from 'react';

import type { Card } from '../../types/card';
import type { DeckEntry } from '../../types/deck';
import type { DeckImportIssue } from '../../types/importExport';
import type { ValidationResult } from '../../types/validation';
import {
  exportDeckList,
  parseDeckList,
} from '../../utils/deckImportExport';

type ImportExportDialogProps = {
  isOpen: boolean;
  mode: 'import' | 'export';
  cards: Card[];
  deckName: string;
  entries: DeckEntry[];
  validation: ValidationResult;
  maximumCopiesPerCard: number;
  onClose: () => void;
  onImport: (entries: DeckEntry[], deckName: string | null) => void;
};

export function ImportExportDialog({
  isOpen,
  mode,
  cards,
  deckName,
  entries,
  validation,
  maximumCopiesPerCard,
  onClose,
  onImport,
}: ImportExportDialogProps) {
  const exportedText = useMemo(
    () => exportDeckList(deckName, entries, validation),
    [deckName, entries, validation],
  );
  const [text, setText] = useState('');
  const [issues, setIssues] = useState<DeckImportIssue[]>([]);
  const [copyMessage, setCopyMessage] = useState('');

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setText(mode === 'export' ? exportedText : '');
    setIssues([]);
    setCopyMessage('');

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.body.classList.add('modal-open');

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.classList.remove('modal-open');
    };
  }, [exportedText, isOpen, mode, onClose]);

  if (!isOpen) {
    return null;
  }

  const importDeck = () => {
    const result = parseDeckList(text, cards, maximumCopiesPerCard);

    if (result.issues.length > 0) {
      setIssues(result.issues);
      return;
    }

    onImport(result.entries, result.deckName);
    onClose();
  };

  const copyExport = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyMessage('Copied to clipboard.');
    } catch {
      setCopyMessage('Clipboard access failed. Select the text and copy it manually.');
    }
  };

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        aria-labelledby="import-export-title"
        aria-modal="true"
        className="import-export-dialog"
        role="dialog"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="import-export-dialog__header">
          <div>
            <p className="eyebrow">Deck tools</p>
            <h2 id="import-export-title">
              {mode === 'import' ? 'Import deck list' : 'Export deck list'}
            </h2>
          </div>
          <button className="modal-close" type="button" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <p className="import-export-dialog__help">
          {mode === 'import'
            ? 'Use one line per card, such as “4 Wayfinder Apprentice”. An optional “# Deck:” header sets the deck name.'
            : 'Copy this text into a message, document, or another Fairtravel Battle deck builder.'}
        </p>

        <textarea
          value={text}
          onChange={(event) => {
            setText(event.target.value);
            setIssues([]);
            setCopyMessage('');
          }}
          readOnly={mode === 'export'}
          spellCheck={false}
          aria-label={mode === 'import' ? 'Deck list to import' : 'Exported deck list'}
        />

        {issues.length > 0 && (
          <div className="import-errors" role="alert">
            <strong>Import could not be completed</strong>
            <ul>
              {issues.map((issue) => (
                <li key={`${issue.line}-${issue.message}`}>
                  Line {issue.line}: {issue.message}
                </li>
              ))}
            </ul>
          </div>
        )}

        {copyMessage && <p className="import-export-dialog__message">{copyMessage}</p>}

        <div className="import-export-dialog__actions">
          <button className="secondary-button" type="button" onClick={onClose}>
            Cancel
          </button>
          {mode === 'import' ? (
            <button className="primary-button" type="button" onClick={importDeck}>
              Import
            </button>
          ) : (
            <button className="primary-button" type="button" onClick={() => void copyExport()}>
              Copy
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
