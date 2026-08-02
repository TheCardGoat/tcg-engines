import { CARDS } from "@tcg-engines/naruto-cards";
import { LOG_KEYS, OFFICIAL_RULES, PROVISIONAL_RULES } from "@tcg-engines/naruto-engine";
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

const engineHash = runtimeHash({
  actionTypes: ACTION_TYPES,
  logKeys: LOG_KEYS,
  official: OFFICIAL_RULES,
  provisional: PROVISIONAL_RULES,
});

const cardsHash = runtimeHash({
  cardCount: CARDS.length,
  cardIds: CARDS.map((card) => card.id),
});

export const NARUTO_RUNTIME_FINGERPRINT: GameRuntimeFingerprint = {
  game: "naruto",
  runtimeHash: `${engineHash}.${cardsHash}`,
  engine: {
    packageName: "@tcg-engines/naruto-engine",
    hash: engineHash,
    metadata: {
      actionCount: ACTION_TYPES.length,
      deckSize: OFFICIAL_RULES.deckSize,
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
