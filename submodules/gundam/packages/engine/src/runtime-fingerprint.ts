import { GUNDAM_MOVE_NAMES } from "./gundam/moves/move-name.ts";

export interface GundamEngineRuntimeFingerprint {
  packageName: "@tcg/gundam-engine";
  moveCount: number;
  hash: string;
}

export const GUNDAM_ENGINE_RUNTIME: GundamEngineRuntimeFingerprint = {
  packageName: "@tcg/gundam-engine",
  moveCount: GUNDAM_MOVE_NAMES.length,
  hash: runtimeHash({
    moves: GUNDAM_MOVE_NAMES,
  }),
};

function runtimeHash(value: unknown): string {
  const input = stableStringify(value);
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(",")}]`;
  }
  if (value && typeof value === "object") {
    return `{${Object.entries(value)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, nested]) => `${JSON.stringify(key)}:${stableStringify(nested)}`)
      .join(",")}}`;
  }
  return JSON.stringify(value) ?? "undefined";
}
