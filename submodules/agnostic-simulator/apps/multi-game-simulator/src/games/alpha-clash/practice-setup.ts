import {
  AlphaClashServerEngine,
  alphaClashCreateServerEngine,
  alphaClashServerAdapter,
  ALPHA_CLASH_CONTENDER_SECTION_ID,
  ALPHA_CLASH_MAIN_SECTION_ID,
} from "@tcg/alpha-clash-server-adapter";
import {
  ALPHA_CLASH_PRACTICE_STRATEGIES,
  ALPHA_CLASH_RECOMMENDED_PRACTICE_STRATEGY,
} from "@tcg/alpha-clash-server-adapter/practice";
import type { DeckCard } from "@tcg/shared/game-adapter";

export interface AlphaClashPracticeSetupInput {
  readonly playerDeckId: string;
  readonly opponentDeckId: string;
  readonly strategyId: string;
  readonly seed: string;
  /** Deck-builder share link deck resolved for the player seat (`?deck=` payload). */
  readonly playerDeck?: readonly DeckCard[];
}

/** Matchmaking-style parameters and existing deckA/deckB links use the same setup. */
export function alphaClashPracticeSetupFromSearch(
  search: string | URLSearchParams,
): AlphaClashPracticeSetupInput | null {
  const params = new URLSearchParams(search);
  const hasCustomDeck = params.has("deck") && params.get("deck") !== "";
  if (!["playerDeck", "opponentDeck", "deckA", "deckB", "deck"].some((key) => params.has(key)))
    return null;
  const setup: AlphaClashPracticeSetupInput = {
    playerDeckId: hasCustomDeck
      ? "custom-deck"
      : (params.get("playerDeck") ?? params.get("deckA") ?? "clarity-hyper-aggro"),
    opponentDeckId: params.get("opponentDeck") ?? params.get("deckB") ?? "absence-makati",
    strategyId: params.get("strategy") ?? ALPHA_CLASH_RECOMMENDED_PRACTICE_STRATEGY,
    seed: params.get("seed") ?? "1",
    ...(hasCustomDeck
      ? { playerDeck: alphaClashPracticeDeckFromPayload(params.get("deck")!) }
      : {}),
  };
  validateSetup(setup);
  return setup;
}

function validateSetup(input: AlphaClashPracticeSetupInput) {
  if (!ALPHA_CLASH_PRACTICE_STRATEGIES.some((strategy) => strategy.id === input.strategyId))
    throw new Error("Choose an available practice opponent.");
  if (!input.seed.trim()) throw new Error("Enter a match seed.");
  return [resolvePlayerDeck(input), resolvePresetDeck(input.opponentDeckId)];
}

function resolvePlayerDeck(input: AlphaClashPracticeSetupInput): readonly DeckCard[] {
  if (input.playerDeck) return input.playerDeck;
  return resolvePresetDeck(input.playerDeckId);
}

function resolvePresetDeck(id: string): readonly DeckCard[] {
  const deck = alphaClashServerAdapter.practiceDecks?.getDeck(id);
  if (!deck) throw new Error(`Unknown Alpha Clash practice deck: ${id}`);
  return deck;
}

export async function createAlphaClashPracticeEngine(
  input: AlphaClashPracticeSetupInput,
): Promise<AlphaClashServerEngine> {
  const decks = validateSetup(input);
  const owners = ["human", "bot"];
  const cardsMaps = alphaClashServerAdapter.buildCardInstances(
    decks.map((deck, index) => ({
      owner: owners[index],
      deck: deck.map((entry) => ({
        cardId: entry.cardId,
        qty: entry.quantity,
        sectionId: entry.sectionId,
      })),
    })),
  );
  const engine = await alphaClashCreateServerEngine({
    gameSlug: "alpha-clash",
    seed: input.seed,
    firstPlayerChooserId: "human",
    player1Id: "human",
    player2Id: "bot",
    cardsMaps,
  });
  if (!(engine instanceof AlphaClashServerEngine)) throw new Error("Invalid Alpha Clash engine.");
  return engine;
}

/** Deck-builder share payload: base64url JSON `{ v: 1, c: contenderId, m: counts }`. */
interface AlphaClashPracticeDeckPayload {
  readonly v: 1;
  readonly c: string;
  readonly m: Record<string, number>;
}

const MAX_PRACTICE_CARD_QUANTITY = 99;
const MAX_PRACTICE_MAIN_CARDS = 500;

/** Decodes the platform's compact `alphaClashPracticeDeck.v1` URL payload. */
export function alphaClashPracticeDeckFromPayload(value: string): readonly DeckCard[] {
  const invalid = (): never => {
    throw new Error("Invalid Alpha Clash deck-builder link.");
  };
  let parsed: Partial<AlphaClashPracticeDeckPayload>;
  try {
    const base64 = value.replaceAll("-", "+").replaceAll("_", "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    parsed = JSON.parse(atob(padded)) as Partial<AlphaClashPracticeDeckPayload>;
  } catch {
    return invalid();
  }
  if (
    parsed.v !== 1 ||
    typeof parsed.c !== "string" ||
    parsed.c.length === 0 ||
    !isCountMap(parsed.m)
  ) {
    return invalid();
  }
  const mainCount = Object.values(parsed.m).reduce((total, quantity) => total + quantity, 0);
  if (mainCount > MAX_PRACTICE_MAIN_CARDS) return invalid();
  return [
    { cardId: parsed.c, quantity: 1, sectionId: ALPHA_CLASH_CONTENDER_SECTION_ID },
    ...Object.entries(parsed.m).map(
      ([cardId, quantity]): DeckCard => ({
        cardId,
        quantity,
        sectionId: ALPHA_CLASH_MAIN_SECTION_ID,
      }),
    ),
  ];
}

function isCountMap(value: unknown): value is Record<string, number> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  return Object.entries(value).every(
    ([id, quantity]) =>
      typeof id === "string" &&
      id.length > 0 &&
      typeof quantity === "number" &&
      Number.isInteger(quantity) &&
      quantity > 0 &&
      quantity <= MAX_PRACTICE_CARD_QUANTITY,
  );
}
