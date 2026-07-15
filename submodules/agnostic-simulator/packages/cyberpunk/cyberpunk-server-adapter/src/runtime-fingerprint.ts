import { CYBERPUNK_CARDS_RUNTIME } from "@tcg/cyberpunk-cards";
import { MOVE_IDS } from "@tcg/cyberpunk-engine";
import { DSL_VERSION, MIN_SUPPORTED_DSL_VERSION } from "@tcg/cyberpunk-types";
import type { GameRuntimeFingerprint } from "@tcg/shared/game-adapter";

const engineHash = runtimeHash({
  dslVersion: DSL_VERSION,
  minSupportedDslVersion: MIN_SUPPORTED_DSL_VERSION,
  moves: MOVE_IDS,
});

export const CYBERPUNK_RUNTIME_FINGERPRINT: GameRuntimeFingerprint = {
  game: "cyberpunk",
  runtimeHash: `${engineHash}.${CYBERPUNK_CARDS_RUNTIME.hash}`,
  engine: {
    packageName: "@tcg/cyberpunk-engine",
    hash: engineHash,
    metadata: {
      dslVersion: DSL_VERSION,
      minSupportedDslVersion: MIN_SUPPORTED_DSL_VERSION,
      moveCount: MOVE_IDS.length,
    },
  },
  cards: {
    packageName: CYBERPUNK_CARDS_RUNTIME.packageName,
    hash: CYBERPUNK_CARDS_RUNTIME.hash,
    metadata: {
      cardCount: CYBERPUNK_CARDS_RUNTIME.cardCount,
      dslVersion: CYBERPUNK_CARDS_RUNTIME.dslVersion,
    },
  },
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
