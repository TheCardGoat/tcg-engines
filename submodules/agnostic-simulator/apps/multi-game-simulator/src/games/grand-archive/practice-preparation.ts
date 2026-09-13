import {
  createGrandArchivePreparationPool,
  type GrandArchivePreparationSelection,
} from "@tcg/grand-archive-server-adapter/preparation";
import {
  GrandArchiveServerEngine,
  restoreGrandArchiveReplayJournal,
} from "@tcg/grand-archive-server-adapter";
import {
  createGrandArchiveMatchInitialState,
  grandArchivePlayerId,
} from "@tcg/grand-archive-engine/runtime";
import { GrandArchiveMatchRuntime } from "@tcg/grand-archive-engine/simulator";

/** Only used before any commands execute; all registered cards are still in their decks. */
export function practicePreparationPool(server: GrandArchiveServerEngine, playerId: string) {
  const state = server.runtime.state;
  if (server.replayJournal.commands.length)
    throw new Error("A running game cannot be registered again.");
  const zones = state.zones[grandArchivePlayerId(playerId)];
  const pool = createGrandArchivePreparationPool({
    formatId: "standard",
    inventory: [],
    mainDeck: (["main", "material"] as const).flatMap((sectionId) =>
      zones[sectionId === "main" ? "main-deck" : "material-deck"].map((id) => ({
        cardId: state.objects[id]!.definitionId,
        quantity: 1,
        sectionId,
      })),
    ),
  });
  const championId = state.pregame?.startingChampionIds[grandArchivePlayerId(playerId)];
  const champion = championId && state.objects[championId];
  if (!champion) throw new Error("Missing configured starting Champion");
  pool.registered.startingChampionId = champion.definitionId;
  pool.previous.startingChampionId = champion.definitionId;
  return pool;
}

export function restartPracticePreparation(server: GrandArchiveServerEngine) {
  const restored = restoreGrandArchiveReplayJournal(server.program, {
    ...server.replayJournal,
    commands: [],
    acceptedCorrelationIds: [],
  });
  return new GrandArchiveServerEngine(server.program, restored.runtime, restored.journal);
}

export function confirmPracticePreparation(
  server: GrandArchiveServerEngine,
  player: GrandArchivePreparationSelection,
  firstPlayerId: string,
) {
  const opponentId = server.runtime.state.turnOrder.find((id) => id !== "p1")!;
  const opponent = practicePreparationPool(server, opponentId).previous;
  const setup = (id: string, selection: GrandArchivePreparationSelection) => ({
    id,
    name: id === "p1" ? "You" : "Practice opponent",
    mainDeck: selection.main.map((entry) => ({
      definitionId: entry.canonicalId,
      count: entry.quantity,
    })),
    materialDeck: selection.material.map((entry) => ({
      definitionId: entry.canonicalId,
      count: entry.quantity,
    })),
    sideboard: selection.sideboard.map((entry) => ({
      definitionId: entry.canonicalId,
      count: entry.quantity,
    })),
    startingChampionDefinitionId: selection.startingChampionId,
  });
  const state = createGrandArchiveMatchInitialState(server.program, {
    mode: "standard",
    players: [setup("p1", player), setup(opponentId, opponent)],
    firstPlayerId,
    randomSeed: Math.floor(Math.random() * 0x7fffffff),
  });
  return new GrandArchiveServerEngine(
    server.program,
    new GrandArchiveMatchRuntime(server.program, state),
  );
}
