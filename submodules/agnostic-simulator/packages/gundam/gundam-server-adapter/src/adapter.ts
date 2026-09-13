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
  buildColorMetadataFacets,
  normalizeMetadataColors,
  sortMetadataFacets,
} from "@tcg/shared/game-adapter";
import {
  gundamCreateServerEngine,
  gundamExtractCardsMapsFromSnapshot,
  gundamRestoreEngine,
  gundamSerializeEngine,
  remintGundamPresentation,
} from "./gundam-engine-lifecycle.js";
import { gundamDeckInterchangeAdapter } from "./gundam-deck-document.js";
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
    const instanceSections: Record<string, string> = {};
    const printingIdByInstanceId: Record<string, string> = {};
    let hasSections = false;
    let hasPresentation = false;
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
          if (entry.sectionId) {
            instanceSections[instanceId] = entry.sectionId;
            hasSections = true;
          }
          if (entry.printingId) {
            printingIdByInstanceId[instanceId] = entry.printingId;
            hasPresentation = true;
          }
        }
      }
      owners[owner] = ownerInstances;
    }
    const maps: CardsMaps = {
      cardInstances,
      owners,
      ...(hasSections ? { instanceSections } : {}),
      ...(hasPresentation ? { presentation: { printingIdByInstanceId } } : {}),
    };
    if (hasPresentation) {
      maps.presentation = remintGundamPresentation(maps);
    }
    return maps;
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
            label:
              "displayName" in c && typeof c.displayName === "string" ? c.displayName : undefined,
            imageUrl: "imageUrl" in c && typeof c.imageUrl === "string" ? c.imageUrl : undefined,
          };
        }
      }
      return null;
    }
    return {
      publicId,
      colors: Array.isArray(card.color) ? card.color : card.color ? [card.color] : [],
      label:
        "displayName" in card && typeof card.displayName === "string"
          ? card.displayName
          : undefined,
      imageUrl: "imageUrl" in card && typeof card.imageUrl === "string" ? card.imageUrl : undefined,
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
    if (formatId !== "standard" && formatId !== "bo3") {
      throw new Error(`Unknown Gundam format: ${formatId}`);
    }

    const sectionRules = validateDeckSections(formatId, deck);
    // BO3 sideboard entries share the card pool, token, copy-limit, and
    // color rules with the main deck. `validateStandardDeck` keeps the three
    // section sizes distinct while applying those per-card checks to the
    // complete construction deck.
    const rules = [...sectionRules, ...validateStandardDeck(deck)];
    if (formatId === "bo3") {
      const sideboardCount = deck
        .filter((entry) => entry.sectionId === "side")
        .reduce((sum, entry) => sum + entry.quantity, 0);
      rules.push({
        kind: "sideboard-size",
        passed: sideboardCount === 10,
        message: `Sideboard has ${sideboardCount}/10 cards`,
        details: { count: sideboardCount, expected: 10 },
      });
    }

    return {
      formatId,
      label: formatId === "bo3" ? "Best of Three" : "Standard",
      valid: rules.every((rule) => rule.passed),
      rules,
    };
  },

  deckInterchange: gundamDeckInterchangeAdapter,

  metadata: {
    projectionVersion: 1,
    capabilities: { colors: true, deckLists: true, archetypes: true },
    facets: [
      {
        type: "color",
        label: "Deck color",
        pluralLabel: "Deck colors",
        kind: "individual",
        order: 10,
        ranking: { specialistSkill: true, mastery: true },
      },
      {
        type: "color-combination",
        label: "Deck color combination",
        pluralLabel: "Deck color combinations",
        kind: "combination",
        order: 20,
        ranking: { specialistSkill: true, mastery: true },
      },
    ],
    projectDeck(deck) {
      const colors = normalizeMetadataColors(
        deck.flatMap((entry) => {
          const card = getGundamCardDefinition(entry.cardId);
          return card?.type === "resource" || !card?.color ? [] : [card.color];
        }),
      );
      return {
        schemaVersion: 1,
        projectionVersion: 1,
        game: "gundam",
        cardCount: deck.reduce((sum, entry) => sum + Math.max(0, Math.floor(entry.quantity)), 0),
        colors,
        facets: sortMetadataFacets(buildColorMetadataFacets(colors)),
      };
    },
    normalizeTemplate(deck) {
      return deck
        .flatMap((entry) => {
          const card = getGundamCardDefinition(entry.cardId);
          if (!card || card.type === "resource") return [];
          if (entry.quantity >= 4) return [{ ...entry, quantity: 4 }];
          if (entry.quantity >= 2) return [{ ...entry, quantity: 2 }];
          return [];
        })
        .sort((left, right) => left.cardId.localeCompare(right.cardId));
    },
    normalizeSynergy(deck) {
      return deck
        .filter((entry) => {
          const card = getGundamCardDefinition(entry.cardId);
          return card?.type !== "resource" && entry.quantity > 1;
        })
        .map((entry) => ({ ...entry, quantity: 1 }))
        .sort((left, right) => left.cardId.localeCompare(right.cardId));
    },
  },

  createServerEngine: gundamCreateServerEngine,
  serializeEngine: gundamSerializeEngine,
  restoreEngine: gundamRestoreEngine,
  extractCardsMapsFromSnapshot: gundamExtractCardsMapsFromSnapshot,
};

function validateDeckSections(
  formatId: "standard" | "bo3",
  deck: ReadonlyArray<DeckCard>,
): DeckFormatResult["rules"] {
  const misplaced: DeckCard[] = [];
  const unsupported: DeckCard[] = [];

  for (const entry of deck) {
    const canonicalId =
      entry.canonicalId ??
      (entry.printingId ? getGundamCanonicalForCardId(entry.printingId) : null) ??
      getGundamCanonicalForCardId(entry.cardId) ??
      entry.cardId;
    const card = getGundamCardDefinition(canonicalId);
    if (!card) continue;
    const sectionId = entry.sectionId ?? (card.type === "resource" ? "resource" : "main");
    if (sectionId !== "main" && sectionId !== "resource" && sectionId !== "side") {
      unsupported.push(entry);
    } else if (
      (sectionId === "resource" && card.type !== "resource") ||
      (sectionId !== "resource" && card.type === "resource")
    ) {
      misplaced.push(entry);
    } else if (formatId === "standard" && sectionId === "side") {
      unsupported.push(entry);
    }
  }

  return [
    {
      kind: "deck-sections",
      passed: misplaced.length === 0 && unsupported.length === 0,
      message:
        misplaced.length === 0 && unsupported.length === 0
          ? "Cards are in valid Gundam deck sections"
          : "Cards must be in their matching Gundam deck sections",
      details: { misplaced, unsupported },
    },
  ];
}

function validateStandardDeck(deck: ReadonlyArray<DeckCard>): DeckFormatResult["rules"] {
  const rules: DeckFormatResult["rules"] = [];
  const nonResourceCounts = new Map<string, number>();
  const mainDeckColors = new Set<string>();
  const unknownEntries: DeckCard[] = [];
  const malformedEntries = deck.filter(
    (entry) => !Number.isInteger(entry.quantity) || entry.quantity <= 0,
  );
  const tokenEntries: DeckCard[] = [];
  let mainCount = 0;
  let resourceCount = 0;

  for (const entry of deck) {
    if (!Number.isInteger(entry.quantity) || entry.quantity <= 0) {
      continue;
    }

    const canonicalId =
      entry.canonicalId ??
      (entry.printingId ? getGundamCanonicalForCardId(entry.printingId) : null) ??
      getGundamCanonicalForCardId(entry.cardId) ??
      entry.cardId;
    const card = getGundamCardDefinition(canonicalId);
    if (!card) {
      unknownEntries.push(entry);
      continue;
    }
    const sectionId = entry.sectionId ?? (card.type === "resource" ? "resource" : "main");
    if (isDeckListToken(card.cardNumber)) {
      tokenEntries.push(entry);
      continue;
    }
    if (card.type === "resource") {
      if (sectionId === "resource") resourceCount += entry.quantity;
      continue;
    }

    if (sectionId === "main") mainCount += entry.quantity;
    if (card.color) mainDeckColors.add(card.color);
    nonResourceCounts.set(
      card.canonicalId,
      (nonResourceCounts.get(card.canonicalId) ?? 0) + entry.quantity,
    );
  }

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
    if (value.id === publicId || value.cardNumber === publicId || value.canonicalId === publicId) {
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
