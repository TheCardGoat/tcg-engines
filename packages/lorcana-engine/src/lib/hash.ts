import { MobXRootStore } from "@lorcanito/lorcana-engine";

const objectHash = require("object-hash");

function isEmpty(value: any): boolean {
  return (
    value === null ||
    value === undefined ||
    (Array.isArray(value) && value.length === 0)
    // (typeof value === "object" &&
    //   value !== null &&
    //   Object.keys(value).length === 0)
  );
}

export function cleanObject(
  obj: any,
  depth = 0,
  maxDepth = 40,
  visited = new WeakSet(),
): any {
  if (depth > maxDepth) {
    return "[MaxDepthExceeded]";
  }

  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (visited.has(obj)) {
    return "[Circular]";
  }

  if (obj instanceof MobXRootStore) {
    return "[Ignored]";
  }

  visited.add(obj);

  if (Array.isArray(obj)) {
    const result = new Array(obj.length);
    for (let i = 0; i < obj.length; i++) {
      result[i] = cleanObject(obj[i], depth + 1, maxDepth, visited);
    }
    return result;
  }

  const result: Record<string, any> = {};
  const keys = Object.keys(obj);
  for (const key of keys) {
    const value = cleanObject(obj[key], depth + 1, maxDepth, visited);
    if (value !== null && value !== undefined && !isEmpty(value)) {
      result[key] = value;
    }
  }

  return result;
}

export function hash(data: unknown): string {
  // Recursively remove all null and undefined values from the object

  return objectHash.MD5(cleanObject(data), {
    ignoreUnknown: true,
    unorderedArrays: true,
    respectType: false,
    excludeKeys: (key: string) => {
      return ["undoState", "_hash", "manualMode"].includes(key);
    },
  });
}
