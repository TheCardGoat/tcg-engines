import {
  AlphaClashServerEngine,
  alphaClashCreateServerEngine,
  alphaClashServerAdapter,
} from "@tcg/alpha-clash-server-adapter";
import {
  ALPHA_CLASH_PRACTICE_STRATEGIES,
  ALPHA_CLASH_RECOMMENDED_PRACTICE_STRATEGY,
} from "@tcg/alpha-clash-server-adapter/practice";

export interface AlphaClashPracticeSetupInput {
  readonly playerDeckId: string;
  readonly opponentDeckId: string;
  readonly strategyId: string;
  readonly seed: string;
}

/** Matchmaking-style parameters and existing deckA/deckB links use the same setup. */
export function alphaClashPracticeSetupFromSearch(
  search: string | URLSearchParams,
): AlphaClashPracticeSetupInput | null {
  const params = new URLSearchParams(search);
  if (!["playerDeck", "opponentDeck", "deckA", "deckB"].some((key) => params.has(key))) return null;
  const setup = {
    playerDeckId: params.get("playerDeck") ?? params.get("deckA") ?? "clarity-hyper-aggro",
    opponentDeckId: params.get("opponentDeck") ?? params.get("deckB") ?? "absence-makati",
    strategyId: params.get("strategy") ?? ALPHA_CLASH_RECOMMENDED_PRACTICE_STRATEGY,
    seed: params.get("seed") ?? "1",
  };
  validateSetup(setup);
  return setup;
}

function validateSetup(input: AlphaClashPracticeSetupInput) {
  if (!ALPHA_CLASH_PRACTICE_STRATEGIES.some((strategy) => strategy.id === input.strategyId))
    throw new Error("Choose an available practice opponent.");
  if (!input.seed.trim()) throw new Error("Enter a match seed.");
  const decks = [input.playerDeckId, input.opponentDeckId].map((id) => {
    const deck = alphaClashServerAdapter.practiceDecks?.getDeck(id);
    if (!deck) throw new Error(`Unknown Alpha Clash practice deck: ${id}`);
    const validation = alphaClashServerAdapter.validateDeckForFormat("constructed", deck);
    if (!validation.valid)
      throw new Error(
        validation.rules
          .filter((rule) => !rule.passed)
          .map((rule) => rule.message)
          .join(" "),
      );
    return deck;
  });
  return decks;
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
