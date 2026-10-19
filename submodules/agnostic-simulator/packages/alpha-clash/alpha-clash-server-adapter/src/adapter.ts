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
import { hostedUndoProposalPolicy } from "@tcg/shared/game-adapter";
import { AC_JUDGE_MOVE_IDS, validateDeck } from "@tcg/alpha-clash-engine";
import { alphaClashPracticeDecks, getAlphaClashMetaPracticeDeck } from "./practice";
import { alphaClashReleaseDeckIssue } from "./release-policy";
import {
  alphaClashCreateServerEngine,
  alphaClashExtractCardsMapsFromSnapshot,
  alphaClashRestoreEngine,
  alphaClashSerializeEngine,
  ALPHA_CLASH_CONTENDER_SECTION_ID,
  ALPHA_CLASH_SIDEBOARD_SECTION_ID,
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
  persistBeforeReply: true,
  proposalPolicy: hostedUndoProposalPolicy,
  correctionModePolicy: { moveTypes: AC_JUDGE_MOVE_IDS, pauseNormalPlay: true },

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
      let total = 0;
      for (const entry of deck) {
        if (!Number.isSafeInteger(entry.qty) || entry.qty < 1 || (total += entry.qty) > 76) {
          throw new Error(
            "Alpha Clash decks require positive whole quantities and at most 76 cards including Contender and sideboard.",
          );
        }
      }
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
    // apply alongside the curated release gate, including casual/practice creation.
    const rules: DeckFormatResult["rules"] = [];
    // Reject malformed counts before native validation expands entries into cards.
    const quantitiesValid =
      deck.every((entry) => Number.isSafeInteger(entry.quantity) && entry.quantity > 0) &&
      deck.reduce((total, entry) => total + entry.quantity, 0) <= 76;
    rules.push({
      kind: "card-quantities",
      passed: quantitiesValid,
      message: quantitiesValid
        ? "Card quantities are valid."
        : "Decks require positive whole quantities and at most 76 cards including Contender and sideboard.",
    });
    const sideboard = deck.filter((entry) => entry.sectionId === ALPHA_CLASH_SIDEBOARD_SECTION_ID);
    const contenders = deck.filter(
      (entry) =>
        !sideboard.includes(entry) &&
        (lookup(entry.cardId)?.cardType === "contender" ||
          entry.sectionId === ALPHA_CLASH_CONTENDER_SECTION_ID),
    );
    const mainDeck = deck.filter(
      (entry) => !contenders.includes(entry) && !sideboard.includes(entry),
    );
    const mainCount = mainDeck.reduce((sum, entry) => sum + Math.max(0, entry.quantity), 0);
    const sideCount = sideboard.reduce((sum, entry) => sum + Math.max(0, entry.quantity), 0);
    rules.push({
      kind: "sideboard-size",
      passed: sideCount <= 15,
      message:
        sideCount <= 15
          ? `Sideboard contains ${sideCount} cards.`
          : `Sideboard may contain at most 15 cards (rule 100.4a); got ${sideCount}.`,
    });

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
    const contender = contenders.length === 1 ? lookup(contenders[0]!.cardId) : undefined;
    rules.push({
      kind: "contender-card-type",
      passed: contender?.cardType === "contender",
      message:
        contender?.cardType === "contender"
          ? "The declared Contender is a known Contender card."
          : "The declared Contender must be a known Contender card.",
    });

    const nameCounts = new Map<string, number>();
    let clashBuffs = 0;
    let unrivaled = 0;
    for (const entry of [...mainDeck, ...sideboard]) {
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

    if (rules.every((rule) => rule.passed)) {
      const error = validateDeck({
        contenderId: contenders[0]!.cardId,
        deckIds: mainDeck.flatMap((entry) =>
          Array.from({ length: entry.quantity }, () => entry.cardId),
        ),
        sideboardIds: sideboard.flatMap((entry) =>
          Array.from({ length: entry.quantity }, () => entry.cardId),
        ),
      });
      rules.push({
        kind: "native-deck-construction",
        passed: error === null,
        message: error ?? "Deck satisfies native construction rules.",
      });
    }

    const releaseIssue = alphaClashReleaseDeckIssue(deck);
    rules.push({
      kind: "audited-curated-deck",
      passed: !releaseIssue,
      message: releaseIssue ?? "Deck matches an audited curated release list.",
    });
    return {
      formatId,
      label: "Alpha Clash Curated Practice",
      valid: rules.every((rule) => rule.passed),
      rules,
    };
  },

  practiceDecks: {
    ids: alphaClashPracticeDecks.map((deck) => deck.id),
    getDeck(id: string): readonly DeckCard[] | undefined {
      // "<presetId>@<seed>" returns the same 50-card pool in a deterministic
      // seeded order, so practice matches can differ game to game while the
      // deck stays legal.
      const at = id.indexOf("@");
      const baseId = at === -1 ? id : id.slice(0, at);
      const deck = getAlphaClashMetaPracticeDeck(baseId);
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
