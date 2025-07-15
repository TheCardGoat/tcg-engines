import { createId as cuid, init } from "@paralleldrive/cuid2";

/**
 * Generates a unique ID using CUID2
 * @returns A unique ID string
 */
export const createId = cuid;

/**
 * Creates an array of short and unique IDs
 * @param size The number of IDs to generate
 * @returns An array of unique ID strings
 */
export const createShortAndUniqueIds = (size: number): string[] => {
  const createId = init({
    // 1296 possibilities
    length: 2,
  });

  const ids = new Set<string>();

  do {
    ids.add(createId());
  } while (ids.size < size);

  return Array.from(ids);
};

/**
 * Generates a simple unique ID using Math.random
 * @returns A unique ID string
 */
export function generateUniqueId(): string {
  return Math.random().toString(36).substring(2, 15);
}
