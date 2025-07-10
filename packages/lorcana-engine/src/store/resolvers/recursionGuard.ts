const cache = new Map();

export function recursionGuard<T>(
  key: string,
  fn: () => T,
  defaultReturn: T,
): T {
  if (cache.has(key)) {
    console.error("Recursion detected: ", key);
    return defaultReturn;
  }

  cache.set(key, true);

  try {
    const result = fn();
    return result;
  } finally {
    cache.delete(key);
  }
}
