const objectHash = require("object-hash");

import { isEmpty } from "../utils/array-utils";

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
  return objectHash.MD5(cleanObject(data), {
    excludeKeys: (key: string) => {
      return [
        "ctx.deltalog",
        "ctx._stateID",
        "ctx._redo",
        "ctx._undo",
      ].includes(key);
    },
  });
}
