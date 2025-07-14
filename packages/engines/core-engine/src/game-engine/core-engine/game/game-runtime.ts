import type { CoreEngine } from "~/game-engine/core-engine/engine/core-engine";
import { CoreOperation } from "~/game-engine/core-engine/engine/core-operation";
import type { ActionPayload } from "~/game-engine/core-engine/engine/types";
import type {
  CoreEngineState,
  FnContext,
  GameDefinition,
  GameRuntime,
  PartialGameState,
} from "~/game-engine/core-engine/game-configuration";
import {
  MoveProcessor,
  type MoveRequest,
} from "~/game-engine/core-engine/move/move-processor";
import type { InvalidMoveResult } from "~/game-engine/core-engine/move/move-types";
import {
  getExecuteFunction,
  isInvalidMove,
} from "~/game-engine/core-engine/move/move-types";
import type { CoreCtx } from "~/game-engine/core-engine/state/context";
import type { GameCards } from "~/game-engine/core-engine/types";
import { Flow } from "./flow";

// This class is responsible for turning a GameDefinition into a live object, it encapsulates it
// and provides a runtime interface to interact with the game state and moves.
export class CoreGameRuntime<GameState = unknown> {
  game: GameDefinition;
  processedGame: GameRuntime<GameState>;
  initialState: CoreEngineState<GameState>;
  moveProcessor: MoveProcessor<GameState>;

  constructor({
    game,
    initialState,
    initialCoreCtx,
    cards,
    players,
    seed,
    engine,
    debug = false,
  }: {
    game: GameDefinition;
    initialState?: GameState;
    initialCoreCtx?: CoreCtx;
    players?: string[];
    cards: GameCards;
    seed?: string;
    engine: CoreEngine;
    debug: boolean;
  }) {
    const result = initializeGame<GameState>({
      game,
      initialState,
      initialCoreCtx,
      cards,
      players,
      seed,
      engine,
    });

    this.game = result.processedGame;
    this.initialState = result.initialState;
    this.processedGame = result.processedGame;

    // Create move processor with reference to this engine
    this.moveProcessor = new MoveProcessor<GameState>(debug);
  }

  processMove(
    request: MoveRequest,
    _: CoreEngineState<GameState>,
    fnContext: FnContext<GameState>,
  ) {
    return this.moveProcessor.process(
      request,
      this.processedGame.flow,
      fnContext,
    );
  }
}

export function initializeGame<GameState = unknown>({
  game,
  initialState,
  initialCoreCtx,
  cards,
  players,
  seed,
  engine,
}: {
  game: GameDefinition;
  initialState?: GameState;
  initialCoreCtx?: CoreCtx;
  players?: string[];
  cards: GameCards;
  seed?: string;
  engine?: CoreEngine;
}): {
  initialState: CoreEngineState<GameState>;
  processedGame: GameRuntime<GameState>;
} {
  const gameRuntime = processGameDefinition(
    seed ? { ...game, seed } : game,
    cards,
    players,
  );

  const ctx: CoreCtx = gameRuntime.flow.ctx;

  const state: PartialGameState<GameState> = {
    // User managed state.
    G: {} as GameState,
    // Framework managed state.
    ctx,
  };

  if (initialState) {
    state.G = initialState;
  }

  if (initialCoreCtx) {
    state.ctx = {
      ...ctx,
      ...initialCoreCtx,
    };
  }

  const initial: CoreEngineState<GameState> = {
    ...state,
    _undo: [],
    _redo: [],
    _stateID: 0,
  };

  if (!game.disableUndo) {
    initial._undo = [
      {
        G: initial.G as GameState,
        ctx: initial.ctx,
      },
    ];
  }

  return {
    initialState: initial,
    processedGame: gameRuntime as GameRuntime<GameState>,
  };
}

export function isProcessed(
  game: GameDefinition | GameRuntime,
): game is GameRuntime {
  return "processMove" in game;
}

/**
 * Helper to generate the game move reducer. The returned
 * reducer has the following signature:
 *
 * (G, action, ctx) => {}
 *
 * You can roll your own if you like, or use any Redux
 * addon to generate such a reducer.
 *
 * The convention used in this framework is to
 * have action.type contain the name of the move, and
 * action.args contain any additional arguments as an
 * Array.
 */
export function processGameDefinition<G = unknown>(
  game: GameDefinition | GameRuntime,
  cards: GameCards,
  players?: string[],
): GameRuntime {
  // The Game() function has already been called on this
  // config object, so just pass it through.
  if (isProcessed(game)) {
    return game;
  }

  if (game.name === undefined) game.name = "default";
  if (game.deltaState === undefined) game.deltaState = false;
  if (game.disableUndo === undefined) game.disableUndo = true;
  if (game.moves === undefined) game.moves = {};
  if (game.playerView === undefined) game.playerView = ({ G }) => G;
  if (game.name.includes(" ")) {
    throw new Error(`${game.name}: Game name must not include spaces`);
  }

  const flow = Flow(game, cards, players);

  const processedGame: GameRuntime = {
    ...game,
    moveNames: flow.moveNames as string[],
    flow,
  } as GameRuntime;

  return processedGame;
}
