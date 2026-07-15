/**
 * Internal field-level privacy marker for move outcome accumulation.
 *
 * Move logs are stored as public messages plus per-player private appendices.
 * PrivateField only exists before the log factory projects hidden outcome
 * details into those appendices.
 */

/**
 * Wraps a value that should only be visible to specific players.
 */
export interface PrivateField<T> {
  readonly __private: true;
  readonly value: T;
  readonly visibleTo: string[];
}

export function privateField<T>(value: T, visibleTo: string[]): PrivateField<T> {
  return { __private: true, value, visibleTo };
}
