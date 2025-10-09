/**
 * Type guard builder utilities for creating type narrowing functions
 *
 * These utilities help create type-safe predicates that TypeScript can use
 * for type narrowing in conditional blocks.
 */

/**
 * Creates a type guard function that checks if an object's field matches a specific value
 *
 * @template T - The object type to guard
 * @template K - The key of the field to check (must be a key of T)
 * @template V - The value type to check against
 *
 * @param field - The field name to check
 * @param value - The value to compare against
 * @returns A type guard function that narrows T based on the field value
 *
 * @example
 * ```typescript
 * type Card = { type: "creature" | "instant"; name: string };
 * const isCreature = createTypeGuard<Card, "type", "creature">("type", "creature");
 *
 * const card: Card = { type: "creature", name: "Dragon" };
 * if (isCreature(card)) {
 *   // TypeScript knows card.type is "creature" here
 *   console.log(card.type); // Type: "creature"
 * }
 * ```
 */
export function createTypeGuard<T, K extends keyof T, V extends T[K]>(
  field: K,
  value: V,
): (obj: T) => obj is T & Record<K, V> {
  return (obj: T): obj is T & Record<K, V> => {
    // Handle null and undefined gracefully
    if (obj === null || obj === undefined) {
      return false;
    }

    const fieldValue = obj[field];

    // Handle primitive comparisons
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      // Deep equality check for objects
      return deepEqual(fieldValue, value);
    }

    if (Array.isArray(value)) {
      // Deep equality check for arrays
      return deepEqual(fieldValue, value);
    }

    // Simple equality check for primitives
    return fieldValue === value;
  };
}

/**
 * Deep equality comparison for objects and arrays
 * Used internally by createTypeGuard for complex value comparisons
 *
 * @param a - First value to compare
 * @param b - Second value to compare
 * @returns true if values are deeply equal, false otherwise
 */
function deepEqual(a: unknown, b: unknown): boolean {
  // Handle primitive types
  if (a === b) {
    return true;
  }

  // Handle null and undefined
  if (a === null || b === null || a === undefined || b === undefined) {
    return a === b;
  }

  // Handle different types
  if (typeof a !== typeof b) {
    return false;
  }

  // Handle arrays
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return false;
    }
    return a.every((item, index) => deepEqual(item, b[index]));
  }

  // Handle objects
  if (typeof a === "object" && typeof b === "object") {
    const keysA = Object.keys(a as object);
    const keysB = Object.keys(b as object);

    if (keysA.length !== keysB.length) {
      return false;
    }

    return keysA.every((key) =>
      deepEqual(
        (a as Record<string, unknown>)[key],
        (b as Record<string, unknown>)[key],
      ),
    );
  }

  return false;
}
