import { FlowManager } from "~/game-engine/core-engine/flow/flow-manager";
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
import type { CoreCtx } from "~/game-engine/core-engine/state/context";
import { createCtx } from "~/game-engine/core-engine/state/context";
import type { GameCards } from "~/game-engine/core-engine/types";

type PlayerID = string;

// This class is responsible for turning a GameDefinition into a live object, it encapsulates it
// and provides a runtime interface to interact with the game state and moves.
export class CoreGameRuntime<GameState = unknown> {
  public readonly processedGame: GameRuntime<GameState>;
  public readonly initialState: CoreEngineState<GameState>;
  public readonly flowManager: FlowManager<GameState>;
  private readonly moveProcessor: MoveProcessor<GameState>;

  constructor({
    game,
    initialState,
    initialCoreCtx,
    cards,
    players,
    seed,
    debug = false,
  }: {
    game: GameDefinition<GameState>;
    initialState?: GameState;
    initialCoreCtx?: CoreCtx;
    players?: string[];
    cards: GameCards;
    seed?: string;
    debug: boolean;
  }) {
    // Process game definition with defaults
    const processedGameDef = this.processGameDefinition(game, seed);

    // Create FlowManager (consolidates Flow function logic)
    this.flowManager = new FlowManager<GameState>(
      processedGameDef,
      cards,
      players,
    );

    // Create initial context
    const ctx = createCtx({
      playerOrder: players || [],
      initialSegment: this.flowManager.startingSegment || undefined,
      initialPhase: this.flowManager.initialPhase || undefined,
      initialStep: this.flowManager.initialStep || undefined,
      cards,
      players: players?.reduce(
        (acc, player) => {
          acc[player] = { id: player, name: player, turnHistory: [] };
          return acc;
        },
        {} as Record<
          PlayerID,
          { id: PlayerID; name: string; turnHistory: unknown[] }
        >,
      ),
    });

    // Create initial game state
    const state: PartialGameState<GameState> = {
      G: (initialState || {}) as GameState,
      ctx: initialCoreCtx ? { ...ctx, ...initialCoreCtx } : ctx,
    };

    this.initialState = {
      ...state,
      _undo: processedGameDef.disableUndo
        ? []
        : [{ G: state.G, ctx: state.ctx }],
      _redo: [],
      _stateID: 0,
    };

    // Create processed game runtime
    this.processedGame = {
      ...processedGameDef,
      moveNames: this.flowManager.moveNames,
      flow: this.flowManager, // FlowManager replaces Flow function return
    } as GameRuntime<GameState>;

    this.moveProcessor = new MoveProcessor<GameState>(debug);
  }

  /**
   * Process game definition and set defaults (consolidates processGameDefinition)
   */
  private processGameDefinition(
    game: GameDefinition<GameState>,
    seed?: string,
  ): GameDefinition<GameState> {
    const processed = { ...game };

    if (seed) {
      processed.seed = seed;
    }

    // Set defaults
    if (processed.name === undefined) processed.name = "default";
    if (processed.deltaState === undefined) processed.deltaState = false;
    if (processed.disableUndo === undefined) processed.disableUndo = true;
    if (processed.moves === undefined) processed.moves = {};
    if (processed.playerView === undefined) processed.playerView = ({ G }) => G;

    if (processed.name.includes(" ")) {
      throw new Error(`${processed.name}: Game name must not include spaces`);
    }

    return processed;
  }

  processMove(request: MoveRequest, fnContext: FnContext<GameState>) {
    return this.moveProcessor.process(
      request,
      this.flowManager, // Pass FlowManager instead of Flow function return
      fnContext,
    );
  }
}
