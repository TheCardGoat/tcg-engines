import { grandArchivePracticeDecks } from "@tcg/grand-archive-server-adapter/practice";
import { GRAND_ARCHIVE_AUTOMATED_ACTION_STRATEGIES } from "@tcg/grand-archive-engine/automation";
import { grandArchiveCards } from "@tcg/grand-archive-cards";
import {
  createGrandArchiveCatalogSmokeFixture,
  resolveGrandArchiveTextDeck,
  type GrandArchiveTextDeckInput,
} from "@tcg/grand-archive-engine/automation";
import {
  createGrandArchiveMatchInitialState,
  createGrandArchiveMatchProgram,
} from "@tcg/grand-archive-engine/runtime";
import { GrandArchiveMatchRuntime } from "@tcg/grand-archive-engine/simulator";
import { GrandArchiveServerEngine } from "@tcg/grand-archive-server-adapter";

export interface GrandArchivePracticeSetupInput {
  readonly deck: GrandArchiveTextDeckInput;
  readonly opponentDeck?: GrandArchiveTextDeckInput;
  readonly randomSeed: number;
}

function sectionText(definitionIds: readonly string[]): string {
  const counts = new Map<string, number>();
  definitionIds.forEach((id) => counts.set(id, (counts.get(id) ?? 0) + 1));
  return [...counts]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([id, count]) => `${count}x ${id}`)
    .join("\n");
}

export function defaultGrandArchivePracticeDeck(): GrandArchiveTextDeckInput {
  const { initialState } = createGrandArchiveCatalogSmokeFixture(20260826);
  const playerId = initialState.turnOrder[0]!;
  const mainIds = initialState.zones[playerId]["main-deck"].map(
    (objectId) => initialState.objects[objectId]!.definitionId,
  );
  const materialIds = initialState.zones[playerId]["material-deck"].map(
    (objectId) => initialState.objects[objectId]!.definitionId,
  );
  const startingChampion = materialIds[0];
  if (!startingChampion) throw new Error("Grand Archive smoke deck has no starting Champion");
  return {
    mainDeck: sectionText(mainIds),
    materialDeck: sectionText(materialIds),
    startingChampion,
  };
}

export function createGrandArchivePracticeEngineFromSetup(
  input: GrandArchivePracticeSetupInput,
): GrandArchiveServerEngine {
  if (!Number.isSafeInteger(input.randomSeed)) throw new Error("Seed must be a whole number.");
  const program = createGrandArchiveMatchProgram(grandArchiveCards);
  const deck = resolveGrandArchiveTextDeck(program, input.deck);
  const opponent = resolveGrandArchiveTextDeck(program, input.opponentDeck ?? input.deck);
  const initialState = createGrandArchiveMatchInitialState(program, {
    mode: "standard",
    players: [
      { id: "p1", name: "p1", ...deck },
      { id: "p2", name: "p2", ...opponent },
    ],
    firstPlayerId: "p1",
    randomSeed: input.randomSeed,
  });
  return new GrandArchiveServerEngine(program, new GrandArchiveMatchRuntime(program, initialState));
}

/** An explicit matchmaking launch takes priority over a previous local practice session. */
export function practiceSetupFromSearch(search: string) {
  const params = new URLSearchParams(search);
  if (!params.has("playerDeck") && !params.has("opponentDeck")) return null;
  const player = grandArchivePracticeDecks.find((deck) => deck.id === params.get("playerDeck"));
  const opponent = grandArchivePracticeDecks.find((deck) => deck.id === params.get("opponentDeck"));
  const strategy = GRAND_ARCHIVE_AUTOMATED_ACTION_STRATEGIES.find(
    (option) => option.id === params.get("strategy") && !("testOnly" in option && option.testOnly),
  );
  if (!player || !opponent || !strategy)
    throw new Error("Invalid practice setup. Choose starter decks and a strategy in matchmaking.");
  return {
    server: createGrandArchivePracticeEngineFromSetup({
      deck: player.deck,
      opponentDeck: opponent.deck,
      randomSeed: Math.floor(Math.random() * 0x7fffffff),
    }),
    strategyId: strategy.id,
  };
}
