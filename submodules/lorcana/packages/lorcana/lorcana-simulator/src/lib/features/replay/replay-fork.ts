/**
 * Fork a replay into a local human-vs-AI game.
 *
 * Takes a snapshot from the replay orchestrator (state + cardsMaps + playerIds)
 * and bootstraps a HumanVsAiOrchestrator with that exact board state.
 *
 * The key challenge: the engine's card instance registry (staticResources) is
 * set at construction time and NOT updated by loadState(). So we must build
 * staticResources from the replay's cardsMaps before creating the engine.
 */

import {
  createMatchStaticResourcesFromCardsMaps,
  type CardsMaps,
  type LorcanaMatchState,
} from "@tcg/lorcana-engine";
import { getLorcanaCardCatalogSync } from "@tcg/lorcana-cards/cards/sync";
import {
  DEFAULT_DYNAMIC_CLOCK_CONFIG,
  LorcanaMultiplayerTestEngine,
} from "@tcg/lorcana-engine/testing";
import { HumanVsAiOrchestrator } from "../simulator-devtools/vs-ai/human-vs-ai-orchestrator.svelte.js";
import { remapPlayerIds } from "./remap-player-ids.js";

export interface ForkReplayInput {
  /** Game state at the fork point. */
  state: LorcanaMatchState;
  /** Card instance → public ID mappings from the replay. */
  cardsMaps: CardsMaps;
  /** The replay's original player IDs: [player1, player2]. */
  replayPlayerIds: [string, string];
  /** Which side the human wants to play. */
  humanSide: "playerOne" | "playerTwo";
  /** AI strategy ID. Defaults to the standard strategy. */
  strategyId?: string;
}

export interface ForkReplayResult {
  orchestrator: HumanVsAiOrchestrator;
  dispose: () => void;
}

/**
 * Creates a HumanVsAiOrchestrator initialized to the given replay state.
 *
 * The human always maps to `player_one` (engine canonical), so if the user
 * picks the replay's second player, we swap the mapping accordingly.
 */
export function forkReplayToLocalGame(input: ForkReplayInput): ForkReplayResult {
  const { state, cardsMaps, replayPlayerIds, humanSide, strategyId } = input;

  // Map replay IDs → engine canonical IDs.
  // Human side always becomes player_one so the orchestrator's mode resolution works.
  const humanReplayId = humanSide === "playerOne" ? replayPlayerIds[0] : replayPlayerIds[1];
  const aiReplayId = humanSide === "playerOne" ? replayPlayerIds[1] : replayPlayerIds[0];

  const remapped = remapPlayerIds({
    state,
    cardsMaps,
    sourceIds: [humanReplayId, aiReplayId],
    targetIds: ["player_one", "player_two"],
  });

  // Verify the state is playable (not terminal).
  if (remapped.state.ctx.status.gameEnded) {
    throw new Error("Cannot fork from a terminal game state");
  }

  // Build staticResources from the replay's cardsMaps so the engine recognizes
  // all card instance IDs in the loaded state.
  const cardCatalog = getLorcanaCardCatalogSync();
  const staticResources = createMatchStaticResourcesFromCardsMaps(
    remapped.cardsMaps,
    cardCatalog,
    {},
  );

  // Create engine with the replay's card instances, load the state, then connect clients.
  const testEngine = new LorcanaMultiplayerTestEngine(
    {
      seed: remapped.state.ctx.random.seed,
      staticResources,
      timeControl: { mode: "dynamic", config: DEFAULT_DYNAMIC_CLOCK_CONFIG },
    },
    {
      skipPreGame: true,
      validateSync: false,
    },
  );
  testEngine.loadState(remapped.state);
  testEngine.initializeSync();

  // Wrap in the AI orchestrator for step/auto mode control.
  const orchestrator = HumanVsAiOrchestrator.fromEngine(testEngine, {
    strategyId,
    initialAiPlayMode: "step",
    initialPerspective: "playerOne",
    gameId: `fork:${Date.now()}`,
  });

  return {
    orchestrator,
    dispose: () => orchestrator.dispose(),
  };
}
