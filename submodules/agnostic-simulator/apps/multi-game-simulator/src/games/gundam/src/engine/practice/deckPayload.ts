import { decodeDeckFromUrlParam } from "@tcg/game-page-contract";
import {
  DEFAULT_GUNDAM_AUTOMATED_ACTION_STRATEGY_ID,
  getGundamAutomatedActionStrategyOption,
  validateDeckList,
  type DeckList,
  type GundamAutomatedActionStrategyId,
} from "@tcg/gundam-engine";

import {
  buildGundamCardCatalog,
  DEFAULT_DECK_ID,
  SAMPLE_DECKS,
  SAMPLE_DECK_IDS,
  type SampleDeckId,
} from "../../data/sample-decks/index.ts";

export type GundamPracticeStrategyId = GundamAutomatedActionStrategyId;

export interface GundamPracticePayload {
  readonly playerDeck: DeckList;
  readonly playerDeckListId: string;
  readonly botDeck: DeckList;
  readonly botDeckListId: string;
  readonly botStrategyId: GundamPracticeStrategyId;
}

export interface GundamPracticePayloadError {
  readonly message: string;
  readonly details: readonly string[];
}

export type GundamPracticePayloadResult =
  | { readonly ok: true; readonly payload: GundamPracticePayload }
  | { readonly ok: false; readonly error: GundamPracticePayloadError };

export function resolveGundamPracticePayload(search: URLSearchParams): GundamPracticePayloadResult {
  const opponentDeckId = readSampleDeckId(search.get("opponent")) ?? DEFAULT_DECK_ID;
  const botStrategyId =
    readStrategyId(search.get("strategy")) ?? DEFAULT_GUNDAM_AUTOMATED_ACTION_STRATEGY_ID;
  const botDeck = SAMPLE_DECKS[opponentDeckId];
  const encodedDeck = search.get("deck");

  if (!encodedDeck) {
    return {
      ok: true,
      payload: {
        playerDeck: SAMPLE_DECKS[DEFAULT_DECK_ID],
        playerDeckListId: DEFAULT_DECK_ID,
        botDeck,
        botDeckListId: opponentDeckId,
        botStrategyId,
      },
    };
  }

  const decoded = decodeDeckFromUrlParam(encodedDeck);
  if (!decoded) {
    return invalidDeck("Practice deck link is not valid base64url JSON.");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(decoded);
  } catch {
    return invalidDeck("Practice deck payload is not valid JSON.");
  }

  if (!isDeckList(parsed)) {
    return invalidDeck("Practice deck payload is not a Gundam deck list.");
  }

  const catalog = buildGundamCardCatalog();
  const validation = validateDeckList(parsed, { catalog });
  if (!validation.ok) {
    return {
      ok: false,
      error: {
        message: "Practice deck does not satisfy Gundam deck construction rules.",
        details: validation.errors,
      },
    };
  }

  return {
    ok: true,
    payload: {
      playerDeck: parsed,
      playerDeckListId: `practice_${slugify(parsed.name) || "deck"}`,
      botDeck,
      botDeckListId: opponentDeckId,
      botStrategyId,
    },
  };
}

export function gundamDeckToHistoric(
  deck: DeckList,
): ReadonlyArray<{ cardPublicId: string; quantity: number }> {
  return [
    ...deck.cards.map((card) => ({
      cardPublicId: card.cardNumber,
      quantity: card.count,
    })),
    {
      cardPublicId: deck.resource.cardNumber,
      quantity: deck.resource.count,
    },
  ];
}

function invalidDeck(message: string): GundamPracticePayloadResult {
  return { ok: false, error: { message, details: [] } };
}

function readSampleDeckId(value: string | null): SampleDeckId | null {
  if (!value) return null;
  return SAMPLE_DECK_IDS.includes(value as SampleDeckId) ? (value as SampleDeckId) : null;
}

function readStrategyId(value: string | null): GundamPracticeStrategyId | null {
  return value && getGundamAutomatedActionStrategyOption(value)
    ? (value as GundamPracticeStrategyId)
    : null;
}

function isDeckList(value: unknown): value is DeckList {
  if (!value || typeof value !== "object") return false;
  const deck = value as Partial<DeckList>;
  return (
    typeof deck.name === "string" &&
    Array.isArray(deck.cards) &&
    deck.cards.every(isDeckListEntry) &&
    Boolean(deck.resource) &&
    isDeckResourceEntry(deck.resource)
  );
}

function isDeckListEntry(value: unknown): value is DeckList["cards"][number] {
  if (!value || typeof value !== "object") return false;
  const entry = value as { cardNumber?: unknown; count?: unknown };
  return typeof entry.cardNumber === "string" && typeof entry.count === "number";
}

function isDeckResourceEntry(value: unknown): value is DeckList["resource"] {
  if (!value || typeof value !== "object") return false;
  const entry = value as { cardNumber?: unknown; count?: unknown };
  return typeof entry.cardNumber === "string" && typeof entry.count === "number";
}

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}
