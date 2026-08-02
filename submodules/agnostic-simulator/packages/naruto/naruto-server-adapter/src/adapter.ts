import { getCardById } from "@tcg-engines/naruto-cards";
import {
  OFFICIAL_RULES,
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

/** Card art is resolved by the app surface; cards package ships data only. */
function narutoImageUrl(cardId: string): string {
  return `/images/cards/en/${cardId}.webp`;
}

const DECK_ISSUE_MESSAGES: Record<DeckIssue, string> = {
  noLeader: "Deck must include a leader",
  unknownLeader: "Leader is unknown or not a leader card",
  wrongSize: `Main deck must contain exactly ${OFFICIAL_RULES.deckSize} cards`,
  notACharacter: "Main deck may only contain character and EX character cards",
  wrongColor: "All cards must match the leader's color (or be colorless)",
  tooManyCopies: `No more than ${PROVISIONAL_RULES.maxCopiesPerCard ?? "unlimited"} copies of any card`,
};

/**
 * Server-side {@link GameAdapter} for Naruto. Wraps
 * `@tcg-engines/naruto-engine` (pure 12-action reducer) so the play module
 * never touches game internals.
 *
 * Format validation supports a single "official" format: 1 leader + a
 * 50-card main deck of same-color characters/EX, max 4 copies per card.
 */
export const narutoServerAdapter: GameAdapter = {
  slug: "naruto",

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
    for (const { owner, deck } of decks) {
      const ownerInstances: string[] = [];
      // Per-owner monotonic counter so duplicate cardId rows can't collide.
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
    const card = getCardById(publicId);
    if (!card) return null;
    return {
      publicId,
      colors: card.color ? [card.color] : [],
      label: card.nameEn,
      imageUrl: narutoImageUrl(card.id),
    };
  },

  getCanonicalCardId(publicId: string): string | null {
    return getCardById(publicId)?.id ?? null;
  },

  getRuntimeFingerprint() {
    return NARUTO_RUNTIME_FINGERPRINT;
  },

  validateDeckForFormat(formatId: string, deck: ReadonlyArray<DeckCard>): DeckFormatResult {
    if (formatId !== "official") {
      throw new Error(`Unknown Naruto format: ${formatId}`);
    }

    const unknownEntries = deck.filter((entry) => !getCardById(entry.cardId));
    const leaders = deck.filter(
      (entry) => getCardById(entry.cardId)?.cardType === "leader" && entry.quantity > 0,
    );
    const leaderId = leaders[0]?.cardId ?? "";
    const deckList: DeckList = {
      leaderId,
      cardIds: deck.flatMap((entry) => {
        const card = getCardById(entry.cardId);
        if (!card || card.cardType === "leader") return [];
        return Array.from({ length: Math.max(0, Math.floor(entry.quantity)) }, () => entry.cardId);
      }),
    };
    const issues = leaderId ? deckIssues(deckList) : (["noLeader"] as DeckIssue[]);

    const rules = [
      {
        kind: "card-pool",
        passed: unknownEntries.length === 0,
        message:
          unknownEntries.length === 0
            ? "All cards are part of the Naruto card pool"
            : `Unknown cards: ${unknownEntries.map((entry) => entry.cardId).join(", ")}`,
        details:
          unknownEntries.length === 0
            ? undefined
            : { cardIds: unknownEntries.map((entry) => entry.cardId) },
      },
      {
        kind: "leader-count",
        passed: leaders.length === 1 && leaders[0]?.quantity === 1,
        message:
          leaders.length === 1 && leaders[0]?.quantity === 1
            ? "Deck has exactly one leader"
            : "Deck must include exactly one leader card",
      },
      ...issues.map((issue) => ({
        kind: issue,
        passed: false,
        message: DECK_ISSUE_MESSAGES[issue],
      })),
    ];

    return {
      formatId,
      label: "Official",
      valid:
        unknownEntries.length === 0 &&
        leaders.length === 1 &&
        leaders[0]?.quantity === 1 &&
        issues.length === 0,
      rules,
    };
  },

  createServerEngine: narutoCreateServerEngine,
  serializeEngine: narutoSerializeEngine,
  restoreEngine: narutoRestoreEngine,
  extractCardsMapsFromSnapshot: narutoExtractCardsMapsFromSnapshot,
};
