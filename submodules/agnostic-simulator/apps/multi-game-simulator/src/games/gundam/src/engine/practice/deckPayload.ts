import {
  decodeDeckDocumentFromUrlParam,
  type MatchType,
  type ResolvedMatchViewer,
} from "@tcg/game-page-contract";
import {
  gundamDeckDocumentToDeckList,
  gundamSetupPresentationFromDocument,
} from "@tcg/gundam-server-adapter";
import {
  DEFAULT_GUNDAM_AUTOMATED_ACTION_STRATEGY_ID,
  getGundamAutomatedActionStrategyOption,
  GUNDAM_MAIN_DECK_SIZE,
  GUNDAM_RESOURCE_DECK_SIZE,
  validateDeckList,
  type DeckList,
  type GundamAutomatedActionStrategyId,
} from "@tcg/gundam-engine";
import type { DeckCard } from "@tcg/shared/game-adapter";

import {
  buildGundamCardCatalog,
  DEFAULT_DECK_ID,
  SAMPLE_DECKS,
  SAMPLE_DECK_IDS,
  type SampleDeckId,
} from "../../data/sample-decks/index.ts";

export type GundamPracticeStrategyId = GundamAutomatedActionStrategyId;

const PRACTICE_RECIPE_MARKER = "practiceRecipe";
const PRACTICE_RECIPE_VERSION = "1";
const GUNDAM_PRACTICE_PATH = "/gundam/simulator/practice";
const PRACTICE_RECIPE_KEYS = [
  "source",
  "deck",
  "deckVersionId",
  "opponent",
  "opponentSource",
  "botProfileId",
  "botDeckId",
  "botDeckVersionId",
  "strategy",
] as const;

export type GundamPracticeBotDeckSource =
  | {
      readonly kind: "inline";
      readonly deck: DeckList;
      readonly deckListId: string;
    }
  | {
      readonly kind: "saved_version";
      readonly gameProfileId: string;
      readonly deckId: string;
      readonly deckVersionId: string;
      readonly formatId: "standard";
    };

export interface GundamPracticePayload {
  readonly playerDeck: DeckList;
  readonly playerDeckListId: string;
  /**
   * Canonical card number → chosen printing for the player's deck, decoded
   * from the URL deck document. Server-authority practice forwards these so
   * the human seat renders its chosen art instead of the defaults.
   */
  readonly playerPrintingSelections: Readonly<Record<string, string>>;
  /** Exact document rows used to preserve mixed printing allocations in practice. */
  readonly playerDocumentCards?: readonly DeckCard[];
  readonly playerSetupPresentation: Readonly<Record<string, string>>;
  readonly playerDeckVersionId?: string;
  readonly botDeckSource: GundamPracticeBotDeckSource;
  readonly botStrategyId: GundamPracticeStrategyId;
  /**
   * Construction-rule violations the deck was allowed to start with.
   * Practice is a testing tool, so an illegal deck does not block the
   * match — entries the engine cannot instantiate (unknown card
   * numbers, non-positive counts) are dropped and everything else is
   * played as submitted. Empty when the deck validated cleanly.
   */
  readonly warnings: readonly string[];
}

export interface GundamPracticePayloadError {
  readonly message: string;
  readonly details: readonly string[];
}

export type GundamPracticePayloadResult =
  | { readonly ok: true; readonly payload: GundamPracticePayload }
  | { readonly ok: false; readonly error: GundamPracticePayloadError };

/**
 * Carries only the validated practice inputs into the hosted match URL.
 * The marker is written after payload validation succeeds, so post-game UI
 * never guesses at a rematch recipe for older or manually assembled URLs.
 */
export function buildGundamPracticeLiveMatchSearch(
  practiceSearch: URLSearchParams,
  returnTo: string,
): URLSearchParams {
  const liveMatchSearch = copyPracticeRecipe(practiceSearch);
  liveMatchSearch.set(PRACTICE_RECIPE_MARKER, PRACTICE_RECIPE_VERSION);
  liveMatchSearch.set("returnTo", returnTo);
  return liveMatchSearch;
}

/**
 * Returns the mounted practice entry route with the original matchup recipe.
 * A fresh visit creates new match/game identities and reruns setup while
 * preserving deck composition and bot configuration.
 */
export function buildGundamPracticeRematchPath(input: {
  readonly matchType: MatchType | null | undefined;
  readonly viewerRole: ResolvedMatchViewer["role"] | null | undefined;
  readonly liveMatchSearch: URLSearchParams;
}): string | null {
  if (
    input.matchType !== "practice_vs_bot" ||
    input.viewerRole !== "player" ||
    input.liveMatchSearch.get(PRACTICE_RECIPE_MARKER) !== PRACTICE_RECIPE_VERSION
  ) {
    return null;
  }

  const rematchSearch = copyPracticeRecipe(input.liveMatchSearch);
  const returnTo = input.liveMatchSearch.get("returnTo");
  if (returnTo) rematchSearch.set("returnTo", returnTo);
  const query = rematchSearch.toString();
  return `${GUNDAM_PRACTICE_PATH}${query ? `?${query}` : ""}`;
}

export function resolveGundamPracticePayload(search: URLSearchParams): GundamPracticePayloadResult {
  const botStrategyId =
    readStrategyId(search.get("strategy")) ?? DEFAULT_GUNDAM_AUTOMATED_ACTION_STRATEGY_ID;
  const botDeckSource = resolveBotDeckSource(search);
  if (!botDeckSource.ok) return botDeckSource;
  const encodedDeck = search.get("deck");

  if (!encodedDeck) {
    return {
      ok: true,
      payload: {
        playerDeck: SAMPLE_DECKS[DEFAULT_DECK_ID],
        playerPrintingSelections: {},
        playerSetupPresentation: {},
        playerDeckListId: DEFAULT_DECK_ID,
        botDeckSource: botDeckSource.source,
        botStrategyId,
        warnings: [],
      },
    };
  }

  const decoded = decodeDeckDocumentFromUrlParam(encodedDeck);
  if (!decoded.ok) {
    return invalidDeck(
      "Practice deck link is not a supported deck document.",
      decoded.diagnostics.map((diagnostic) => diagnostic.message),
    );
  }

  const mapped = gundamDeckDocumentToDeckList(decoded.document);
  const blockingDiagnostics = mapped.diagnostics.filter(
    (diagnostic) => diagnostic.kind !== "unresolved",
  );
  if (blockingDiagnostics.length > 0) {
    return invalidDeck(
      "Practice deck document is not valid for Gundam.",
      blockingDiagnostics.map((diagnostic) => diagnostic.message),
    );
  }

  const catalog = buildGundamCardCatalog();
  const validation = validateDeckList(mapped.deck, { catalog });
  const warnings = [
    ...decoded.diagnostics.map((diagnostic) => diagnostic.message),
    ...mapped.diagnostics.map((diagnostic) => diagnostic.message),
    ...(validation.ok ? [] : validation.errors),
  ];
  const playerDeck = validation.ok ? mapped.deck : sanitizePracticeDeck(mapped.deck, catalog);
  const playerDocumentCards = mapped.documentCards
    .filter(
      (entry) =>
        (entry.sectionId === "main" || entry.sectionId === "resource") &&
        Number.isInteger(entry.quantity) &&
        entry.quantity > 0 &&
        Boolean(catalog[entry.canonicalId ?? entry.cardId]),
    )
    .map((entry) => ({
      ...entry,
      quantity: Math.min(
        entry.quantity,
        entry.sectionId === "resource" ? GUNDAM_RESOURCE_DECK_SIZE : GUNDAM_MAIN_DECK_SIZE,
      ),
    }));
  if (!validation.ok) {
    console.warn(
      "Practice deck violates Gundam deck construction rules; starting practice anyway.",
      warnings,
    );
  }

  return {
    ok: true,
    payload: {
      playerDeck,
      ...(playerDocumentCards.some((entry) => entry.sectionId === "resource")
        ? { playerDocumentCards }
        : {}),
      playerPrintingSelections: mapped.printingSelections,
      playerSetupPresentation: gundamSetupPresentationFromDocument(decoded.document),
      ...(search.get("deckVersionId")?.trim()
        ? { playerDeckVersionId: search.get("deckVersionId")!.trim() }
        : {}),
      playerDeckListId: `practice_${slugify(mapped.deck.name) || "deck"}`,
      botDeckSource: botDeckSource.source,
      botStrategyId,
      warnings,
    },
  };
}

function resolveBotDeckSource(
  search: URLSearchParams,
):
  | { readonly ok: true; readonly source: GundamPracticeBotDeckSource }
  | { readonly ok: false; readonly error: GundamPracticePayloadError } {
  const sourceKind = search.get("opponentSource");
  if (!sourceKind) {
    const opponentDeckId = readSampleDeckId(search.get("opponent")) ?? DEFAULT_DECK_ID;
    return {
      ok: true,
      source: {
        kind: "inline",
        deck: SAMPLE_DECKS[opponentDeckId],
        deckListId: opponentDeckId,
      },
    };
  }
  if (sourceKind !== "saved_version") {
    return {
      ok: false,
      error: { message: "Practice opponent source is not supported.", details: [] },
    };
  }

  const gameProfileId = search.get("botProfileId")?.trim();
  const deckId = search.get("botDeckId")?.trim();
  const deckVersionId = search.get("botDeckVersionId")?.trim();
  if (!gameProfileId || !deckId || !deckVersionId) {
    return {
      ok: false,
      error: { message: "Saved bot deck link is incomplete. Choose the deck again.", details: [] },
    };
  }
  return {
    ok: true,
    source: {
      kind: "saved_version",
      gameProfileId,
      deckId,
      deckVersionId,
      formatId: "standard",
    },
  };
}

/**
 * Practice is a deck-testing tool, so construction-rule violations must not
 * block a match. Strip only the entries the engine cannot instantiate —
 * unknown card numbers and non-positive counts would throw or silently lose
 * cards in `expandDeck`/setup. Counts are capped before expansion so an
 * untrusted URL cannot allocate an unbounded deck, and the default sample
 * resource is used when the submitted one is unusable. Everything else (short
 * decks, token printings, extra copies, extra colors) plays as submitted; the
 * engine classifies cards by their catalog type at setup, so it tolerates them.
 */
function sanitizePracticeDeck(deck: DeckList, catalog: Record<string, unknown>): DeckList {
  const cards = deck.cards
    .filter(
      (entry) =>
        Number.isInteger(entry.count) && entry.count > 0 && Boolean(catalog[entry.cardNumber]),
    )
    .map((entry) => ({ ...entry, count: Math.min(entry.count, GUNDAM_MAIN_DECK_SIZE) }));
  const resource =
    Number.isInteger(deck.resource.count) &&
    deck.resource.count > 0 &&
    Boolean(catalog[deck.resource.cardNumber])
      ? {
          ...deck.resource,
          count: Math.min(deck.resource.count, GUNDAM_RESOURCE_DECK_SIZE),
        }
      : SAMPLE_DECKS[DEFAULT_DECK_ID].resource;
  return { ...deck, cards, resource };
}

export function gundamDeckToHistoric(
  deck: DeckList,
  printingSelections: Readonly<Record<string, string>> = {},
): ReadonlyArray<{
  cardPublicId: string;
  quantity: number;
  sectionId: "main" | "resource";
  printingId?: string;
}> {
  // A row's own printing wins over the canonical selection map: mixed
  // allocations of one canonical travel as separate rows, each keeping its
  // own art instead of collapsing to the map's last-write.
  const printingFor = (entry: { cardNumber: string; printingId?: string }): string | undefined =>
    entry.printingId ?? printingSelections[entry.cardNumber];
  return [
    ...deck.cards.map((card) => ({
      cardPublicId: card.cardNumber,
      quantity: card.count,
      sectionId: "main" as const,
      ...(printingFor(card) ? { printingId: printingFor(card) } : {}),
    })),
    {
      cardPublicId: deck.resource.cardNumber,
      quantity: deck.resource.count,
      sectionId: "resource" as const,
      ...(printingFor(deck.resource) ? { printingId: printingFor(deck.resource) } : {}),
    },
  ];
}

export function gundamDocumentCardsToHistoric(cards: readonly DeckCard[]): ReadonlyArray<{
  cardPublicId: string;
  quantity: number;
  sectionId: "main" | "resource";
  printingId?: string;
}> {
  return cards.flatMap((entry) => {
    if (entry.sectionId !== "main" && entry.sectionId !== "resource") return [];
    return [
      {
        cardPublicId: entry.canonicalId ?? entry.cardId,
        quantity: entry.quantity,
        sectionId: entry.sectionId,
        ...(entry.printingId ? { printingId: entry.printingId } : {}),
      },
    ];
  });
}

function invalidDeck(
  message: string,
  details: readonly string[] = [],
): GundamPracticePayloadResult {
  return { ok: false, error: { message, details } };
}

function copyPracticeRecipe(source: URLSearchParams): URLSearchParams {
  const recipe = new URLSearchParams();
  for (const key of PRACTICE_RECIPE_KEYS) {
    const value = source.get(key);
    if (value) recipe.set(key, value);
  }
  return recipe;
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

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}
