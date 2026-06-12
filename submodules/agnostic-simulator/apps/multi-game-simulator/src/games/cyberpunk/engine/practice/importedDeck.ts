import { structuredCards } from "@tcg/cyberpunk-cards";
import { validateDeck, type DeckValidationErrorCode } from "@tcg/cyberpunk-utils";
import { getAutomatedActionStrategyOption, type DeckList } from "@tcg/cyberpunk-engine";
import type { StrategyDescriptor } from "../index";
import { DEFAULT_BOT_PRACTICE_DECK_ID, getPracticeDeckFixture } from "./deckFixtures";
import { createImportedPracticeMatchConfig, type PracticeMatchConfig } from "./sessionStorage";

type CardDefinition = Parameters<typeof validateDeck>[0][number];

export interface CyberpunkDeckImportMessage {
  type: "cyberpunk.deck.import.v1";
  requestId: string;
  payload: CyberpunkDeckPayload;
}

export interface CyberpunkDeckPayload {
  game: "cyberpunk";
  format: "alpha" | "constructed";
  deckId?: string;
  deckName?: string;
  playerName?: string;
  legends: DeckCardEntry[];
  mainDeck: DeckCardEntry[];
  bot?: PracticeBotConfig;
  launch?: PracticeLaunchConfig;
}

export interface DeckCardEntry {
  cardId?: string;
  slug?: string;
  externalId?: string;
  quantity: number;
}

export interface PracticeBotConfig {
  deckFixtureId?: string;
  deck?: {
    deckName?: string;
    legends: DeckCardEntry[];
    mainDeck: DeckCardEntry[];
  };
  strategyId?: StrategyDescriptor["id"];
}

export interface PracticeLaunchConfig {
  mode: "practice";
  autoStart: boolean;
  seed?: string;
}

export type DeckImportErrorCode =
  | "UNKNOWN_CARD"
  | "INVALID_CARD_TYPE"
  | "INVALID_QUANTITY"
  | "INVALID_LEGEND_COUNT"
  | "NON_LEGEND_IN_LEGENDS"
  | "DUPLICATE_LEGEND_NAME"
  | "INVALID_DECK_SIZE"
  | "LEGEND_IN_MAIN_DECK"
  | "EXCEEDS_COPY_LIMIT"
  | "EXCEEDS_RAM_LIMIT"
  | "UNSUPPORTED_FORMAT";

export interface DeckImportError {
  code: DeckImportErrorCode;
  message: string;
  cardRef?: DeckCardEntry;
}

export type DeckImportResult =
  | { success: true; config: PracticeMatchConfig; warnings: string[] }
  | { success: false; errors: DeckImportError[] };

const cardsById = new Map<string, CardDefinition>(structuredCards.map((card) => [card.id, card]));
const cardsBySlug = new Map<string, CardDefinition>(
  structuredCards.map((card) => [card.slug, card]),
);
const cardsByExternalId = new Map<string, CardDefinition>(
  structuredCards.map((card) => [card.externalId, card]),
);

export function isCyberpunkDeckImportMessage(value: unknown): value is CyberpunkDeckImportMessage {
  if (!value || typeof value !== "object") {
    return false;
  }
  const maybe = value as Partial<CyberpunkDeckImportMessage>;
  return (
    maybe.type === "cyberpunk.deck.import.v1" &&
    typeof maybe.requestId === "string" &&
    typeof maybe.payload === "object" &&
    maybe.payload !== null
  );
}

export function createPracticeConfigFromDeckPayload(
  payload: CyberpunkDeckPayload,
): DeckImportResult {
  if (payload.game !== "cyberpunk") {
    return {
      success: false,
      errors: [
        { code: "UNSUPPORTED_FORMAT", message: "Only Cyberpunk deck payloads are supported." },
      ],
    };
  }
  if (payload.format !== "alpha" && payload.format !== "constructed") {
    return {
      success: false,
      errors: [{ code: "UNSUPPORTED_FORMAT", message: "Unsupported Cyberpunk deck format." }],
    };
  }

  const playerResult = resolveImportedDeck({
    playerId: "p1",
    playerName: payload.playerName || "You",
    deckName: payload.deckName,
    legends: payload.legends,
    mainDeck: payload.mainDeck,
  });
  if (!playerResult.success) {
    return playerResult;
  }

  const botResult = resolveBotDeck(payload.bot);
  if (!botResult.success) {
    return botResult;
  }

  return {
    success: true,
    warnings: [...playerResult.warnings, ...botResult.warnings],
    config: createImportedPracticeMatchConfig({
      playerDeck: playerResult.deck,
      botDeck: botResult.deck,
      botDeckFixtureId: botResult.fixtureId,
      botStrategyId: normalizeStrategyId(payload.bot?.strategyId),
      seed: payload.launch?.seed,
      deckName: payload.deckName,
    }),
  };
}

function normalizeStrategyId(value: unknown): StrategyDescriptor["id"] | undefined {
  return typeof value === "string" && getAutomatedActionStrategyOption(value)
    ? (value as StrategyDescriptor["id"])
    : undefined;
}

function resolveBotDeck(
  bot: PracticeBotConfig | undefined,
):
  | { success: true; deck?: DeckList; fixtureId?: string; warnings: string[] }
  | { success: false; errors: DeckImportError[] } {
  if (bot?.deck) {
    return resolveImportedDeck({
      playerId: "p2",
      playerName: bot.deck.deckName || "Bot",
      deckName: bot.deck.deckName,
      legends: bot.deck.legends,
      mainDeck: bot.deck.mainDeck,
    });
  }

  const fixtureId = bot?.deckFixtureId || DEFAULT_BOT_PRACTICE_DECK_ID;
  if (!getPracticeDeckFixture(fixtureId)) {
    return {
      success: false,
      errors: [{ code: "UNKNOWN_CARD", message: `Unknown bot deck fixture: ${fixtureId}` }],
    };
  }
  return { success: true, fixtureId, warnings: [] };
}

function resolveImportedDeck(input: {
  playerId: string;
  playerName: string;
  deckName?: string;
  legends: DeckCardEntry[];
  mainDeck: DeckCardEntry[];
}):
  | { success: true; deck: DeckList; warnings: string[] }
  | { success: false; errors: DeckImportError[] } {
  const warnings: string[] = [];
  const legendResolution = expandEntries(input.legends, warnings);
  const mainResolution = expandEntries(input.mainDeck, warnings);
  const errors = [...legendResolution.errors, ...mainResolution.errors];
  if (errors.length > 0) {
    return { success: false, errors };
  }

  const legendCards = legendResolution.cards;
  const mainCards = mainResolution.cards;
  const validationWarnings = validateDeck(legendCards, mainCards)
    .map(validationErrorToImportError)
    .map((error) => `${error.code} ${error.message}`);

  return {
    success: true,
    warnings: [...warnings, ...validationWarnings],
    deck: {
      playerId: input.playerId,
      playerName: input.playerName || input.deckName || input.playerId,
      legends: legendCards.map((card) => card.id),
      mainDeck: mainCards.map((card) => card.id),
    },
  };
}

function expandEntries(
  entries: DeckCardEntry[],
  warnings: string[],
): { cards: CardDefinition[]; errors: DeckImportError[] } {
  const cards: CardDefinition[] = [];
  const errors: DeckImportError[] = [];
  if (!Array.isArray(entries)) {
    return {
      cards,
      errors: [{ code: "INVALID_QUANTITY", message: "Deck entries must be an array." }],
    };
  }

  for (const entry of entries) {
    if (!Number.isInteger(entry.quantity) || entry.quantity <= 0) {
      errors.push({
        code: "INVALID_QUANTITY",
        message: "Card quantities must be positive integers.",
        cardRef: entry,
      });
      continue;
    }
    const resolved = resolveCardEntry(entry, warnings);
    if (!resolved) {
      errors.push({
        code: "UNKNOWN_CARD",
        message: "Could not resolve card from cardId, slug, or externalId.",
        cardRef: entry,
      });
      continue;
    }
    for (let i = 0; i < entry.quantity; i++) {
      cards.push(resolved);
    }
  }
  return { cards, errors };
}

function resolveCardEntry(entry: DeckCardEntry, warnings: string[]): CardDefinition | undefined {
  const byId = entry.cardId ? cardsById.get(entry.cardId) : undefined;
  const bySlug = entry.slug ? cardsBySlug.get(entry.slug) : undefined;
  const byExternalId = entry.externalId ? cardsByExternalId.get(entry.externalId) : undefined;
  const resolved = byId ?? bySlug ?? byExternalId;
  if (
    resolved &&
    byId &&
    ((bySlug && bySlug.id !== byId.id) || (byExternalId && byExternalId.id !== byId.id))
  ) {
    warnings.push(`Card id ${entry.cardId} disagreed with slug or externalId; cardId was used.`);
  }
  return resolved;
}

function validationErrorToImportError(error: {
  code: DeckValidationErrorCode;
  message: string;
}): DeckImportError {
  return {
    code: error.code === "NON_LEGEND_IN_LEGENDS" ? "INVALID_CARD_TYPE" : error.code,
    message: error.message,
  };
}
