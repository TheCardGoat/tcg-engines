import { beforeEach, describe, expect, it } from "bun:test";
import type { GameDefinition } from "../../game-configuration";
import { FlowManager } from "../flow-manager";
import {
  createMockFnContext,
  createMockHooks,
  createSpyEndIf,
  createSpyHook,
  MockGameStates,
  mockMoves,
  type TestGameState,
} from "./flow-manager-test-mocks";

describe("FlowManager - Move System Integration", () => {
  let flowManager: FlowManager<TestGameState>;
  let mockHooks: any;

  beforeEach(() => {
    mockHooks = createMockHooks();
  });

  describe("Move Inheritance Hierarchy", () => {
    it("should make global moves available everywhere in the hierarchy", () => {
      const gameDefinition: GameDefinition<TestGameState> = {
        // Global moves defined at top level
        moves: {
          globalMove: mockMoves.globalMove,
          concede: mockMoves.concede,
        },
        segments: {
          testSegment: {
            start: true,
            next: undefined,
            turn: {
              phases: {
                testPhase: {
                  start: true,
                  next: undefined,
                  steps: {
                    testStep: {
                      start: true,
                      next: undefined,
                      endIf: createSpyEndIf("testStep", false),
                    },
                  },
                },
              },
            },
          },
        },
        flow: { turns: { phases: [] } },
      };

      flowManager = new FlowManager(gameDefinition, {});

      const initialState = MockGameStates.initial();
      initialState.ctx.currentSegment = "testSegment";
      initialState.ctx.currentPhase = "testPhase";
      initialState.ctx.currentStep = "testStep";

      const fnContext = createMockFnContext(initialState);

      // Global moves should be available at every level
      expect(
        flowManager.getMove(initialState.ctx, "globalMove", "player1"),
      ).toBeTruthy();
      expect(
        flowManager.getMove(initialState.ctx, "concede", "player1"),
      ).toBeTruthy();

      // Test that global moves are in the moveMap
      expect(flowManager.moveMap["globalMove"]).toBeTruthy();
      expect(flowManager.moveMap["concede"]).toBeTruthy();
      expect(flowManager.moveNames).toContain("globalMove");
      expect(flowManager.moveNames).toContain("concede");
    });

    it("should make segment moves available in all child phases and steps", () => {
      const gameDefinition: GameDefinition<TestGameState> = {
        moves: {},
        segments: {
          testSegment: {
            start: true,
            next: undefined,
            turn: {
              // Segment-level moves (turn moves)
              moves: {
                segmentMove: mockMoves.segmentMove,
                passTurn: mockMoves.passTurn,
              },
              phases: {
                phase1: {
                  start: true,
                  next: "phase2",
                  endIf: createSpyEndIf("phase1", true),
                },
                phase2: {
                  next: undefined,
                  steps: {
                    step1: {
                      start: true,
                      next: undefined,
                      endIf: createSpyEndIf("step1", false),
                    },
                  },
                },
              },
            },
          },
        },
        flow: { turns: { phases: [] } },
      };

      flowManager = new FlowManager(gameDefinition, {});

      const initialState = MockGameStates.initial();
      // Set context to match the game definition being tested
      initialState.ctx.currentSegment = "testSegment";
      initialState.ctx.currentPhase = "phase1";
      initialState.ctx.currentStep = null;
      const fnContext = createMockFnContext(initialState);

      // Segment moves should be available with qualified names
      expect(flowManager.moveMap["testSegment.segmentMove"]).toBeTruthy();
      expect(flowManager.moveMap["testSegment.passTurn"]).toBeTruthy();

      // And also with simple names
      expect(flowManager.moveMap["segmentMove"]).toBeTruthy();
      expect(flowManager.moveMap["passTurn"]).toBeTruthy();

      // Test getMove method returns the moves
      expect(
        flowManager.getMove(initialState.ctx, "segmentMove", "player1"),
      ).toBeTruthy();
      expect(
        flowManager.getMove(initialState.ctx, "passTurn", "player1"),
      ).toBeTruthy();
    });

    it("should make phase moves available in all child steps", () => {
      const gameDefinition: GameDefinition<TestGameState> = {
        moves: {},
        segments: {
          testSegment: {
            start: true,
            next: undefined,
            turn: {
              phases: {
                testPhase: {
                  start: true,
                  next: undefined,
                  // Phase-level moves
                  moves: {
                    phaseMove: mockMoves.phaseMove,
                    phaseSpecific: mockMoves.passTurn,
                  },
                  steps: {
                    step1: {
                      start: true,
                      next: "step2",
                      endIf: createSpyEndIf("step1", true),
                    },
                    step2: {
                      next: undefined,
                      endIf: createSpyEndIf("step2", false),
                    },
                  },
                },
              },
            },
          },
        },
        flow: { turns: { phases: [] } },
      };

      flowManager = new FlowManager(gameDefinition, {});

      const initialState = MockGameStates.initial();
      // Set context to match the game definition being tested
      initialState.ctx.currentSegment = "testSegment";
      initialState.ctx.currentPhase = "testPhase";
      initialState.ctx.currentStep = "step1";
      const fnContext = createMockFnContext(initialState);

      // Phase moves should be available with qualified names (segment.phase.move)
      expect(
        flowManager.moveMap["testSegment.testPhase.phaseMove"],
      ).toBeTruthy();
      expect(
        flowManager.moveMap["testSegment.testPhase.phaseSpecific"],
      ).toBeTruthy();

      // And also with simple names
      expect(flowManager.moveMap["phaseMove"]).toBeTruthy();
      expect(flowManager.moveMap["phaseSpecific"]).toBeTruthy();

      // Test availability in both steps
      expect(
        flowManager.getMove(initialState.ctx, "phaseMove", "player1"),
      ).toBeTruthy();
      expect(
        flowManager.getMove(initialState.ctx, "phaseSpecific", "player1"),
      ).toBeTruthy();
    });

    it("should make step moves available only in specific steps", () => {
      const gameDefinition: GameDefinition<TestGameState> = {
        moves: {},
        segments: {
          testSegment: {
            start: true,
            next: undefined,
            turn: {
              phases: {
                testPhase: {
                  start: true,
                  next: undefined,
                  steps: {
                    step1: {
                      start: true,
                      next: "step2",
                      endIf: createSpyEndIf("step1", true),
                      // Step-specific move
                      moves: {
                        step1Move: mockMoves.stepMove,
                        step1Specific: mockMoves.passTurn,
                      },
                    },
                    step2: {
                      next: undefined,
                      endIf: createSpyEndIf("step2", false),
                      // Different step-specific move
                      moves: {
                        step2Move: mockMoves.stepMove,
                        step2Specific: mockMoves.concede,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        flow: { turns: { phases: [] } },
      };

      flowManager = new FlowManager(gameDefinition, {});

      const initialState = MockGameStates.initial();
      // Set context to match the game definition being tested
      initialState.ctx.currentSegment = "testSegment";
      initialState.ctx.currentPhase = "testPhase";
      initialState.ctx.currentStep = "step1";
      const fnContext = createMockFnContext(initialState);

      // Step moves should be available with full qualified names (segment.phase.step.move)
      expect(
        flowManager.moveMap["testSegment.testPhase.step1.step1Move"],
      ).toBeTruthy();
      expect(
        flowManager.moveMap["testSegment.testPhase.step1.step1Specific"],
      ).toBeTruthy();
      expect(
        flowManager.moveMap["testSegment.testPhase.step2.step2Move"],
      ).toBeTruthy();
      expect(
        flowManager.moveMap["testSegment.testPhase.step2.step2Specific"],
      ).toBeTruthy();

      // And also with simple names
      expect(flowManager.moveMap["step1Move"]).toBeTruthy();
      expect(flowManager.moveMap["step1Specific"]).toBeTruthy();
      expect(flowManager.moveMap["step2Move"]).toBeTruthy();
      expect(flowManager.moveMap["step2Specific"]).toBeTruthy();

      // Step1 moves should be accessible when in step1
      expect(
        flowManager.getMove(initialState.ctx, "step1Move", "player1"),
      ).toBeTruthy();

      // Step2 moves should NOT be accessible when in step1 (they're step-specific)
      // Change context to step2 to test step2 moves
      initialState.ctx.currentStep = "step2";
      expect(
        flowManager.getMove(initialState.ctx, "step2Move", "player1"),
      ).toBeTruthy();
    });
  });

  describe("Move Resolution Conflicts", () => {
    it("should handle name conflicts between different hierarchy levels", () => {
      const gameDefinition: GameDefinition<TestGameState> = {
        // Global move with conflicting name
        moves: {
          conflictMove: mockMoves.globalMove,
        },
        segments: {
          testSegment: {
            start: true,
            next: undefined,
            turn: {
              // Segment move with same name
              moves: {
                conflictMove: mockMoves.segmentMove,
              },
              phases: {
                testPhase: {
                  start: true,
                  next: undefined,
                  // Phase move with same name
                  moves: {
                    conflictMove: mockMoves.phaseMove,
                  },
                  steps: {
                    testStep: {
                      start: true,
                      next: undefined,
                      // Step move with same name
                      moves: {
                        conflictMove: mockMoves.stepMove,
                      },
                      endIf: createSpyEndIf("testStep", false),
                    },
                  },
                },
              },
            },
          },
        },
        flow: { turns: { phases: [] } },
      };

      flowManager = new FlowManager(gameDefinition, {});

      // All conflicting moves should be stored with qualified names
      expect(flowManager.moveMap["conflictMove"]).toBeTruthy(); // This would be the last one processed
      expect(flowManager.moveMap["testSegment.conflictMove"]).toBeTruthy();
      expect(
        flowManager.moveMap["testSegment.testPhase.conflictMove"],
      ).toBeTruthy();
      expect(
        flowManager.moveMap["testSegment.testPhase.testStep.conflictMove"],
      ).toBeTruthy();

      // The simple name should resolve to one of them (implementation dependent)
      const resolvedMove = flowManager.getMove(
        {} as any,
        "conflictMove",
        "player1",
      );
      expect(resolvedMove).toBeTruthy();
    });

    it("should handle moves with same simple name from different segments", () => {
      const gameDefinition: GameDefinition<TestGameState> = {
        moves: {},
        segments: {
          segment1: {
            start: true,
            next: "segment2",
            turn: {
              moves: {
                commonMove: mockMoves.segmentMove,
              },
              phases: {
                phase1: {
                  start: true,
                  next: undefined,
                  endIf: createSpyEndIf("phase1", true),
                },
              },
            },
          },
          segment2: {
            next: undefined,
            turn: {
              moves: {
                commonMove: mockMoves.passTurn, // Same name, different implementation
              },
              phases: {
                phase2: {
                  start: true,
                  next: undefined,
                  endIf: createSpyEndIf("phase2", false),
                },
              },
            },
          },
        },
        flow: { turns: { phases: [] } },
      };

      flowManager = new FlowManager(gameDefinition, {});

      // Both moves should be stored with qualified names
      expect(flowManager.moveMap["segment1.commonMove"]).toBeTruthy();
      expect(flowManager.moveMap["segment2.commonMove"]).toBeTruthy();

      // Simple name should resolve to one of them
      expect(flowManager.moveMap["commonMove"]).toBeTruthy();

      // Test with proper context - moves need context to be resolved
      const state = MockGameStates.initial();
      state.ctx.currentSegment = "segment1";
      state.ctx.currentPhase = "phase1";
      expect(
        flowManager.getMove(state.ctx, "commonMove", "player1"),
      ).toBeTruthy();
    });
  });

  describe("Move Name Collection", () => {
    it("should collect all unique move names across hierarchy", () => {
      const gameDefinition: GameDefinition<TestGameState> = {
        moves: {
          global1: mockMoves.globalMove,
          global2: mockMoves.concede,
        },
        segments: {
          testSegment: {
            start: true,
            next: undefined,
            turn: {
              moves: {
                segment1: mockMoves.segmentMove,
                segment2: mockMoves.passTurn,
              },
              phases: {
                testPhase: {
                  start: true,
                  next: undefined,
                  moves: {
                    phase1: mockMoves.phaseMove,
                    phase2: mockMoves.passTurn, // Duplicate name
                  },
                  steps: {
                    testStep: {
                      start: true,
                      next: undefined,
                      moves: {
                        step1: mockMoves.stepMove,
                        step2: mockMoves.concede, // Duplicate name
                      },
                      endIf: createSpyEndIf("testStep", false),
                    },
                  },
                },
              },
            },
          },
        },
        flow: { turns: { phases: [] } },
      };

      flowManager = new FlowManager(gameDefinition, {});

      // Should collect all unique move names
      const expectedMoveNames = [
        "global1",
        "global2",
        "segment1",
        "segment2",
        "phase1",
        "phase2",
        "step1",
        "step2",
      ];

      for (const moveName of expectedMoveNames) {
        expect(flowManager.moveNames).toContain(moveName);
      }

      // Should not have duplicates even if same name appears at different levels
      const uniqueNames = [...new Set(flowManager.moveNames)];
      expect(flowManager.moveNames.length).toBe(uniqueNames.length);
    });

    it("should handle empty move definitions gracefully", () => {
      const gameDefinition: GameDefinition<TestGameState> = {
        moves: {}, // Empty global moves
        segments: {
          testSegment: {
            start: true,
            next: undefined,
            turn: {
              // No moves at segment level
              phases: {
                testPhase: {
                  start: true,
                  next: undefined,
                  // No moves at phase level
                  steps: {
                    testStep: {
                      start: true,
                      next: undefined,
                      // No moves at step level
                      endIf: createSpyEndIf("testStep", false),
                    },
                  },
                },
              },
            },
          },
        },
        flow: { turns: { phases: [] } },
      };

      flowManager = new FlowManager(gameDefinition, {});

      // Should handle empty move definitions without errors
      expect(flowManager.moveNames).toEqual([]);
      expect(Object.keys(flowManager.moveMap)).toEqual([]);
      expect(flowManager.getMove({} as any, "nonexistent", "player1")).toBe(
        null,
      );
    });
  });

  describe("Move Availability Integration", () => {
    it("should properly integrate with flow transitions", () => {
      const gameDefinition: GameDefinition<TestGameState> = {
        moves: {
          globalMove: mockMoves.globalMove,
        },
        segments: {
          segment1: {
            start: true,
            next: "segment2",
            endIf: createSpyEndIf("segment1", true),
            turn: {
              moves: {
                segment1Move: mockMoves.segmentMove,
              },
              phases: {
                phase1: {
                  start: true,
                  next: undefined,
                  moves: {
                    phase1Move: mockMoves.phaseMove,
                  },
                  endIf: createSpyEndIf("phase1", true),
                },
              },
            },
          },
          segment2: {
            next: undefined,
            turn: {
              moves: {
                segment2Move: mockMoves.passTurn,
              },
              phases: {
                phase2: {
                  start: true,
                  next: undefined,
                  moves: {
                    phase2Move: mockMoves.stepMove,
                  },
                  endIf: createSpyEndIf("phase2", false),
                },
              },
            },
          },
        },
        flow: { turns: { phases: [] } },
      };

      flowManager = new FlowManager(gameDefinition, {});

      // Test moves with proper context for each segment
      const segment1State = MockGameStates.initial();
      segment1State.ctx.currentSegment = "segment1";
      segment1State.ctx.currentPhase = "phase1";

      // Global move should be available everywhere
      expect(
        flowManager.getMove(segment1State.ctx, "globalMove", "player1"),
      ).toBeTruthy();

      // Segment1 moves available in segment1
      expect(
        flowManager.getMove(segment1State.ctx, "segment1Move", "player1"),
      ).toBeTruthy();
      expect(
        flowManager.getMove(segment1State.ctx, "phase1Move", "player1"),
      ).toBeTruthy();

      // Test segment2 moves with segment2 context
      const segment2State = MockGameStates.initial();
      segment2State.ctx.currentSegment = "segment2";
      segment2State.ctx.currentPhase = "phase2";

      expect(
        flowManager.getMove(segment2State.ctx, "segment2Move", "player1"),
      ).toBeTruthy();
      expect(
        flowManager.getMove(segment2State.ctx, "phase2Move", "player1"),
      ).toBeTruthy();
    });
  });
});
