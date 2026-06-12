import { createGameId } from "@tcg/lorcana-engine";
import { generateUserName } from "@tcg/lorcana-types/name-generator";
import { fromDeckToCardInstances } from "@tcg/lorcana-cards";
import { getAllCardsByIdSync } from "@tcg/lorcana-cards/cards/sync";
import {
  LORCANA_FORMATS,
  type LorcanaFormatId,
  type DeckFormatResult as LorcanaDeckFormatResult,
} from "@tcg/lorcana-types";
import type {
  CardSummary,
  CardsMaps,
  DeckBuildInput,
  DeckCard,
  DeckFormatResult,
  GameAdapter,
} from "@tcg/shared/game-adapter";
import { validateDeckForLorcanaFormat } from "./deck-format-legality";
import {
  lorcanaCreateServerEngine,
  lorcanaExtractCardsMapsFromSnapshot,
  lorcanaRestoreEngine,
  lorcanaSerializeEngine,
} from "./lorcana-engine-lifecycle";

const LORCANA_FORMAT_IDS = new Set<string>(Object.keys(LORCANA_FORMATS));

function isLorcanaFormatId(formatId: string): formatId is LorcanaFormatId {
  return LORCANA_FORMAT_IDS.has(formatId);
}

export const lorcanaServerAdapter: GameAdapter = {
  slug: "lorcana",

  createGameId(): string {
    return createGameId() as string;
  },

  generateUserName(gameProfileId: string): string {
    return generateUserName(gameProfileId);
  },

  buildCardInstances(decks: ReadonlyArray<DeckBuildInput>): CardsMaps {
    return fromDeckToCardInstances(
      decks.map((d) => ({
        owner: d.owner,
        deck: d.deck.map((entry) => ({ cardId: entry.cardId, qty: entry.qty })),
      })),
    );
  },

  getCardById(publicId: string): CardSummary | null {
    const cardsById = getAllCardsByIdSync();
    const card = cardsById[publicId];
    if (!card) return null;
    return {
      publicId,
      colors: card.inkType ?? [],
    };
  },

  validateDeckForFormat(formatId: string, deck: ReadonlyArray<DeckCard>): DeckFormatResult {
    if (!isLorcanaFormatId(formatId)) {
      throw new Error(`Unknown Lorcana format: ${formatId}`);
    }
    const result: LorcanaDeckFormatResult = validateDeckForLorcanaFormat(formatId, deck);
    return {
      formatId: result.formatId,
      label: LORCANA_FORMATS[formatId].label,
      valid: result.valid,
      rules: result.rules.map((r) => ({
        kind: String(r.kind),
        passed: r.passed,
        message: r.message,
      })),
    };
  },

  createServerEngine: lorcanaCreateServerEngine,
  serializeEngine: lorcanaSerializeEngine,
  restoreEngine: lorcanaRestoreEngine,
  extractCardsMapsFromSnapshot: lorcanaExtractCardsMapsFromSnapshot,
};
