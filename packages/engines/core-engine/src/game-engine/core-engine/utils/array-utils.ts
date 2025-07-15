/**
 * Creates an array of numbers from startAt to startAt + size - 1
 * @param size The size of the array to create
 * @param startAt The starting value (default: 0)
 * @returns An array of sequential numbers
 */
export function range(size: number, startAt = 0): number[] {
  return [...Array(size).keys()].map((i) => i + startAt);
}

/**
 * Filters an array by a predicate function
 * @param array The array to filter
 * @param predicate The filter function
 * @returns A new array with only the elements that pass the predicate
 */
export function filterArray<T>(
  array: T[],
  predicate: (item: T) => boolean,
): T[] {
  return array.filter(predicate);
}

/**
 * Checks if an array contains a specific element
 * @param array The array to check
 * @param element The element to look for
 * @returns True if the element is in the array, false otherwise
 */
export function arrayContains<T>(array: T[], element: T): boolean {
  return array.includes(element);
}

/**
 * Checks if a value is empty (null, undefined, empty string, empty array, or empty object)
 * @param value The value to check
 * @returns True if the value is empty, false otherwise
 */
export function isEmpty(value: unknown): boolean {
  return (
    value === null ||
    value === undefined ||
    (typeof value === "string" && value.trim() === "") ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === "object" &&
      value !== null &&
      Object.keys(value).length === 0)
  );
}

/**
 * Removes duplicate values from an array
 * @param array The array to deduplicate
 * @returns A new array with duplicate values removed
 */
export function uniqueArray<T>(array: T[]): T[] {
  return [...new Set(array)];
}

/**
 * Finds the difference between two arrays
 * @param array1 The first array
 * @param array2 The second array
 * @returns A new array with elements from array1 that are not in array2
 */
export function arrayDifference<T>(array1: T[], array2: T[]): T[] {
  return array1.filter((item) => !array2.includes(item));
}
