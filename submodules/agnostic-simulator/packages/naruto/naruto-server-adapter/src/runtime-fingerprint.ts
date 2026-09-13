import { CARDS, type CardDefinition } from "@tcg-engines/naruto-cards";
import {
  CONFIRMED_STRUCTURAL_RULES,
  LOG_KEYS,
  NARUTO_PREVIEW_RULES_PROFILE,
  PROVISIONAL_RULES,
} from "@tcg-engines/naruto-engine";
import type { GameRuntimeFingerprint } from "@tcg/shared/game-adapter";

const ACTION_TYPES = [
  "MULLIGAN",
  "SUMMON",
  "SET_SUPPORT",
  "ACTIVATE_SUPPORT",
  "ACTIVATE_SUPPORT_FROM_HAND",
  "ACTIVATE_CHARACTER",
  "LEADER_EFFECT",
  "RECOVERY",
  "DECLARE_ATTACK",
  "PASS_COUNTER",
  "RESOLVE_CHOICE",
  "END_TURN",
] as const;

/** Package release currently linked into this adapter. */
export const NARUTO_ENGINE_PACKAGE_VERSION = "0.1.0";

/**
 * Semver identity for snapshot-level engine compatibility. This is advanced
 * deliberately when reducer semantics or snapshot interpretation change,
 * independently of the content hashes used for drift diagnostics.
 */
export const NARUTO_ENGINE_COMPATIBILITY_VERSION = "1.0.0-preview.1";

/** Human-auditable build family for the provisional 12-action runtime. */
export const NARUTO_ENGINE_BUILD_ID = "naruto-preview-v1-12-actions";

const engineHash = runtimeHash({
  actionTypes: ACTION_TYPES,
  logKeys: LOG_KEYS,
  confirmedStructuralRules: CONFIRMED_STRUCTURAL_RULES,
  rulesProfile: NARUTO_PREVIEW_RULES_PROFILE,
  provisional: PROVISIONAL_RULES,
});

/**
 * Hash the complete deterministic catalog, not merely its shape.  A snapshot
 * created before a correction to printed text, stats, support cost, or any
 * other definition field must not look compatible just because the card ids
 * and count stayed the same.
 */
export function narutoCardsRuntimeHash(cards: readonly CardDefinition[] = CARDS): string {
  return runtimeHash({ cards });
}

const cardsHash = narutoCardsRuntimeHash();

export const NARUTO_RUNTIME_FINGERPRINT: GameRuntimeFingerprint = {
  game: "naruto",
  runtimeHash: `${engineHash}.${cardsHash}`,
  engine: {
    packageName: "@tcg-engines/naruto-engine",
    version: NARUTO_ENGINE_PACKAGE_VERSION,
    hash: engineHash,
    metadata: {
      actionCount: ACTION_TYPES.length,
      buildId: NARUTO_ENGINE_BUILD_ID,
      compatibilityVersion: NARUTO_ENGINE_COMPATIBILITY_VERSION,
      mainDeckSize: PROVISIONAL_RULES.mainDeckSize,
      rulesProfile: NARUTO_PREVIEW_RULES_PROFILE.id,
    },
  },
  cards: {
    packageName: "@tcg-engines/naruto-cards",
    hash: cardsHash,
    metadata: {
      cardCount: CARDS.length,
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
