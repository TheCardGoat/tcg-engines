import { DSL_VERSION, MIN_SUPPORTED_DSL_VERSION } from "@tcg/cyberpunk-types";
import { MOVE_IDS } from "./moves/index.ts";

export interface CyberpunkEngineRuntimeFingerprint {
  packageName: "@tcg/cyberpunk-engine";
  dslVersion: number;
  minSupportedDslVersion: number;
  moveCount: number;
  hash: string;
}

export const CYBERPUNK_ENGINE_RUNTIME: CyberpunkEngineRuntimeFingerprint = {
  packageName: "@tcg/cyberpunk-engine",
  dslVersion: DSL_VERSION,
  minSupportedDslVersion: MIN_SUPPORTED_DSL_VERSION,
  moveCount: MOVE_IDS.length,
  // Keep the runtime signature stable across the parent workspace, the
  // simulator workspace, and Docker-mounted package paths. Function
  // `toString()` output changes with the importer/bundler context, which
  // creates false client/server mismatch warnings even when both sides run the
  // same move set.
  hash: runtimeHash({
    dslVersion: DSL_VERSION,
    minSupportedDslVersion: MIN_SUPPORTED_DSL_VERSION,
    moves: MOVE_IDS,
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
