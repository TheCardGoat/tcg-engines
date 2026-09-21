import { allCards } from "@tcg/alpha-clash-cards";
import type { AcCardDefinition } from "@tcg/alpha-clash-types";
import type {
  CardSummary,
  CardsMaps,
  DeckBuildInput,
  DeckCard,
  DeckFormatResult,
  GameAdapter,
} from "@tcg/shared/game-adapter";
import {
  alphaClashCreateServerEngine,
  alphaClashExtractCardsMapsFromSnapshot,
  alphaClashRestoreEngine,
  alphaClashSerializeEngine,
  ALPHA_CLASH_CONTENDER_SECTION_ID,
  ALPHA_CLASH_MAIN_SECTION_ID,
} from "./alpha-clash-engine-lifecycle";

const cardByAnyId: ReadonlyMap<string, AcCardDefinition> = (() => {
  const map = new Map<string, AcCardDefinition>();
  for (const card of allCards()) {
    map.set(card.id, card);
  }
  return map;
})();

function lookup(publicId: string): AcCardDefinition | undefined {
  return cardByAnyId.get(publicId);
}

export const alphaClashServerAdapter: GameAdapter = {
  slug: "alpha-clash",

  createGameId(): string {
    return `alpha-clash-game-${crypto.randomUUID()}`;
  },

  generateUserName(gameProfileId: string): string {
    return `clasher-${gameProfileId.slice(0, 6)}`;
  },

  buildCardInstances(decks: ReadonlyArray<DeckBuildInput>): CardsMaps {
    const cardInstances: Record<string, string> = {};
    const owners: Record<string, string[]> = {};
    const instanceSections: Record<string, string> = {};
    let hasSections = false;
    for (const { owner, deck } of decks) {
      const ownerInstances: string[] = [];
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
        }
      }
      owners[owner] = ownerInstances;
    }
    return hasSections ? { cardInstances, owners, instanceSections } : { cardInstances, owners };
  },

  getCardById(publicId: string): CardSummary | null {
    const card = lookup(publicId);
    return card
      ? {
          publicId,
          colors: [...card.colors],
          label: card.name,
        }
      : null;
  },

  validateDeckForFormat(formatId: string, deck: ReadonlyArray<DeckCard>): DeckFormatResult {
    // Constructed deck rules (100.2a (v8.0): 50-60, 100.4a, 306.4, 704.15)
    // mirror the engine's createInitialState validation so illegal decks are
    // rejected before a match is created.
    const rules: DeckFormatResult["rules"] = [];
    const contenders = deck.filter(
      (entry) =>
        lookup(entry.cardId)?.cardType === "contender" ||
        entry.sectionId === ALPHA_CLASH_CONTENDER_SECTION_ID,
    );
    const mainDeck = deck.filter((entry) => !contenders.includes(entry));
    const mainCount = mainDeck.reduce((sum, entry) => sum + Math.max(0, entry.quantity), 0);

    const sizeOk = mainCount >= 50 && mainCount <= 60;
    rules.push({
      kind: "main-deck-size",
      passed: sizeOk,
      message: sizeOk
        ? `Main Deck contains ${mainCount} cards.`
        : `Main Deck must contain 50-60 cards (rule 100.2a); got ${mainCount}.`,
    });

    const contenderCount = contenders.reduce((sum, entry) => sum + Math.max(0, entry.quantity), 0);
    rules.push({
      kind: "single-contender",
      passed: contenderCount === 1,
      message:
        contenderCount === 1
          ? "Deck names exactly one Contender."
          : `Deck must name exactly one Contender (rule 100.2a); got ${contenderCount}.`,
    });

    const nameCounts = new Map<string, number>();
    let clashBuffs = 0;
    let unrivaled = 0;
    for (const entry of mainDeck) {
      const card = lookup(entry.cardId);
      if (!card) {
        rules.push({
          kind: "known-cards",
          passed: false,
          message: `Unknown card id: ${entry.cardId}.`,
        });
        continue;
      }
      nameCounts.set(card.name, (nameCounts.get(card.name) ?? 0) + entry.quantity);
      if (card.cardType === "action" && card.subtype === "clash-buff") {
        clashBuffs += entry.quantity;
      }
      if (card.cardType === "clash" && card.keywords?.includes("unrivaled")) {
        unrivaled += entry.quantity;
      }
    }
    for (const [name, count] of nameCounts) {
      rules.push({
        kind: "copy-limit",
        passed: count <= 4,
        message:
          count <= 4
            ? `${name}: ${count} copy/copies.`
            : `Deck may contain at most 4 copies of "${name}" (rule 100.4a); got ${count}.`,
      });
    }
    rules.push({
      kind: "clash-buff-limit",
      passed: clashBuffs <= 4,
      message:
        clashBuffs <= 4
          ? `Clash Buff count is ${clashBuffs}.`
          : `Deck may contain at most 4 Clash Buffs (rule 306.4); got ${clashBuffs}.`,
    });
    rules.push({
      kind: "unrivaled-limit",
      passed: unrivaled <= 1,
      message:
        unrivaled <= 1
          ? `Unrivaled count is ${unrivaled}.`
          : `Deck may contain at most 1 Unrivaled card (rule 704.15); got ${unrivaled}.`,
    });

    return {
      formatId,
      label: "Alpha Clash Constructed",
      valid: rules.every((rule) => rule.passed),
      rules,
    };
  },

  practiceDecks: {
    ids: ["starter-titan", "starter-warden"],
    getDeck(id: string): readonly DeckCard[] | undefined {
      // "<presetId>@<seed>" returns the same 50-card pool in a deterministic
      // seeded order, so practice matches can differ game to game while the
      // deck stays legal.
      const at = id.indexOf("@");
      const baseId = at === -1 ? id : id.slice(0, at);
      const deck = buildPracticeDeck(baseId);
      if (!deck || at === -1) return deck;
      const seed = Number.parseInt(id.slice(at + 1), 10);
      if (!Number.isFinite(seed)) return deck;
      return seededShuffle(deck, seed >>> 0);
    },
  },

  createServerEngine: alphaClashCreateServerEngine,
  serializeEngine: alphaClashSerializeEngine,
  restoreEngine: alphaClashRestoreEngine,
  extractCardsMapsFromSnapshot: alphaClashExtractCardsMapsFromSnapshot,
};

/**
 * The official catalog's 91 Contender records are still unauthored printed
 * data (AC-002 backlog), so practice decks use the two fully-authored
 * preview-fixture Contenders (original mechanics-coverage cards, playable
 * under the engine's real rules).
 */
const PRACTICE_CONTENDERS: Readonly<Record<string, readonly string[]>> = {
  "starter-titan": ["acx-contender-titan"],
  "starter-warden": ["acx-contender-warden"],
};

/**
 * Deterministic 50-card constructed decks assembled from the official
 * catalog: a named Contender plus up-to-4-copy playsets of color-matching
 * cards in catalog order (respecting the Clash Buff and Unrivaled limits).
 */
function buildPracticeDeck(presetId: string): readonly DeckCard[] | undefined {
  const contenderIds = PRACTICE_CONTENDERS[presetId];
  const contender = contenderIds?.length === 1 ? lookup(contenderIds[0]) : undefined;
  if (!contender) return undefined;

  const pool = allCards().filter(
    (card) =>
      card.id !== contender.id &&
      card.cardType !== "contender" &&
      card.colors.some((color) => contender.colors.includes(color)),
  );
  const entries: DeckCard[] = [
    { cardId: contender.id, sectionId: ALPHA_CLASH_CONTENDER_SECTION_ID, quantity: 1 },
  ];
  let total = 0;
  let clashBuffs = 0;
  let unrivaled = 0;
  for (const card of pool) {
    if (total >= 50) break;
    let quantity = 4;
    const isBuff = card.cardType === "action" && card.subtype === "clash-buff";
    const isUnrivaled = card.cardType === "clash" && card.keywords?.includes("unrivaled") === true;
    if (isUnrivaled && unrivaled >= 1) continue;
    // Unrivaled is one copy per deck (rule 704.15).
    if (isUnrivaled) quantity = 1;
    if (isBuff && clashBuffs > 0) quantity = Math.min(quantity, 4 - clashBuffs);
    const remaining = 50 - total;
    quantity = Math.min(quantity, remaining);
    if (quantity <= 0) continue;
    entries.push({ cardId: card.id, sectionId: ALPHA_CLASH_MAIN_SECTION_ID, quantity });
    total += quantity;
    if (isBuff) clashBuffs += quantity;
    if (isUnrivaled) unrivaled += 1;
  }
  if (total !== 50) return undefined;
  return entries;
}

/** Deterministic mulberry32 shuffle that keeps the Contender at index 0. */
function seededShuffle(deck: readonly DeckCard[], seed: number): readonly DeckCard[] {
  const entries = [...deck];
  let state = seed || 1;
  const next = () => {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  for (let i = entries.length - 1 - 1; i >= 1; i--) {
    const j = 1 + Math.floor(next() * i);
    [entries[i], entries[j]] = [entries[j]!, entries[i]!];
  }
  return entries;
}
