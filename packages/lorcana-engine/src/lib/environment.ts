/**
 * Environment detection utility functions to work with both browser and Node.js
 */

// Safe check for window object for TypeScript
export const isBrowser = (): boolean => {
  return (
    typeof globalThis !== "undefined" &&
    Object.prototype.toString.call(globalThis) === "[object Window]"
  );
};

// Safe check for Node.js environment
export const isNode = (): boolean => {
  return (
    typeof process !== "undefined" &&
    process.versions != null &&
    process.versions.node != null
  );
};

// Use in place of direct window references
export const getGlobalObject = (): typeof globalThis => {
  return globalThis;
};
