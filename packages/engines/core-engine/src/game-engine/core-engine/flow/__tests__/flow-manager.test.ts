import { beforeEach, describe, expect, it, mock } from "bun:test";
import type {
  CoreEngineState,
  FnContext,
  GameDefinition,
} from "~/game-engine/core-engine/game-configuration";
import type { CoreCtx } from "~/game-engine/core-engine/state/context";
import { logger } from "../../utils";
import { FlowManager } from "../flow-manager";

// Mock game state interface
interface MockGameState {
  testData: string;
  playerCount: number;
}

describe("FlowManager - Turn Transitions", () => {
  let onBeginMocks: Record<string, any>;
  let endIfMocks: Record<string, any>;

  beforeEach(() => {
    onBeginMocks = {
      endOfTurn: mock((ctx) => {
        logger.log(">>>>>>>>> End of Turn Phase Mock");
        return ctx.G;
      }),
      ready: mock((ctx) => {
        logger.log(">>>>>>>>> Ready Phase Mock");
        return ctx.G;
      }),
      set: mock((ctx) => {
        logger.log(">>>>>>>>> Set Phase Mock");
        return ctx.G;
      }),
      draw: mock((ctx) => {
        logger.log(">>>>>>>>> Draw Phase Mock");
        return ctx.G;
      }),
    };

    endIfMocks = {
      mainPhase: mock(({ ctx }) => {
        const shouldEnd = ctx.numTurnMoves > 1; // Mimics Lorcana behavior - use numTurnMoves
        logger.log(
          `MainPhase endIf: numTurnMoves=${ctx.numTurnMoves}, shouldEnd=${shouldEnd}`,
        );
        return shouldEnd;
      }),
      autoAdvance: mock(() => true), // For phases that auto-advance
    };
  });

  const createMockCoreOps = (ctx: CoreCtx) =>
    ({
      state: createMockState(),
      engine: {},
      getCurrentTurnPlayer: mock(() => "player1"),
      getCtx: mock(() => ctx),
      getCardMeta: mock(() => ({})),
      setCardMeta: mock(),
      updateCardMeta: mock(),
      readyAllCards: mock(),
      processTurnStartEffects: mock(),
      clearDryingState: mock(),
      gainLoreFromLocations: mock(),
      processTurnStartTriggers: mock(),
      isFirstTurn: mock(() => false),
      drawCard: mock(),
      processEndOfTurnEffects: mock(),
    }) as any;

  const createMockState = (
    overrides: Partial<CoreEngineState<MockGameState>> = {},
  ): CoreEngineState<MockGameState> => ({
    G: { testData: "test", playerCount: 2 },
    _undo: [],
    _redo: [],
    _stateID: 0,
    ctx: {
      currentSegment: "duringGame",
      currentPhase: "mainPhase",
      currentStep: "idle",

      numMoves: 0, // Key: starts at 0
      numTurnMoves: 0, // Key: starts at 0
      numTurns: 0,
      playerOrder: ["player1", "player2"],
      turnPlayerPos: 0,
      priorityPlayerPos: 0,
      gameId: "test-game",
      matchId: "test-match",
      cards: {},
      cardMetas: {},
      moveHistory: [],
      players: {
        player1: { id: "player1", name: "Player 1" },
        player2: { id: "player2", name: "Player 2" },
      },
    },
    ...overrides,
  });

  const createMockFnContext = (
    state: CoreEngineState<MockGameState>,
  ): FnContext<MockGameState> => {
    const mockCoreOps = createMockCoreOps(state.ctx);
    return {
      G: state.G,
      ctx: state.ctx,
      coreOps: mockCoreOps,
      _getUpdatedState: mock(() => state),
    };
  };

  it("should NOT trigger phase transition when numMoves <= 1", () => {
    const gameDefinition: GameDefinition<MockGameState> = {
      moves: {},
      segments: {
        duringGame: {
          next: "endGame",
          turn: {
            phases: {
              mainPhase: {
                start: true,
                next: "endOfTurnPhase",
                endIf: endIfMocks.mainPhase, // Should return false when numMoves <= 1
              },
              endOfTurnPhase: {
                next: "beginningPhase",
                onBegin: onBeginMocks.endOfTurn,
                endIf: endIfMocks.autoAdvance,
              },
            },
          },
        },
      },
      flow: { turns: { phases: [] } },
    };

    const flowManager = new FlowManager(gameDefinition, {});

    // Test with numMoves = 1 (should NOT trigger transition)
    const initialState = createMockState({
      ctx: { ...createMockState().ctx, numMoves: 1 },
    });

    const fnContext = createMockFnContext(initialState);
    const result = flowManager.processFlowTransitions(initialState, fnContext);

    // Verify endIf was called and returned false
    expect(endIfMocks.mainPhase).toHaveBeenCalled();

    // Should stay in mainPhase
    expect(result.ctx.currentPhase).toBe("mainPhase");

    // Should NOT call endOfTurn onBegin hook
    expect(onBeginMocks.endOfTurn).not.toHaveBeenCalled();
  });

  it("should trigger full turn transition when numMoves > 1", () => {
    const gameDefinition: GameDefinition<MockGameState> = {
      segments: {
        duringGame: {
          next: "endGame",
          turn: {
            phases: {
              mainPhase: {
                start: true,
                next: "endOfTurnPhase",
                endIf: endIfMocks.mainPhase, // Should return true when numMoves > 1
              },
              endOfTurnPhase: {
                next: "beginningPhase",
                onBegin: onBeginMocks.endOfTurn,
                endIf: endIfMocks.autoAdvance,
              },
              beginningPhase: {
                next: "mainPhase",
                steps: {
                  readyStep: {
                    start: true,
                    next: "setStep",
                    onBegin: onBeginMocks.ready,
                    endIf: endIfMocks.autoAdvance,
                  },
                  setStep: {
                    next: "drawStep",
                    onBegin: onBeginMocks.set,
                    endIf: endIfMocks.autoAdvance,
                  },
                  drawStep: {
                    next: null,
                    onBegin: onBeginMocks.draw,
                    endIf: endIfMocks.autoAdvance,
                  },
                },
              },
            },
          },
        },
      },
    };

    const flowManager = new FlowManager(gameDefinition, {});

    // Test with numTurnMoves = 2 (should trigger transition)
    const initialState = createMockState({
      ctx: { ...createMockState().ctx, numTurnMoves: 2 },
    });

    const fnContext = createMockFnContext(initialState);
    const result = flowManager.processFlowTransitions(initialState, fnContext);

    // Verify the transition logic was triggered
    expect(endIfMocks.mainPhase).toHaveBeenCalled();

    // Should call endOfTurn onBegin hook
    expect(onBeginMocks.endOfTurn).toHaveBeenCalled();

    // Should advance through beginning phase steps
    expect(onBeginMocks.ready).toHaveBeenCalled();
    expect(onBeginMocks.set).toHaveBeenCalled();
    expect(onBeginMocks.draw).toHaveBeenCalled();

    // Should end up back in mainPhase after completing all steps
    expect(result.ctx.currentPhase).toBe("mainPhase");
  });

  it("should properly handle step transitions within phases", () => {
    const stepOnBeginMocks = {
      step1: mock((ctx) => ctx.G),
      step2: mock((ctx) => ctx.G),
    };

    const gameDefinition: GameDefinition<MockGameState> = {
      moves: {},
      segments: {
        testSegment: {
          next: null,
          turn: {
            phases: {
              testPhase: {
                start: true,
                next: null,
                steps: {
                  step1: {
                    start: true,
                    next: "step2",
                    onBegin: stepOnBeginMocks.step1,
                    endIf: () => true, // Auto-advance
                  },
                  step2: {
                    next: null,
                    onBegin: stepOnBeginMocks.step2,
                    endIf: () => true, // Auto-advance
                  },
                },
              },
            },
          },
        },
      },
      flow: { turns: { phases: [] } },
    };

    const flowManager = new FlowManager(gameDefinition, {});
    const initialState = createMockState({
      ctx: {
        ...createMockState().ctx,
        currentSegment: "testSegment",
        currentPhase: "testPhase",
        currentStep: "step1",
      },
    });

    const fnContext = createMockFnContext(initialState);
    const result = flowManager.processFlowTransitions(initialState, fnContext);

    // Should advance through both steps and call onBegin for step2
    expect(stepOnBeginMocks.step2).toHaveBeenCalled();

    // Should end up with no current step (phase complete)
    expect(result.ctx.currentStep).toBeNull();
  });
});
