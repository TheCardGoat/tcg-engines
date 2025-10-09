/**
 * Naming utilities for card tooling
 *
 * Provides functions for converting between different naming conventions
 * (camelCase, PascalCase, kebab-case, snake_case).
 */

/**
 * Generate a valid JavaScript variable name from card name
 *
 * Removes special characters, converts to camelCase, and ensures
 * the name starts with a letter.
 *
 * @param name - Card name to convert
 * @returns Valid JavaScript variable name
 */
export function generateVariableName(name: string): string {
  // Remove special characters and split into words
  const cleaned = name.replace(/[^a-zA-Z0-9\s-]/g, "");
  const words = cleaned.split(/[\s-]+/).filter((w) => w.length > 0);

  if (words.length === 0) {
    return "card";
  }

  // Separate words into text and numbers
  const textWords: string[] = [];
  const numbers: string[] = [];

  for (const word of words) {
    if (/^\d+$/.test(word)) {
      numbers.push(word);
    } else {
      textWords.push(word);
    }
  }

  if (textWords.length === 0) {
    return "card";
  }

  // Convert to camelCase
  const camelCase = textWords
    .map((word, index) => {
      const lower = word.toLowerCase();
      if (index === 0) {
        // First word: lowercase
        return lower;
      }
      // Subsequent words: capitalize first letter
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join("");

  // Append numbers at the end
  return camelCase + numbers.join("");
}

/**
 * Convert string to kebab-case
 *
 * @param str - String to convert
 * @returns kebab-case string
 */
export function toKebabCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9\s-]/g, "") // Remove special characters
    .replace(/([a-z])([A-Z])/g, "$1-$2") // Insert hyphen before capitals
    .replace(/[\s_]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/-+/g, "-") // Collapse multiple hyphens
    .toLowerCase()
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

/**
 * Convert string to PascalCase
 *
 * @param str - String to convert
 * @returns PascalCase string
 */
export function toPascalCase(str: string): string {
  // Handle camelCase/PascalCase by inserting spaces before capitals
  const withSpaces = str.replace(/([a-z])([A-Z])/g, "$1 $2");

  return withSpaces
    .replace(/[^a-zA-Z0-9\s-_]/g, "") // Remove special characters
    .split(/[\s-_]+/) // Split on spaces, hyphens, underscores
    .filter((w) => w.length > 0)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
}

/**
 * Convert string to camelCase
 *
 * @param str - String to convert
 * @returns camelCase string
 */
export function toCamelCase(str: string): string {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

/**
 * Convert string to snake_case
 *
 * @param str - String to convert
 * @returns snake_case string
 */
export function toSnakeCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9\s-_]/g, "") // Remove special characters
    .replace(/([a-z])([A-Z])/g, "$1_$2") // Insert underscore before capitals
    .replace(/[\s-]+/g, "_") // Replace spaces and hyphens with underscores
    .replace(/_+/g, "_") // Collapse multiple underscores
    .toLowerCase()
    .replace(/^_+|_+$/g, ""); // Remove leading/trailing underscores
}
