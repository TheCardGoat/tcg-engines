import { mock } from "bun:test";
import type {
  CoreEngineState,
  FnContext,
  GameDefinition,
} from "~/game-engine/core-engine/game-configuration";
import type { Move } from "~/game-engine/core-engine/move/move-types";
import type { CoreCtx } from "~/game-engine/core-engine/state/context";

// Mock game state interface for testing
export interface TestGameState {
  testData: string;
  playerCount: number;
  combatInitiated?: boolean;
  turnEnded?: boolean;
  gameOver?: boolean;
  pendingMulligan?: Set<string>;
  championSelected?: Record<string, boolean>;
  allPlayersPassed?: boolean;
  timeoutReached?: boolean;
  playerPassedTurn?: boolean;
}

// Hook tracking utilities
export interface MockHookSet {
  onBegin: Record<string, any>;
  onEnd: Record<string, any>;
  endIf: Record<string, any>;
}

export const createMockHooks = (): MockHookSet => ({
  onBegin: {},
  onEnd: {},
  endIf: {},
});

export const createSpyHook = (name: string, returnValue?: any) => {
  return mock((ctx: FnContext<TestGameState>) => {
    console.log(`Hook ${name} called`);
    return returnValue !== undefined ? returnValue : ctx.G;
  });
};

export const createSpyEndIf = (name: string, returnValue: boolean) => {
  return mock(() => {
    console.log(`EndIf ${name} called, returning: ${returnValue}`);
    return returnValue;
  });
};

// Core operations mock
export const createMockCoreOps = (ctx?: CoreCtx) => ({
  getCurrentTurnPlayer: mock(() => "player1"),
  getCtx: mock(() => ctx || createMockState().ctx),
  getPlayers: mock(() => ["player1", "player2"]),
  readyAllCards: mock(),
  processTurnStartEffects: mock(),
  clearDryingState: mock(),
  gainLoreFromLocations: mock(),
  processTurnStartTriggers: mock(),
  isFirstTurn: mock(() => false),
  drawCard: mock(),
  processEndOfTurnEffects: mock(),
  shuffleAllDecks: mock(),
  setPendingChampionSelection: mock(),
  setAllCardsActive: mock(),
});

// State creation utilities
export const createMockState = (
  overrides: Partial<CoreEngineState<TestGameState>> = {},
): CoreEngineState<TestGameState> => ({
  G: { testData: "test", playerCount: 2, ...overrides.G },
  ctx: {
    gameId: "test-game",
    matchId: "test-match",
    playerOrder: ["player1", "player2"],
    turnPlayerPos: 0,
    priorityPlayerPos: 0,
    numTurns: 0,
    numMoves: 0,
    numTurnMoves: 0,
    currentSegment: "duringGame",
    currentPhase: "mainPhase",
    currentStep: null,
    moveHistory: [],
    cards: {},
    players: {
      player1: { id: "player1", name: "Player 1" },
      player2: { id: "player2", name: "Player 2" },
    },
    ...overrides.ctx,
  },
  ...overrides,
});

export const createMockFnContext = (
  state: CoreEngineState<TestGameState>,
  overrides: Partial<FnContext<TestGameState>> = {},
): FnContext<TestGameState> => {
  const mockCoreOps = createMockCoreOps(state.ctx);
  return {
    G: state.G,
    ctx: state.ctx,
    coreOps: mockCoreOps,
    _getUpdatedState: mock(() => state),
    ...overrides,
  };
};

// Mock move definitions
export const mockMoves = {
  globalMove: mock((ctx: FnContext<TestGameState>) => ctx.G),
  segmentMove: mock((ctx: FnContext<TestGameState>) => ctx.G),
  phaseMove: mock((ctx: FnContext<TestGameState>) => ctx.G),
  stepMove: mock((ctx: FnContext<TestGameState>) => ctx.G),
  passTurn: mock((ctx: FnContext<TestGameState>) => ({
    ...ctx.G,
    turnEnded: true,
  })),
  concede: mock((ctx: FnContext<TestGameState>) => ({
    ...ctx.G,
    gameOver: true,
  })),
  keepHand: mock((ctx: FnContext<TestGameState>) => ctx.G),
  mulligan: mock((ctx: FnContext<TestGameState>) => ctx.G),
};

// Pre-configured game definitions
export const MockConfigurations = {
  // Basic two-player game
  twoPlayerGame: (hooks: MockHookSet): GameDefinition<TestGameState> => ({
    moves: {
      globalMove: mockMoves.globalMove,
      concede: mockMoves.concede,
    },
    segments: {
      setup: {
        next: "duringGame",
        onBegin: hooks.onBegin.setupSegment || createSpyHook("setupSegment"),
        onEnd: hooks.onEnd.setupSegment || createSpyHook("setupSegment"),
        endIf: hooks.endIf.setupSegment || createSpyEndIf("setupSegment", true),
        turn: {
          moves: {
            segmentMove: mockMoves.segmentMove,
          },
          phases: {
            setupPhase: {
              start: true,
              next: null,
              onBegin: hooks.onBegin.setupPhase || createSpyHook("setupPhase"),
              endIf:
                hooks.endIf.setupPhase || createSpyEndIf("setupPhase", true),
            },
          },
        },
      },
      duringGame: {
        next: "endGame",
        endIf: hooks.endIf.duringGame || createSpyEndIf("duringGame", false),
        turn: {
          phases: {
            mainPhase: {
              start: true,
              next: "endPhase",
              moves: {
                phaseMove: mockMoves.phaseMove,
                passTurn: mockMoves.passTurn,
              },
              endIf:
                hooks.endIf.mainPhase || createSpyEndIf("mainPhase", false),
            },
            endPhase: {
              next: null,
              onBegin: hooks.onBegin.endPhase || createSpyHook("endPhase"),
              endIf: hooks.endIf.endPhase || createSpyEndIf("endPhase", true),
            },
          },
        },
      },
      endGame: {
        next: null,
        onBegin: hooks.onBegin.endGame || createSpyHook("endGame"),
      },
    },
    flow: { turns: { phases: [] } },
  }),

  // Four-player game with complex turns
  fourPlayerGame: (hooks: MockHookSet): GameDefinition<TestGameState> => ({
    moves: {
      globalMove: mockMoves.globalMove,
    },
    segments: {
      duringGame: {
        next: null,
        turn: {
          phases: {
            mainPhase: {
              start: true,
              next: "endPhase",
              endIf:
                hooks.endIf.mainPhase || createSpyEndIf("mainPhase", false),
            },
            endPhase: {
              next: null,
              endIf: hooks.endIf.endPhase || createSpyEndIf("endPhase", true),
            },
          },
        },
      },
    },
    flow: { turns: { phases: [] } },
  }),

  // Alpha Clash expansion phase pattern
  alphaClashExpansion: (hooks: MockHookSet): GameDefinition<TestGameState> => ({
    moves: {},
    segments: {
      duringGame: {
        next: null,
        turn: {
          phases: {
            startOfTurn: {
              start: true,
              next: "expansion",
              onBegin:
                hooks.onBegin.startOfTurn || createSpyHook("startOfTurn"),
              endIf:
                hooks.endIf.startOfTurn || createSpyEndIf("startOfTurn", true),
            },
            expansion: {
              next: "primary",
              steps: {
                readyStep: {
                  start: true,
                  next: "drawStep",
                  onBegin:
                    hooks.onBegin.readyStep || createSpyHook("readyStep"),
                  endIf:
                    hooks.endIf.readyStep || createSpyEndIf("readyStep", true),
                },
                drawStep: {
                  next: "resourceStep",
                  onBegin: hooks.onBegin.drawStep || createSpyHook("drawStep"),
                  endIf:
                    hooks.endIf.drawStep || createSpyEndIf("drawStep", true),
                },
                resourceStep: {
                  next: null,
                  onBegin:
                    hooks.onBegin.resourceStep || createSpyHook("resourceStep"),
                  endIf:
                    hooks.endIf.resourceStep ||
                    createSpyEndIf("resourceStep", true),
                  moves: {
                    stepMove: mockMoves.stepMove,
                  },
                },
              },
            },
            primary: {
              next: ({ G }: FnContext<TestGameState>) =>
                G.combatInitiated ? "clash" : "endOfTurn",
              moves: {
                phaseMove: mockMoves.phaseMove,
              },
              endIf: hooks.endIf.primary || createSpyEndIf("primary", false),
            },
            clash: {
              next: "primary",
              steps: {
                attackStep: {
                  start: true,
                  next: "damageStep",
                  endIf: createSpyEndIf("attackStep", true),
                },
                damageStep: {
                  next: null,
                  endIf: createSpyEndIf("damageStep", true),
                },
              },
            },
            endOfTurn: {
              next: null,
              endIf: hooks.endIf.endOfTurn || createSpyEndIf("endOfTurn", true),
            },
          },
        },
      },
    },
    flow: { turns: { phases: [] } },
  }),

  // Grand Archive multiplayer setup
  grandArchiveSetup: (hooks: MockHookSet): GameDefinition<TestGameState> => ({
    moves: {},
    segments: {
      startingAGame: {
        next: "duringGame",
        turn: {
          phases: {
            chooseFirstPlayer: {
              start: true,
              next: "chooseChampions",
              endIf: ({ ctx }: FnContext<TestGameState>) =>
                ctx.currentPlayer !== undefined,
            },
            chooseChampions: {
              next: "mulligan",
              onBegin:
                hooks.onBegin.chooseChampions ||
                createSpyHook("chooseChampions"),
              endIf: ({ G }: FnContext<TestGameState>) => {
                return (
                  G.championSelected &&
                  Object.keys(G.championSelected).length === G.playerCount
                );
              },
            },
            mulligan: {
              next: null,
              endIf: ({ G }: FnContext<TestGameState>) =>
                !G.pendingMulligan || G.pendingMulligan.size === 0,
              moves: {
                keepHand: mockMoves.keepHand,
                mulligan: mockMoves.mulligan,
              },
            },
          },
        },
      },
      duringGame: {
        next: null,
        turn: {
          phases: {
            mainPhase: {
              start: true,
              next: null,
              endIf: createSpyEndIf("mainPhase", false),
            },
          },
        },
      },
    },
    flow: { turns: { phases: [] } },
  }),

  // Priority window example
  combatPhaseFlow: (hooks: MockHookSet): GameDefinition<TestGameState> => ({
    moves: {},
    segments: {
      duringGame: {
        next: null,
        turn: {
          phases: {
            mainPhase: {
              start: true,
              next: "combatPhase",
              endIf: ({ G }: FnContext<TestGameState>) =>
                G.combatInitiated === true,
            },
            combatPhase: {
              next: "mainPhase",
              steps: {
                priorityWindow: {
                  start: true,
                  next: null,
                  endIf: ({ G }: FnContext<TestGameState>) =>
                    G.allPlayersPassed === true,
                  moves: {
                    stepMove: mockMoves.stepMove,
                  },
                },
              },
            },
          },
        },
      },
    },
    flow: { turns: { phases: [] } },
  }),

  // Edge case: Phase loop
  infiniteLoop: (hooks: MockHookSet): GameDefinition<TestGameState> => ({
    moves: {},
    segments: {
      duringGame: {
        next: null,
        turn: {
          phases: {
            loopPhase: {
              start: true,
              next: "loopPhase", // Points to itself
              endIf:
                hooks.endIf.loopPhase || createSpyEndIf("loopPhase", false),
            },
          },
        },
      },
    },
    flow: { turns: { phases: [] } },
  }),

  // Edge case: Missing configurations
  missingConfigs: (): GameDefinition<TestGameState> => ({
    moves: {},
    segments: {
      duringGame: {
        next: null,
        turn: {
          phases: {
            mainPhase: {
              start: true,
              next: "missingPhase", // Phase doesn't exist
              endIf: createSpyEndIf("mainPhase", true),
            },
          },
        },
      },
    },
    flow: { turns: { phases: [] } },
  }),

  // allowAnyPlayerToAct example
  anyPlayerPhase: (hooks: MockHookSet): GameDefinition<TestGameState> => ({
    moves: {},
    segments: {
      duringGame: {
        next: null,
        turn: {
          phases: {
            openPhase: {
              start: true,
              next: null,
              allowAnyPlayerToAct: true,
              endIf:
                hooks.endIf.openPhase || createSpyEndIf("openPhase", false),
              moves: {
                phaseMove: mockMoves.phaseMove,
              },
            },
          },
        },
      },
    },
    flow: { turns: { phases: [] } },
  }),
};

// Game state presets
export const MockGameStates = {
  initial: (playerCount = 2): CoreEngineState<TestGameState> =>
    createMockState({
      G: { testData: "initial", playerCount },
      ctx: {
        currentSegment: "setup",
        currentPhase: "setupPhase",
        currentStep: null,
        numMoves: 0,
        numTurns: 0,
        numTurnMoves: 0,
        playerOrder:
          playerCount === 2
            ? ["player1", "player2"]
            : ["player1", "player2", "player3", "player4"],
        turnPlayerPos: 0,
        priorityPlayerPos: 0,
        players: {
          player1: { id: "player1", name: "Player 1" },
          player2: { id: "player2", name: "Player 2" },
          ...(playerCount > 2 && {
            player3: { id: "player3", name: "Player 3" },
          }),
          ...(playerCount > 3 && {
            player4: { id: "player4", name: "Player 4" },
          }),
        },
        gameId: "test-game",
        matchId: "test-match",
        cards: {},
        moveHistory: [],
      },
    }),

  midGame: (playerCount = 2): CoreEngineState<TestGameState> =>
    createMockState({
      G: { testData: "midGame", playerCount },
      ctx: {
        currentSegment: "duringGame",
        currentPhase: "mainPhase",
        currentStep: null,
        numMoves: 10,
        numTurns: 5,
        numTurnMoves: 2,
        playerOrder:
          playerCount === 2
            ? ["player1", "player2"]
            : ["player1", "player2", "player3", "player4"],
        turnPlayerPos: 1,
        priorityPlayerPos: 1,
        players: {
          player1: { id: "player1", name: "Player 1" },
          player2: { id: "player2", name: "Player 2" },
          ...(playerCount > 2 && {
            player3: { id: "player3", name: "Player 3" },
          }),
          ...(playerCount > 3 && {
            player4: { id: "player4", name: "Player 4" },
          }),
        },
        gameId: "test-game",
        matchId: "test-match",
        cards: {},
        moveHistory: [],
      },
    }),

  endGame: (playerCount = 2): CoreEngineState<TestGameState> =>
    createMockState({
      G: { testData: "endGame", playerCount, gameOver: true },
      ctx: {
        currentSegment: "endGame",
        currentPhase: null,
        currentStep: null,
        numMoves: 50,
        numTurns: 25,
        numTurnMoves: 0,
        playerOrder:
          playerCount === 2
            ? ["player1", "player2"]
            : ["player1", "player2", "player3", "player4"],
        turnPlayerPos: 0,
        priorityPlayerPos: 0,
        players: {
          player1: { id: "player1", name: "Player 1" },
          player2: { id: "player2", name: "Player 2" },
          ...(playerCount > 2 && {
            player3: { id: "player3", name: "Player 3" },
          }),
          ...(playerCount > 3 && {
            player4: { id: "player4", name: "Player 4" },
          }),
        },
        gameId: "test-game",
        matchId: "test-match",
        cards: {},
        moveHistory: [],
        gameOver: true,
      },
    }),

  withSteps: (): CoreEngineState<TestGameState> =>
    createMockState({
      G: { testData: "withSteps", playerCount: 2 },
      ctx: {
        currentSegment: "duringGame",
        currentPhase: "expansion",
        currentStep: "readyStep",
        numMoves: 1,
        numTurns: 0,
        numTurnMoves: 1,
        playerOrder: ["player1", "player2"],
        turnPlayerPos: 0,
        priorityPlayerPos: 0,
        players: {
          player1: { id: "player1", name: "Player 1" },
          player2: { id: "player2", name: "Player 2" },
        },
        gameId: "test-game",
        matchId: "test-match",
        cards: {},
        moveHistory: [],
      },
    }),
};

// Test assertion helpers
export const TestAssertions = {
  verifyHookCalled: (hookSpy: any, times = 1) => {
    expect(hookSpy).toHaveBeenCalledTimes(times);
  },

  verifyHookNotCalled: (hookSpy: any) => {
    expect(hookSpy).not.toHaveBeenCalled();
  },

  verifyStateTransition: (
    before: CoreEngineState<TestGameState>,
    after: CoreEngineState<TestGameState>,
    expectedChanges: {
      segment?: string;
      phase?: string;
      step?: string | null;
      turn?: number;
      currentPlayer?: string;
    },
  ) => {
    if (expectedChanges.segment !== undefined) {
      expect(after.ctx.currentSegment).toBe(expectedChanges.segment);
    }
    if (expectedChanges.phase !== undefined) {
      expect(after.ctx.currentPhase).toBe(expectedChanges.phase);
    }
    if (expectedChanges.step !== undefined) {
      expect(after.ctx.currentStep).toBe(expectedChanges.step);
    }
    if (expectedChanges.turn !== undefined) {
      expect(after.ctx.turn).toBe(expectedChanges.turn);
    }
    if (expectedChanges.currentPlayer !== undefined) {
      expect(after.ctx.currentPlayer).toBe(expectedChanges.currentPlayer);
    }
  },

  verifyHookExecutionOrder: (...hooks: any[]) => {
    for (let i = 1; i < hooks.length; i++) {
      expect(hooks[i - 1]).toHaveBeenCalledBefore(hooks[i]);
    }
  },
};

// Utility to create test scenarios
export const createTestScenario = (
  name: string,
  configName: keyof typeof MockConfigurations,
  initialState?: () => CoreEngineState<TestGameState>,
  customHooks?: Partial<MockHookSet>,
) => ({
  name,
  getGameDefinition: () => {
    const hooks = createMockHooks();
    if (customHooks) {
      Object.assign(hooks, customHooks);
    }
    return MockConfigurations[configName](hooks);
  },
  getInitialState: initialState || MockGameStates.initial,
  hooks: customHooks || createMockHooks(),
});
