import { describe, expect, it } from "bun:test";
import type { SegmentConfig } from "~/game-engine/core-engine/game/structure/segment";
import type { GameDefinition } from "~/game-engine/core-engine/game-configuration";
import { createContext } from "~/game-engine/core-engine/utils/context-factory";
import { FlowManager } from "../flow-manager";

describe("FlowManager - Automatic Timing Enforcement", () => {
  type TestGameState = { value: number };

  const globalMove = ({ G }: any) => ({ ...G, value: G.value + 1 });
  const segmentMove = ({ G }: any) => ({ ...G, value: G.value + 10 });
  const phaseMove = ({ G }: any) => ({ ...G, value: G.value + 100 });
  const stepMove = ({ G }: any) => ({ ...G, value: G.value + 1000 });

  // Helper to create test player config
  const testPlayers = {
    p1: { id: "p1", name: "Player 1" },
  };

  const testGameDefinition: GameDefinition<TestGameState> = {
    name: "TestGame",

    // Global move - available anywhere
    moves: {
      globalAction: globalMove,
    },

    segments: {
      setup: {
        next: "gameplay",
        endIf: () => false,

        // Segment-level move - available in any phase/step of setup
        turn: {
          moves: {
            segmentAction: segmentMove,
          },

          phases: {
            initPhase: {
              start: true,
              next: null,

              // Phase-level move - available in any step of initPhase
              moves: {
                phaseAction: phaseMove,
              },

              steps: {
                firstStep: {
                  start: true,
                  next: "secondStep",

                  // Step-level move - only available in firstStep
                  moves: {
                    stepAction: stepMove,
                  },

                  endIf: () => true,
                },
                secondStep: {
                  next: null,
                  endIf: () => true,

                  // No moves defined here
                },
              },
            },
          },
        },
      } as SegmentConfig<TestGameState>,

      gameplay: {
        next: null,
        endIf: () => false,

        turn: {
          phases: {
            mainPhase: {
              start: true,
              next: null,

              moves: {
                mainPhaseAction: ({ G }: any) => G,
              },
            },
          },
        },
      } as SegmentConfig<TestGameState>,
    },
  };

  describe("Timing Hierarchy", () => {
    it("should allow global moves in any segment/phase/step", () => {
      const flowManager = new FlowManager(testGameDefinition, {}, ["p1"]);

      // Global moves available everywhere
      const contexts = [
        createContext({
          playerOrder: ["p1"],
          cards: {},
          players: testPlayers,
          initialSegment: "setup",
          initialPhase: "initPhase",
          initialStep: "firstStep",
          gameId: "test",
          matchId: "test",
        }),
        createContext({
          playerOrder: ["p1"],
          cards: {},
          players: testPlayers,
          initialSegment: "setup",
          initialPhase: "initPhase",
          initialStep: "secondStep",
          gameId: "test",
          matchId: "test",
        }),
        createContext({
          playerOrder: ["p1"],
          cards: {},
          players: testPlayers,
          initialSegment: "gameplay",
          initialPhase: "mainPhase",
          gameId: "test",
          matchId: "test",
        }),
      ];

      for (const ctx of contexts) {
        const move = flowManager.getMove(ctx, "globalAction", "p1");
        expect(move).toBeDefined();
        expect(move).toBe(globalMove);
      }
    });

    it("should restrict segment moves to their segment only", () => {
      const flowManager = new FlowManager(testGameDefinition, {}, ["p1"]);

      // Available in setup segment
      const setupCtx = createContext({
        playerOrder: ["p1"],
        cards: {},
        players: testPlayers,
        initialSegment: "setup",
        initialPhase: "initPhase",
        initialStep: "firstStep",
        gameId: "test",
        matchId: "test",
      });
      expect(flowManager.getMove(setupCtx, "segmentAction", "p1")).toBe(
        segmentMove,
      );

      // NOT available in gameplay segment
      const gameplayCtx = createContext({
        playerOrder: ["p1"],
        cards: {},
        players: testPlayers,
        initialSegment: "gameplay",
        initialPhase: "mainPhase",
        gameId: "test",
        matchId: "test",
      });
      expect(
        flowManager.getMove(gameplayCtx, "segmentAction", "p1"),
      ).toBeNull();
    });

    it("should restrict phase moves to their phase only", () => {
      const flowManager = new FlowManager(testGameDefinition, {}, ["p1"]);

      // Available in any step of initPhase
      const firstStepCtx = createContext({
        playerOrder: ["p1"],
        cards: {},
        players: testPlayers,
        initialSegment: "setup",
        initialPhase: "initPhase",
        initialStep: "firstStep",
        gameId: "test",
        matchId: "test",
      });
      expect(flowManager.getMove(firstStepCtx, "phaseAction", "p1")).toBe(
        phaseMove,
      );

      const secondStepCtx = createContext({
        playerOrder: ["p1"],
        cards: {},
        players: testPlayers,
        initialSegment: "setup",
        initialPhase: "initPhase",
        initialStep: "secondStep",
        gameId: "test",
        matchId: "test",
      });
      expect(flowManager.getMove(secondStepCtx, "phaseAction", "p1")).toBe(
        phaseMove,
      );

      // NOT available in mainPhase
      const mainPhaseCtx = createContext({
        playerOrder: ["p1"],
        cards: {},
        players: testPlayers,
        initialSegment: "gameplay",
        initialPhase: "mainPhase",
        gameId: "test",
        matchId: "test",
      });
      expect(flowManager.getMove(mainPhaseCtx, "phaseAction", "p1")).toBeNull();
    });

    it("should restrict step moves to their step only", () => {
      const flowManager = new FlowManager(testGameDefinition, {}, ["p1"]);

      // Available ONLY in firstStep
      const firstStepCtx = createContext({
        playerOrder: ["p1"],
        cards: {},
        players: testPlayers,
        initialSegment: "setup",
        initialPhase: "initPhase",
        initialStep: "firstStep",
        gameId: "test",
        matchId: "test",
      });
      expect(flowManager.getMove(firstStepCtx, "stepAction", "p1")).toBe(
        stepMove,
      );

      // NOT available in secondStep (same phase, different step)
      const secondStepCtx = createContext({
        playerOrder: ["p1"],
        cards: {},
        players: testPlayers,
        initialSegment: "setup",
        initialPhase: "initPhase",
        initialStep: "secondStep",
        gameId: "test",
        matchId: "test",
      });
      expect(flowManager.getMove(secondStepCtx, "stepAction", "p1")).toBeNull();
    });
  });

  describe("Priority Resolution", () => {
    it("should prioritize step-level over phase-level when both exist", () => {
      const stepOverride = ({ G }: any) => ({
        ...G,
        value: 9999,
      });

      const gameDefWithOverride: GameDefinition<TestGameState> = {
        name: "TestOverride",
        segments: {
          test: {
            next: null,
            turn: {
              phases: {
                testPhase: {
                  start: true,
                  next: null,

                  // Phase-level definition
                  moves: {
                    sharedMove: phaseMove,
                  },

                  steps: {
                    testStep: {
                      start: true,
                      next: null,

                      // Step-level override (should take priority)
                      moves: {
                        sharedMove: stepOverride,
                      },

                      endIf: () => true,
                    },
                  },
                },
              },
            },
          } as SegmentConfig<TestGameState>,
        },
      };

      const flowManager = new FlowManager(gameDefWithOverride, {}, ["p1"]);

      const ctx = createContext({
        playerOrder: ["p1"],
        cards: {},
        players: testPlayers,
        initialSegment: "test",
        initialPhase: "testPhase",
        initialStep: "testStep",
        gameId: "test",
        matchId: "test",
      });

      // Should return step-level version, not phase-level
      const move = flowManager.getMove(ctx, "sharedMove", "p1");
      expect(move).toBe(stepOverride);
      expect(move).not.toBe(phaseMove);
    });

    it("should fall back to phase-level when step doesn't define the move", () => {
      const flowManager = new FlowManager(testGameDefinition, {}, ["p1"]);

      // In secondStep, phaseAction should still be available (phase-level)
      const ctx = createContext({
        playerOrder: ["p1"],
        cards: {},
        players: testPlayers,
        initialSegment: "setup",
        initialPhase: "initPhase",
        initialStep: "secondStep",
        gameId: "test",
        matchId: "test",
      });

      expect(flowManager.getMove(ctx, "phaseAction", "p1")).toBe(phaseMove);
    });
  });

  describe("Real-World TCG Pattern", () => {
    it("should enforce Lorcana-style timing: mainPhase.idle allows play actions", () => {
      type LorcanaState = { inkwell: number };

      const playCardMove = ({ G }: any) => G;
      const questMove = ({ G }: any) => G;
      const passMove = ({ G }: any) => G;

      const lorcanaLikeGame: GameDefinition<LorcanaState> = {
        name: "LorcanaLike",
        segments: {
          duringGame: {
            next: null,
            turn: {
              phases: {
                beginningPhase: {
                  start: true,
                  next: "mainPhase",

                  steps: {
                    readyStep: {
                      start: true,
                      next: "drawStep",
                      // No player moves here - automatic
                      endIf: () => true,
                    },
                    drawStep: {
                      next: null,
                      // No player moves here - automatic
                      endIf: () => true,
                    },
                  },
                },

                mainPhase: {
                  next: "endPhase",

                  steps: {
                    idle: {
                      start: true,

                      // All main phase actions ONLY available in idle step
                      moves: {
                        playCard: playCardMove,
                        quest: questMove,
                        passTurn: passMove,
                      },
                    },
                  },
                },

                endPhase: {
                  next: "beginningPhase",
                  end: true,
                  // No player moves - automatic cleanup
                },
              },
            },
          } as SegmentConfig<LorcanaState>,
        },
      };

      const flowManager = new FlowManager(lorcanaLikeGame, {}, ["p1"]);

      // Can play cards during mainPhase.idle
      const mainIdleCtx = createContext({
        playerOrder: ["p1"],
        cards: {},
        players: testPlayers,
        initialSegment: "duringGame",
        initialPhase: "mainPhase",
        initialStep: "idle",
        gameId: "test",
        matchId: "test",
      });
      expect(flowManager.getMove(mainIdleCtx, "playCard", "p1")).toBe(
        playCardMove,
      );

      // CANNOT play cards during beginningPhase
      const beginningCtx = createContext({
        playerOrder: ["p1"],
        cards: {},
        players: testPlayers,
        initialSegment: "duringGame",
        initialPhase: "beginningPhase",
        initialStep: "readyStep",
        gameId: "test",
        matchId: "test",
      });
      expect(flowManager.getMove(beginningCtx, "playCard", "p1")).toBeNull();

      // CANNOT play cards during endPhase
      const endCtx = createContext({
        playerOrder: ["p1"],
        cards: {},
        players: testPlayers,
        initialSegment: "duringGame",
        initialPhase: "endPhase",
        gameId: "test",
        matchId: "test",
      });
      expect(flowManager.getMove(endCtx, "playCard", "p1")).toBeNull();
    });
  });
});
