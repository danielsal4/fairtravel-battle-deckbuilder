import type { ValidationResult } from '../../types/validation';

type ValidationPanelProps = {
  result: ValidationResult;
};

const iconBySeverity = {
  error: '×',
  warning: '!',
  success: '✓',
} as const;

export function ValidationPanel({ result }: ValidationPanelProps) {
  return (
    <section
      className={`validation-panel ${
        result.isValid ? 'validation-panel--valid' : 'validation-panel--invalid'
      }`}
      aria-label="Deck validation"
    >
      <div className="validation-panel__header">
        <div>
          <p className="eyebrow">Deck status</p>
          <h3>{result.isValid ? 'Deck is valid' : 'Deck needs attention'}</h3>
        </div>
        <span className="validation-panel__summary">
          {result.errors.length} error{result.errors.length === 1 ? '' : 's'}
        </span>
      </div>

      <ul className="validation-list">
        {result.issues.map((issue) => (
          <li className={`validation-list__item validation-list__item--${issue.severity}`} key={issue.ruleId}>
            <span className="validation-list__icon" aria-hidden="true">
              {iconBySeverity[issue.severity]}
            </span>
            <div>
              <strong>{issue.title}</strong>
              <p>{issue.message}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
