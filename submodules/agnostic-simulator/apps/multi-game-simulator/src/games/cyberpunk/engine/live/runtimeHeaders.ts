import { CYBERPUNK_CARDS_RUNTIME } from "@tcg/cyberpunk-cards";
import { MOVE_IDS } from "@tcg/cyberpunk-engine";
import { DSL_VERSION, MIN_SUPPORTED_DSL_VERSION } from "@tcg/cyberpunk-types";

export const CYBERPUNK_ENGINE_RUNTIME_HASH = runtimeHash({
  dslVersion: DSL_VERSION,
  minSupportedDslVersion: MIN_SUPPORTED_DSL_VERSION,
  moves: MOVE_IDS,
});

export const CYBERPUNK_CLIENT_RUNTIME_HASH = `${CYBERPUNK_ENGINE_RUNTIME_HASH}.${CYBERPUNK_CARDS_RUNTIME.hash}`;

export function cyberpunkRuntimeRequestHeaders(): Record<string, string> {
  return {
    "x-tcg-client-runtime": CYBERPUNK_CLIENT_RUNTIME_HASH,
    "x-tcg-client-engine-runtime": CYBERPUNK_ENGINE_RUNTIME_HASH,
    "x-tcg-client-cards-runtime": CYBERPUNK_CARDS_RUNTIME.hash,
  };
}

export function readServerRuntimeHeaders(response: Response): {
  runtime: string | null;
  engine: string | null;
  cards: string | null;
} {
  return {
    runtime: response.headers.get("x-tcg-runtime"),
    engine: response.headers.get("x-tcg-engine-runtime"),
    cards: response.headers.get("x-tcg-cards-runtime"),
  };
}

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
