import {
  getAllCards,
  getCardById,
  type CardDefinition,
  type CardType,
} from "@tcg-engines/naruto-cards";
import {
  CONFIRMED_STRUCTURAL_RULES,
  PREVIEW_CHAKRA_CARD_IDS,
  PREVIEW_DECKS,
  PREVIEW_SUMMON_CARD_ID,
  PROVISIONAL_RULES,
  deckIssues,
  type DeckIssue,
  type DeckList,
} from "@tcg-engines/naruto-engine";
import type {
  CardSummary,
  CardsMaps,
  DeckBuildInput,
  DeckCard,
  DeckFormatResult,
  GameAdapter,
} from "@tcg/shared/game-adapter";

import {
  narutoCreateServerEngine,
  narutoExtractCardsMapsFromSnapshot,
  narutoRestoreEngine,
  narutoSerializeEngine,
} from "./engine";
import { NARUTO_RUNTIME_FINGERPRINT } from "./runtime-fingerprint";
import { narutoDeckInterchangeAdapter } from "./deck-interchange";

/** Public, presentation-safe catalog used by the platform's Preview builder. */
export interface NarutoDeckBuilderCard {
  readonly id: string;
  readonly number: string;
  readonly name: string;
  readonly type: CardType;
  readonly color: "red" | "blue" | "green" | "";
  readonly rarity: string;
  readonly traits: readonly string[];
  readonly damage: number | null;
  readonly power: number | null;
  readonly health: number | null;
  readonly imageUrl: string;
  /**
   * Concatenated card text (skill labels + skill text + support name/text)
   * so catalog surfaces can offer full-text search. Not rendered directly.
   */
  readonly searchText: string;
}

export interface NarutoDeckBuilderCatalog {
  readonly rulesProfile: "naruto-preview-v1";
  readonly status: "provisional";
  readonly cards: readonly NarutoDeckBuilderCard[];
  readonly templates: readonly NarutoDeckBuilderTemplate[];
  readonly setup: NarutoDeckBuilderSetup;
  readonly rules: {
    readonly confirmed: typeof CONFIRMED_STRUCTURAL_RULES;
    readonly provisional: typeof PROVISIONAL_RULES;
  };
}

export interface NarutoDeckBuilderTemplate {
  readonly key: string;
  readonly leaderId: string;
  readonly main: Readonly<Record<string, number>>;
  readonly chakraArtId: string;
  readonly summonArtId: string;
}

export interface NarutoDeckBuilderSetup {
  readonly chakraCount: number;
  readonly summonCount: number;
  readonly defaultChakraArtId: string;
  readonly defaultSummonArtId: string;
  readonly chakraArtIds: readonly string[];
  readonly summonArtIds: readonly string[];
}

const NARUTO_CARD_CDN_BASE = "https://cdn.tcg.online/public/naruto/cards";

/** Card text (skill labels + text + support) for full-text search surfaces. */
function narutoCardSearchText(card: CardDefinition): string {
  const parts: string[] = [];
  for (const skill of card.skills) {
    parts.push(...skill.labels, skill.text);
  }
  if (card.support) {
    parts.push(card.support.name, card.support.text, card.support.timing);
  }
  return parts.filter(Boolean).join(" ");
}

export function getNarutoDeckBuilderCatalog(): NarutoDeckBuilderCatalog {
  const cards = getAllCards();
  return {
    rulesProfile: "naruto-preview-v1",
    status: "provisional",
    cards: cards.map((card) => ({
      id: card.id,
      number: card.number,
      name: card.nameEn,
      type: card.cardType,
      color: card.color,
      rarity: card.rarity,
      traits: card.traits,
      damage: card.damage,
      power: card.power,
      health: card.health,
      imageUrl: `${NARUTO_CARD_CDN_BASE}/${encodeURIComponent(card.id)}.webp`,
      searchText: narutoCardSearchText(card),
    })),
    templates: PREVIEW_DECKS.map((deck) => ({
      key: deck.key,
      leaderId: deck.leaderId,
      main: deck.counts,
      chakraArtId: deck.chakraCardIds[0] ?? PREVIEW_CHAKRA_CARD_IDS[0],
      summonArtId: deck.summonCardId,
    })),
    setup: {
      chakraCount: CONFIRMED_STRUCTURAL_RULES.chakraCount,
      summonCount: CONFIRMED_STRUCTURAL_RULES.summonCount,
      defaultChakraArtId: PREVIEW_CHAKRA_CARD_IDS[0],
      defaultSummonArtId: PREVIEW_SUMMON_CARD_ID,
      chakraArtIds: cards.filter((card) => card.cardType === "chakra").map((card) => card.id),
      summonArtIds: cards.filter((card) => card.cardType === "summon").map((card) => card.id),
    },
    rules: {
      confirmed: CONFIRMED_STRUCTURAL_RULES,
      provisional: PROVISIONAL_RULES,
    },
  };
}

const DECK_ISSUE_MESSAGES: Record<DeckIssue, string> = {
  noLeader: "Deck must include a leader",
  unknownLeader: "Leader is unknown or not a leader card",
  wrongSize: `Main deck must contain exactly ${PROVISIONAL_RULES.mainDeckSize} cards`,
  notACharacter: "Main deck may only contain character and EX character cards",
  wrongColor: "All cards must match the leader's color",
  tooManyCopies: `No more than ${PROVISIONAL_RULES.maxCopiesPerCard ?? "unlimited"} copies of any card`,
  wrongChakraCount: `Deck must include exactly ${CONFIRMED_STRUCTURAL_RULES.chakraCount} Chakra cards`,
  unknownChakra: "A Chakra card is unknown",
  notAChakra: "Chakra slots may only contain Chakra cards",
  noSummon: `Deck must include exactly ${CONFIRMED_STRUCTURAL_RULES.summonCount} Summon card`,
  unknownSummon: "The Summon card is unknown",
  notASummon: "The Summon slot may only contain a Summon card",
};

/**
 * Server-side {@link GameAdapter} for Naruto. Wraps
 * `@tcg-engines/naruto-engine` (pure 12-action reducer) so the play module
 * never touches game internals.
 *
 * Format validation supports the provisional preview profile: 1 Leader + a
 * 50-card main deck of same-color Characters/EX Characters, max 4 copies per card,
 * five Chakra cards, and one Summon card. Client-side format validation is
 * guidance only; `narutoCreateServerEngine` repeats legality checks against
 * its trusted instance map before it creates engine state.
 */
export const narutoServerAdapter: GameAdapter = {
  slug: "naruto",
  deckInterchange: narutoDeckInterchangeAdapter,

  createGameId(): string {
    return `naruto-game-${crypto.randomUUID()}`;
  },

  generateUserName(gameProfileId: string): string {
    // Deterministic short suffix so practice/offline names are stable.
    return `ninja-${gameProfileId.slice(0, 6)}`;
  },

  buildCardInstances(decks: ReadonlyArray<DeckBuildInput>): CardsMaps {
    const cardInstances: Record<string, string> = {};
    const owners: Record<string, string[]> = {};
    const instanceSections: Record<string, string> = {};
    let hasSections = false;
    for (const { owner, deck } of decks) {
      const ownerInstances: string[] = [];
      // Per-owner monotonic counter so duplicate cardId rows can't collide.
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
    const card = getCardById(publicId);
    if (!card) return null;
    return {
      publicId,
      colors: card.color ? [card.color] : [],
      label: card.nameEn,
    };
  },

  getCanonicalCardId(publicId: string): string | null {
    // The current catalog is an unverified preview snapshot. Its local ids are
    // useful for this isolated runtime, but no external/cross-printing
    // canonical identity has been established yet.
    void publicId;
    return null;
  },

  getRuntimeFingerprint() {
    return NARUTO_RUNTIME_FINGERPRINT;
  },

  matchmakingIdentity: {
    getDeckIdentity(deck) {
      const leaderId = deckListFromDeckCards(deck).leaderIds[0];
      const leader = leaderId ? getCardById(leaderId) : null;
      return leader
        ? {
            id: leader.id,
            label: leader.nameEn,
            imageUrl: `${NARUTO_CARD_CDN_BASE}/${encodeURIComponent(leader.id)}.webp`,
          }
        : null;
    },
    listOpponentIdentities(formatId) {
      if (formatId !== "preview") return [];
      return getAllCards()
        .filter((card) => card.cardType === "leader")
        .map((card) => ({
          id: card.id,
          label: card.nameEn,
          imageUrl: `${NARUTO_CARD_CDN_BASE}/${encodeURIComponent(card.id)}.webp`,
        }));
    },
  },

  validateDeckForFormat(formatId: string, deck: ReadonlyArray<DeckCard>): DeckFormatResult {
    if (formatId !== "preview") {
      throw new Error(`Unknown Naruto format: ${formatId}`);
    }

    const parsed = deckListFromDeckCards(deck);
    const issues = deckIssues(parsed.deckList);

    const rules = [
      {
        kind: "card-pool",
        passed: parsed.unknownEntries.length === 0,
        message:
          parsed.unknownEntries.length === 0
            ? "All cards are part of the Naruto card pool"
            : `Unknown cards: ${parsed.unknownEntries.map((entry) => entry.cardId).join(", ")}`,
        details:
          parsed.unknownEntries.length === 0
            ? undefined
            : { cardIds: parsed.unknownEntries.map((entry) => entry.cardId) },
      },
      {
        kind: "card-quantity",
        passed: parsed.malformedEntries.length === 0,
        message:
          parsed.malformedEntries.length === 0
            ? "All card quantities are positive integers"
            : `Invalid quantities: ${parsed.malformedEntries
                .map((entry) => `${entry.cardId} x${entry.quantity}`)
                .join(", ")}`,
        details: parsed.malformedEntries,
      },
      {
        kind: "deck-sections",
        passed: parsed.misplacedEntries.length === 0 && parsed.unsupportedEntries.length === 0,
        message:
          parsed.misplacedEntries.length === 0 && parsed.unsupportedEntries.length === 0
            ? "Cards are in valid Naruto deck sections"
            : "Cards must be in their matching Naruto deck sections",
        details: {
          misplaced: parsed.misplacedEntries,
          unsupported: parsed.unsupportedEntries,
        },
      },
      {
        kind: "leader-count",
        passed: parsed.leaderIds.length === 1,
        message:
          parsed.leaderIds.length === 1
            ? "Deck has exactly one leader"
            : "Deck must include exactly one leader card",
      },
      {
        kind: "summon-count",
        passed: parsed.summonIds.length === CONFIRMED_STRUCTURAL_RULES.summonCount,
        message:
          parsed.summonIds.length === CONFIRMED_STRUCTURAL_RULES.summonCount
            ? "Deck has exactly one Summon card"
            : "Deck must include exactly one Summon card",
      },
      ...issues.map((issue) => ({
        kind: issue,
        passed: false,
        message: DECK_ISSUE_MESSAGES[issue],
      })),
    ];

    return {
      formatId,
      label: "Preview",
      valid:
        parsed.unknownEntries.length === 0 &&
        parsed.malformedEntries.length === 0 &&
        parsed.misplacedEntries.length === 0 &&
        parsed.unsupportedEntries.length === 0 &&
        parsed.leaderIds.length === 1 &&
        parsed.summonIds.length === CONFIRMED_STRUCTURAL_RULES.summonCount &&
        issues.length === 0,
      rules,
    };
  },

  createServerEngine: narutoCreateServerEngine,
  serializeEngine: narutoSerializeEngine,
  restoreEngine: narutoRestoreEngine,
  extractCardsMapsFromSnapshot: narutoExtractCardsMapsFromSnapshot,
};

type NarutoDeckSection = "leader" | "main" | "chakra" | "summon";

function deckListFromDeckCards(deck: ReadonlyArray<DeckCard>): {
  deckList: DeckList;
  leaderIds: string[];
  summonIds: string[];
  unknownEntries: DeckCard[];
  malformedEntries: DeckCard[];
  misplacedEntries: DeckCard[];
  unsupportedEntries: DeckCard[];
} {
  const leaderIds: string[] = [];
  const cardIds: string[] = [];
  const chakraCardIds: string[] = [];
  const summonIds: string[] = [];
  const unknownEntries: DeckCard[] = [];
  const malformedEntries: DeckCard[] = [];
  const misplacedEntries: DeckCard[] = [];
  const unsupportedEntries: DeckCard[] = [];

  for (const entry of deck) {
    if (!Number.isInteger(entry.quantity) || entry.quantity <= 0) {
      malformedEntries.push(entry);
      continue;
    }
    const card = getCardById(entry.cardId);
    if (!card) {
      unknownEntries.push(entry);
      continue;
    }
    const expectedSection = sectionForCardType(card.cardType);
    const section = entry.sectionId ?? expectedSection;
    if (!isNarutoDeckSection(section)) {
      unsupportedEntries.push(entry);
      continue;
    }
    if (section !== expectedSection) misplacedEntries.push(entry);
    const target =
      section === "leader"
        ? leaderIds
        : section === "main"
          ? cardIds
          : section === "chakra"
            ? chakraCardIds
            : summonIds;
    for (let index = 0; index < entry.quantity; index += 1) target.push(entry.cardId);
  }

  return {
    deckList: {
      leaderId: leaderIds[0] ?? "",
      cardIds,
      chakraCardIds,
      summonCardId: summonIds[0] ?? "",
    },
    leaderIds,
    summonIds,
    unknownEntries,
    malformedEntries,
    misplacedEntries,
    unsupportedEntries,
  };
}

function sectionForCardType(cardType: CardType): NarutoDeckSection {
  switch (cardType) {
    case "leader":
      return "leader";
    case "character":
    case "ex_character":
      return "main";
    case "chakra":
      return "chakra";
    case "summon":
      return "summon";
  }
}

function isNarutoDeckSection(value: string): value is NarutoDeckSection {
  return value === "leader" || value === "main" || value === "chakra" || value === "summon";
}
