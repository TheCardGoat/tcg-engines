/**
 * Test State Builder
 *
 * Task 2.5: Implement createTestState<T>(overrides?)
 *
 * Creates test state objects with defaults and selective overrides.
 * Simplifies test setup by allowing partial state specifications.
 *
 * Features:
 * - Deep merge of defaults and overrides
 * - Type-safe: overrides must match state structure
 * - Immutable: doesn't modify defaults
 * - Supports nested objects and arrays
 *
 * @example
 * ```typescript
 * const defaults = {
 *   turn: 1,
 *   phase: 'setup',
 *   players: [
 *     { id: 'p1', health: 20 }
 *   ]
 * };
 *
 * // Use defaults
 * const state = createTestState(defaults);
 *
 * // Override specific fields
 * const midGameState = createTestState(defaults, {
 *   turn: 5,
 *   phase: 'play'
 * });
 *
 * // Override nested fields
 * const lowHealthState = createTestState(defaults, {
 *   players: [{ id: 'p1', health: 1 }]
 * });
 * ```
 */
export function createTestState<T>(defaults: T, overrides?: Partial<T>): T {
  // Use structuredClone for deep cloning to ensure immutability
  // This preserves complex types (Date, Map, Set, etc.) better than JSON
  const clonedDefaults = structuredClone(defaults);

  if (!overrides) {
    return clonedDefaults;
  }

  // Deep merge overrides into cloned defaults
  return deepMerge(clonedDefaults, overrides);
}

/**
 * Deep merge utility
 *
 * Recursively merges source into target.
 * Arrays are replaced entirely, not merged element-wise.
 *
 * @internal
 */
function deepMerge<T>(target: T, source: Partial<T>): T {
  const result = { ...target };

  for (const key in source) {
    if (Object.hasOwn(source, key)) {
      const sourceValue = source[key];
      const targetValue = target[key];

      if (sourceValue === undefined) {
        // Allow explicit undefined to override
        // Biome-ignore lint/suspicious/noExplicitAny: Safe type assertion for deep merge
        result[key] = sourceValue as any;
      } else if (isObject(sourceValue) && isObject(targetValue) && !Array.isArray(sourceValue)) {
        // Recursively merge objects (but not arrays)
        // Biome-ignore lint/suspicious/noExplicitAny: Safe type assertion for deep merge
        result[key] = deepMerge(targetValue, sourceValue as any) as any;
      } else {
        // Replace primitives, arrays, null, etc.
        // Biome-ignore lint/suspicious/noExplicitAny: Safe type assertion for deep merge
        result[key] = sourceValue as any;
      }
    }
  }

  return result;
}

/**
 * Type guard for objects
 *
 * @internal
 */
function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
