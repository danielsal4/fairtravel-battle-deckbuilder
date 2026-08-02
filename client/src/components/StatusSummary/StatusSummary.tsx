import type { HealthResponse } from '../../types/health';

type StatusSummaryProps = {
  health: HealthResponse;
};

export function StatusSummary({ health }: StatusSummaryProps) {
  return (
    <section className="status-strip" aria-label="Application status">
      <span>
        API <strong>connected</strong>
      </span>
      <span>
        Database <strong>{health.database}</strong>
      </span>
      <span>
        Cards <strong>{health.cardCount}</strong>
      </span>
      <span>
        Version <strong>{health.version}</strong>
      </span>
    </section>
  );
}
