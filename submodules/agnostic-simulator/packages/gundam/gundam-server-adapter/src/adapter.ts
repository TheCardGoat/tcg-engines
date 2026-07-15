import * as gundamCards from "@tcg/gundam-cards";
import { getGundamCanonicalForCardId } from "@tcg/gundam-cards";
import {
  GUNDAM_MAIN_DECK_SIZE,
  GUNDAM_MAX_COPIES_PER_CARD,
  GUNDAM_MAX_DECK_COLORS,
  GUNDAM_RESOURCE_DECK_SIZE,
  isDeckListToken,
} from "@tcg/gundam-engine";
import type { Card } from "@tcg/gundam-types";
import type {
  CardSummary,
  CardsMaps,
  DeckBuildInput,
  DeckCard,
  DeckFormatResult,
  GameAdapter,
} from "@tcg/shared/game-adapter";
import {
  gundamCreateServerEngine,
  gundamExtractCardsMapsFromSnapshot,
  gundamRestoreEngine,
  gundamSerializeEngine,
} from "./gundam-engine-lifecycle.js";
import { GUNDAM_RUNTIME_FINGERPRINT } from "./runtime-fingerprint.js";

/**
 * Server-side {@link GameAdapter} for Bandai Gundam Card Game. Mirrors the
 * Lorcana / Cyberpunk shape so the play module stays game-agnostic.
 *
 * The shared play module gives adapters a single flat deck list, so this
 * adapter classifies entries by card type and validates the current Gundam
 * construction rules: 50-card main deck, 10-card resource deck, and max 4
 * copies of any non-resource card number.
 */
export const gundamServerAdapter: GameAdapter = {
  slug: "gundam",

  createGameId(): string {
    return `gundam-game-${crypto.randomUUID()}`;
  },

  generateUserName(gameProfileId: string): string {
    return `pilot-${gameProfileId.slice(0, 6)}`;
  },

  buildCardInstances(decks: ReadonlyArray<DeckBuildInput>): CardsMaps {
    const cardInstances: Record<string, string> = {};
    const owners: Record<string, string[]> = {};
    for (const { owner, deck } of decks) {
      const ownerInstances: string[] = [];
      // Per-owner monotonic counter so duplicate cardId rows in the same
      // DeckBuildInput don't collide on `${owner}-${cardId}-${i}`.
      let counter = 0;
      for (const entry of deck) {
        for (let i = 0; i < entry.qty; i++) {
          const instanceId = `${owner}-${entry.cardId}-${counter++}`;
          cardInstances[instanceId] = entry.cardId;
          ownerInstances.push(instanceId);
        }
      }
      owners[owner] = ownerInstances;
    }
    return { cardInstances, owners };
  },

  getCardById(publicId: string): CardSummary | null {
    const card = (gundamCards as Record<string, unknown>)[publicId] as
      | { color?: string | string[] }
      | undefined;
    if (!card) {
      // Walk the catalog by id/cardNumber as a fallback for ids that aren't
      // the exported binding name.
      for (const value of Object.values(gundamCards)) {
        if (!value || typeof value !== "object") continue;
        const c = value as { id?: string; cardNumber?: string; color?: string | string[] };
        if (c.id === publicId || c.cardNumber === publicId) {
          return {
            publicId,
            colors: Array.isArray(c.color) ? c.color : c.color ? [c.color] : [],
          };
        }
      }
      return null;
    }
    return {
      publicId,
      colors: Array.isArray(card.color) ? card.color : card.color ? [card.color] : [],
    };
  },

  /**
   * Resolve any Gundam runtime public id to its canonical gameplay id. The
   * atelier helper resolves both `card.id` (which may carry a `_pN` parallel
   * suffix on the selected printing) and the bare `cardNumber` to the
   * canonical id, stripping any parallel-art suffix. Returns null for
   * truly-unknown ids so callers fall back to the raw publicId.
   */
  getCanonicalCardId(publicId: string): string | null {
    return getGundamCanonicalForCardId(publicId);
  },

  getRuntimeFingerprint() {
    return GUNDAM_RUNTIME_FINGERPRINT;
  },

  validateDeckForFormat(formatId: string, deck: ReadonlyArray<DeckCard>): DeckFormatResult {
    if (formatId !== "standard") {
      throw new Error(`Unknown Gundam format: ${formatId}`);
    }

    const rules = validateStandardDeck(deck);

    return {
      formatId,
      label: "Standard",
      valid: rules.every((rule) => rule.passed),
      rules,
    };
  },

  createServerEngine: gundamCreateServerEngine,
  serializeEngine: gundamSerializeEngine,
  restoreEngine: gundamRestoreEngine,
  extractCardsMapsFromSnapshot: gundamExtractCardsMapsFromSnapshot,
};

function validateStandardDeck(deck: ReadonlyArray<DeckCard>): DeckFormatResult["rules"] {
  const rules: DeckFormatResult["rules"] = [];
  const nonResourceCounts = new Map<string, number>();
  const mainDeckColors = new Set<string>();
  const unknownEntries: DeckCard[] = [];
  const malformedEntries = deck.filter(
    (entry) => !Number.isInteger(entry.quantity) || entry.quantity <= 0,
  );
  const tokenEntries: DeckCard[] = [];
  const nonResourceEntries: DeckCard[] = [];
  const resourceEntries: DeckCard[] = [];

  for (const entry of deck) {
    if (!Number.isInteger(entry.quantity) || entry.quantity <= 0) {
      continue;
    }

    const card = getGundamCardDefinition(entry.cardId);
    if (!card) {
      unknownEntries.push(entry);
      continue;
    }
    if (isDeckListToken(card.cardNumber)) {
      tokenEntries.push(entry);
      continue;
    }
    if (card.type === "resource") {
      resourceEntries.push(entry);
      continue;
    }

    nonResourceEntries.push(entry);
    if (card.color) mainDeckColors.add(card.color);
    nonResourceCounts.set(
      card.cardNumber,
      (nonResourceCounts.get(card.cardNumber) ?? 0) + entry.quantity,
    );
  }

  const mainCount = nonResourceEntries.reduce((sum, entry) => sum + entry.quantity, 0);
  const resourceCount = resourceEntries.reduce((sum, entry) => sum + entry.quantity, 0);

  rules.push({
    kind: "card-pool",
    passed: unknownEntries.length === 0,
    message:
      unknownEntries.length === 0
        ? "All cards are in the Gundam card pool"
        : `Unknown cards: ${unknownEntries.map((entry) => entry.cardId).join(", ")}`,
    details: unknownEntries,
  });
  rules.push({
    kind: "card-quantity",
    passed: malformedEntries.length === 0,
    message:
      malformedEntries.length === 0
        ? "All card quantities are positive integers"
        : `Invalid quantities: ${malformedEntries
            .map((entry) => `${entry.cardId} x${entry.quantity}`)
            .join(", ")}`,
    details: malformedEntries,
  });
  rules.push({
    kind: "tokens",
    passed: tokenEntries.length === 0,
    message:
      tokenEntries.length === 0
        ? "Deck does not contain engine-spawned tokens"
        : `Deck cannot contain engine-spawned tokens: ${tokenEntries
            .map((entry) => entry.cardId)
            .join(", ")}`,
    details: tokenEntries,
  });
  rules.push({
    kind: "main-deck-size",
    passed: mainCount === GUNDAM_MAIN_DECK_SIZE,
    message: `Main deck has ${mainCount}/${GUNDAM_MAIN_DECK_SIZE} non-resource cards`,
    details: { count: mainCount, expected: GUNDAM_MAIN_DECK_SIZE },
  });
  rules.push({
    kind: "resource-deck-size",
    passed: resourceCount === GUNDAM_RESOURCE_DECK_SIZE,
    message: `Resource deck has ${resourceCount}/${GUNDAM_RESOURCE_DECK_SIZE} resource cards`,
    details: { count: resourceCount, expected: GUNDAM_RESOURCE_DECK_SIZE },
  });
  rules.push({
    kind: "deck-colors",
    passed: mainDeckColors.size >= 1 && mainDeckColors.size <= GUNDAM_MAX_DECK_COLORS,
    message:
      mainDeckColors.size >= 1 && mainDeckColors.size <= GUNDAM_MAX_DECK_COLORS
        ? `Main deck uses ${mainDeckColors.size} color${mainDeckColors.size === 1 ? "" : "s"}`
        : `Main deck must use one or two colors (found ${mainDeckColors.size})`,
    details: { colors: [...mainDeckColors].sort() },
  });

  const overCopyLimit = [...nonResourceCounts].filter(
    ([, count]) => count > GUNDAM_MAX_COPIES_PER_CARD,
  );
  rules.push({
    kind: "copy-limit",
    passed: overCopyLimit.length === 0,
    message:
      overCopyLimit.length === 0
        ? `No non-resource card exceeds ${GUNDAM_MAX_COPIES_PER_CARD} copies`
        : `Copy limit exceeded: ${overCopyLimit
            .map(([cardNumber, count]) => `${cardNumber} x${count}`)
            .join(", ")}`,
    details: overCopyLimit.map(([cardNumber, count]) => ({ cardNumber, count })),
  });

  return rules;
}

function getGundamCardDefinition(publicId: string): Card | null {
  const direct = (gundamCards as Record<string, unknown>)[publicId];
  if (isGundamCard(direct)) return direct;

  for (const value of Object.values(gundamCards)) {
    if (!isGundamCard(value)) continue;
    if (value.id === publicId || value.cardNumber === publicId) {
      return value;
    }
  }
  return null;
}

function isGundamCard(value: unknown): value is Card {
  return (
    typeof value === "object" &&
    value !== null &&
    "cardNumber" in value &&
    typeof (value as { cardNumber: unknown }).cardNumber === "string" &&
    "type" in value &&
    typeof (value as { type: unknown }).type === "string"
  );
}
