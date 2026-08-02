type UnsavedBadgeProps = {
  isDirty: boolean;
};

export function UnsavedBadge({ isDirty }: UnsavedBadgeProps) {
  return (
    <span
      className={`unsaved-badge ${isDirty ? 'unsaved-badge--dirty' : 'unsaved-badge--saved'}`}
      aria-live="polite"
    >
      {isDirty ? 'Unsaved changes' : 'Saved'}
    </span>
  );
}
