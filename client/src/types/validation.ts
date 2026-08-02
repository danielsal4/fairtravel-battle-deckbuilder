export type ValidationSeverity = 'error' | 'warning' | 'success';

export type ValidationIssue = {
  ruleId: string;
  severity: ValidationSeverity;
  title: string;
  message: string;
};

export type ValidationResult = {
  isValid: boolean;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
  successes: ValidationIssue[];
  issues: ValidationIssue[];
};

export type DeckValidationConfig = {
  minimumCards: number;
  maximumCards: number;
  maximumCopiesPerCard: number;
  allowEmptyDeck: boolean;
};
