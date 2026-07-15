/**
 * Context types for structured logging in the v2 parser.
 */

export interface LogContext {
  cardName?: string;
  abilityText?: string;
  stage?: string;
  parser?: string;
  reason?: string;
  [key: string]: unknown;
}
