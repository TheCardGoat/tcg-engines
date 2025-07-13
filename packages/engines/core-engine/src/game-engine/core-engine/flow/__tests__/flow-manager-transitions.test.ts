import { describe, expect, it } from "bun:test";
import { LogCollector } from "../../../utils/log-collector";
import type { CoreEngineState, GameDefinition } from "../../game-configuration";
import type { FlowConfiguration } from "../flow-manager";
import { FlowManager } from "../flow-manager";

describe("FlowManager Transitions", () => {
  // Test state setup helper
  const createTestState = (
    segment: string | null = null,
    phase: string | null = null,
  ): CoreEngineState<any> => ({
    G: {},
    ctx: {
      playerOrder: ["0", "1"],
      turnPlayerPos: 0,
      priorityPlayerPos: 0,
      numTurns: 1,
      numTurnMoves: 0,
      currentPhase: phase,
      currentStep: null,
      currentSegment: segment,
      cards: {} as any,
      _random: { seed: "test" },
      seed: "test",
      numMoves: 0,
      seenCards: new Map(),
    },
    _stateID: 0,
    _undo: [],
    _redo: [],
  });

  // Mock game definition with segment configurations
  const createMockGameDefinition = (): GameDefinition<any> => ({
    segments: {
      startingAGameSegment: {
        start: true,
        next: "duringGame",
        endIf: () => {
          return true;
        },
        turn: {}, // Add empty turn object
      },
      duringGame: {
        next: "endGame",
        turn: {
          phases: {
            beginningPhase: {
              start: true,
              next: "mainPhase",
              endIf: () => {
                // This is the problematic immediate transition
                return true;
              },
              steps: {
                ready: {},
                set: {},
                draw: {},
              },
            },
            mainPhase: {
              next: "endOfTurnPhase",
              moves: {
                playCard: ({ G }) => G,
                quest: ({ G }) => G,
              },
            },
            endOfTurnPhase: {
              next: null,
            },
          },
        },
      },
    },
  });

  const createTestFlowManager = (): FlowManager<any> => {
    const config: FlowConfiguration = {
      turns: {
        phases: [
          {
            id: "main",
            name: "Main Phase",
            allowsPriorityPassing: true,
          },
        ],
      },
      priority: {
        initialPriority: "turnPlayer",
        allowPriorityPassing: {
          main: true,
        },
      },
    };

    const gameDefinition = createMockGameDefinition();
    const logCollector = new LogCollector();
    return new FlowManager(config, gameDefinition, null, logCollector);
  };

  describe("Segment to Segment Transitions", () => {
    it("should transition from startingAGameSegment to duringGame and cascade through immediate phase transitions", () => {
      const flowManager = createTestFlowManager();
      const initialState = createTestState("startingAGameSegment", null);

      const result = flowManager.processFlowTransitions(initialState);

      // Should have transitioned to duringGame segment
      expect(result.ctx.currentSegment).toBe("duringGame");

      // Should have cascaded through beginningPhase (immediate transition) to mainPhase
      expect(result.ctx.currentPhase).toBe("mainPhase");
    });

    it("should handle immediate phase transitions within a segment", () => {
      const flowManager = createTestFlowManager();

      // Start with duringGame segment and beginningPhase
      const initialState = createTestState("duringGame", "beginningPhase");

      const result = flowManager.processFlowTransitions(initialState);

      // Should have transitioned from beginningPhase to mainPhase
      // because beginningPhase has endIf: () => true
      expect(result.ctx.currentSegment).toBe("duringGame");
      expect(result.ctx.currentPhase).toBe("mainPhase");
    });

    it("should handle cascading transitions from segment to phase in one call", () => {
      const flowManager = createTestFlowManager();

      // Start with startingAGameSegment (which should end immediately)
      const initialState = createTestState("startingAGameSegment", null);

      const result = flowManager.processFlowTransitions(initialState);

      // Should have:
      // 1. Transitioned from startingAGameSegment to duringGame
      // 2. Initialized beginningPhase for duringGame
      // 3. Immediately transitioned from beginningPhase to mainPhase
      expect(result.ctx.currentSegment).toBe("duringGame");
      expect(result.ctx.currentPhase).toBe("mainPhase");
    });

    it("should not create infinite loops with maxIterations limit", () => {
      const flowManager = createTestFlowManager();
      const initialState = createTestState("startingAGameSegment", null);

      // The method should complete without throwing even with immediate transitions
      expect(() =>
        flowManager.processFlowTransitions(initialState),
      ).not.toThrow();

      const result = flowManager.processFlowTransitions(initialState);

      // Should reach a stable state
      expect(result.ctx.currentSegment).toBe("duringGame");
      expect(result.ctx.currentPhase).toBe("mainPhase");
    });
  });

  describe("Phase Initialization Logic", () => {
    it("should initialize starting phase when segment has no current phase and handle immediate transitions", () => {
      const flowManager = createTestFlowManager();

      // State with duringGame segment but no phase
      const initialState = createTestState("duringGame", null);

      const result = flowManager.processFlowTransitions(initialState);

      // Should initialize beginningPhase as the starting phase, then immediately transition to mainPhase
      expect(result.ctx.currentPhase).toBe("mainPhase");
    });

    it("should not change phase if already set and not ending", () => {
      // Create a mock game definition where beginningPhase doesn't end immediately
      const mockGameDef: GameDefinition<any> = {
        segments: {
          duringGame: {
            next: "endGame",
            turn: {
              phases: {
                beginningPhase: {
                  start: true,
                  next: "mainPhase",
                  endIf: () => false, // Phase doesn't end immediately
                },
                mainPhase: {
                  next: "endOfTurnPhase",
                },
              },
            },
          },
        },
      };

      const config: FlowConfiguration = {
        turns: { phases: [] },
        priority: { initialPriority: "turnPlayer" },
      };

      const logCollector = new LogCollector();
      const flowManager = new FlowManager(
        config,
        mockGameDef,
        null,
        logCollector,
      );
      const initialState = createTestState("duringGame", "beginningPhase");

      const result = flowManager.processFlowTransitions(initialState);

      // Should stay in beginningPhase since endIf returns false
      expect(result.ctx.currentPhase).toBe("beginningPhase");
    });

    it("should handle missing segment configuration gracefully", () => {
      const config: FlowConfiguration = {
        turns: { phases: [] },
        priority: { initialPriority: "turnPlayer" },
      };

      const gameDefinition: GameDefinition<any> = {
        segments: {
          // Empty segments
        },
      };

      const logCollector = new LogCollector();
      const flowManager = new FlowManager(
        config,
        gameDefinition,
        null,
        logCollector,
      );
      const initialState = createTestState("unknownSegment", null);

      // Should not throw and return state unchanged
      expect(() =>
        flowManager.processFlowTransitions(initialState),
      ).not.toThrow();

      const result = flowManager.processFlowTransitions(initialState);
      expect(result.ctx.currentSegment).toBe("unknownSegment");
      expect(result.ctx.currentPhase).toBe(null);
    });
  });

  describe("Complex Flow Scenarios", () => {
    it("should handle multiple phase transitions in sequence", () => {
      // Create a game definition with multiple immediate transitions
      const mockGameDef: GameDefinition<any> = {
        segments: {
          duringGame: {
            turn: {
              phases: {
                phase1: {
                  start: true,
                  next: "phase2",
                  endIf: () => true, // Immediate transition
                },
                phase2: {
                  next: "phase3",
                  endIf: () => true, // Immediate transition
                },
                phase3: {
                  next: "phase4",
                  endIf: () => false, // Final phase, doesn't transition
                },
              },
            },
          },
        },
      };

      const config: FlowConfiguration = {
        turns: { phases: [] },
        priority: { initialPriority: "turnPlayer" },
      };

      const logCollector = new LogCollector();
      const flowManager = new FlowManager(
        config,
        mockGameDef,
        null,
        logCollector,
      );
      const initialState = createTestState("duringGame", null);

      const result = flowManager.processFlowTransitions(initialState);

      // Should cascade through phase1 -> phase2 -> phase3 and stop at phase3
      expect(result.ctx.currentPhase).toBe("phase3");
    });

    it("should respect the maxIterations limit to prevent infinite loops", () => {
      // Create a potentially infinite loop scenario
      const mockGameDef: GameDefinition<any> = {
        segments: {
          duringGame: {
            turn: {
              phases: {
                phase1: {
                  start: true,
                  next: "phase2",
                  endIf: () => true,
                },
                phase2: {
                  next: "phase1", // Back to phase1 - potential infinite loop
                  endIf: () => true,
                },
              },
            },
          },
        },
      };

      const config: FlowConfiguration = {
        turns: { phases: [] },
        priority: { initialPriority: "turnPlayer" },
      };

      const logCollector = new LogCollector();
      const flowManager = new FlowManager(
        config,
        mockGameDef,
        null,
        logCollector,
      );
      const initialState = createTestState("duringGame", null);

      // Should not hang or throw - maxIterations should prevent infinite loop
      expect(() =>
        flowManager.processFlowTransitions(initialState),
      ).not.toThrow();

      const result = flowManager.processFlowTransitions(initialState);

      // Should have stopped due to maxIterations, result should be defined
      expect(result).toBeDefined();
      expect(result.ctx.currentSegment).toBe("duringGame");
    });
  });
});
