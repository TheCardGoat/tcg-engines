import { describe, expect, it } from "bun:test";
import type { Draft } from "immer";
import type {
  FlowContext,
  FlowDefinition,
  GameSegmentDefinition,
  PhaseDefinition,
  StepDefinition,
  TurnDefinition,
} from "../flow-definition";

/**
 * Task 9.1: Write tests for FlowDefinition type
 *
 * Tests verify the structure and behavior of FlowDefinition.
 * Following the user's requirements for flexible turn/phase/step progression.
 */

interface TestGameState {
  currentPlayer: number;
  players: { id: string; ready: boolean }[];
  turnCount: number;
  phase: string;
  step?: string;
  phaseCount: number;
  stepCount: number;
}

describe("FlowDefinition Type", () => {
  describe("FlowContext API", () => {
    it("should provide rich context beyond just state", () => {
      // Task 9.1: FlowContext should provide:
      // - state access (draft for mutations)
      // - flow control methods (endPhase, endStep, endTurn, endGameSegment)
      // - current flow information (current phase, step, turn, player, game segment)

      const mockContext: FlowContext<TestGameState> = {
        cards: {
          getCardMeta: () => ({}),
          getCardOwner: () => undefined,
          queryCards: () => [],
          setCardMeta: () => {},
          updateCardMeta: () => {},
        },
        endGameSegment: () => {},
        endPhase: () => {},
        endStep: () => {},
        endTurn: () => {},
        game: {
          addPendingMulligan: () => {},
          getChoosingFirstPlayer: () => undefined,
          getOTP: () => undefined,
          getPendingMulligan: () => [],
          removePendingMulligan: () => {},
          setChoosingFirstPlayer: () => {},
          setOTP: () => {},
          setPendingMulligan: () => {},
        },
        getCurrentGameSegment: () => "mainGame",
        getCurrentPhase: () => "main",
        getCurrentPlayer: () => "player-1",
        getCurrentStep: () => undefined,
        getTurnNumber: () => 1,
        setCurrentPlayer: () => {},
        state: {} as Draft<TestGameState>,
        zones: {
          bulkMove: () => [],
          createDeck: () => [],
          drawCards: () => [],
          getCardZone: () => undefined,
          getCardsInZone: () => [],
          moveCard: () => {},
          mulligan: () => {},
          shuffleZone: () => {},
        },
      };

      expect(mockContext.endGameSegment).toBeDefined();
      expect(mockContext.endPhase).toBeDefined();
      expect(mockContext.endStep).toBeDefined();
      expect(mockContext.endTurn).toBeDefined();
      expect(mockContext.getCurrentPhase()).toBe("main");
      expect(mockContext.getCurrentGameSegment()).toBe("mainGame");
    });
  });

  describe("TurnDefinition", () => {
    it("should support lifecycle hooks with FlowContext", () => {
      // Task 9.5: Lifecycle hooks receive FlowContext, not just state
      const turnDef: TurnDefinition<TestGameState> = {
        onBegin: (context) => {
          // Can mutate state
          context.state.turnCount += 1;
          // Can access flow information
          expect(context.getCurrentPlayer).toBeDefined();
        },
        onEnd: (context) => {
          context.state.turnCount += 1;
        },
      };

      expect(turnDef.onBegin).toBeDefined();
      expect(turnDef.onEnd).toBeDefined();
    });

    it("should support automatic turn end with endIf", () => {
      // Task 9.7: endIf for automatic transitions
      const turnDef: TurnDefinition<TestGameState> = {
        endIf: (context) => context.state.phaseCount >= 4,
      };

      expect(turnDef.endIf).toBeDefined();
    });

    it("should support programmatic turn end", () => {
      // User requirement: "We should be able to end the segment/turn/phase programmatically"
      const turnDef: TurnDefinition<TestGameState> = {
        onBegin: (context) => {
          // Can call endTurn() programmatically from actions
          if (context.state.players.length === 0) {
            context.endTurn();
          }
        },
      };

      expect(turnDef.onBegin).toBeDefined();
    });

    it("should define phases that progress sequentially", () => {
      // User requirement: "phases, when the current phase ends, the next phase from the same player will start"
      const turnDef: TurnDefinition<TestGameState> = {
        phases: {
          draw: {
            next: "main",
            order: 1,
          },
          end: {
            next: undefined,
            order: 3, // No next phase, turn ends
          },
          main: {
            next: "end",
            order: 2,
          },
          ready: {
            next: "draw",
            onEnd: (context) => {
              context.state.phase = "draw";
            },
          },
        },
      };

      expect(turnDef.phases).toBeDefined();
      expect(turnDef.phases?.ready.next).toBe("draw");
      expect(turnDef.phases?.end.next).toBeUndefined();
    });
  });

  describe("PhaseDefinition", () => {
    it("should support lifecycle hooks", () => {
      const phaseDef: PhaseDefinition<TestGameState> = {
        onBegin: (context) => {
          context.state.phaseCount += 1;
        },
        onEnd: (context) => {
          context.state.phase = "completed";
        },
        order: 0,
      };

      expect(phaseDef.onBegin).toBeDefined();
      expect(phaseDef.onEnd).toBeDefined();
    });

    it("should support automatic phase end", () => {
      const phaseDef: PhaseDefinition<TestGameState> = {
        endIf: (context) => context.state.players.every((p) => p.ready),
        order: 0,
      };

      expect(phaseDef.endIf).toBeDefined();
    });

    it("should support programmatic phase end", () => {
      const phaseDef: PhaseDefinition<TestGameState> = {
        onBegin: (context) => {
          // Can call endPhase() from within phase
          if (context.state.players.length === 0) {
            context.endPhase();
          }
        },
        order: 0,
      };

      expect(phaseDef.onBegin).toBeDefined();
    });

    it("should define steps with custom progression", () => {
      // User requirement: "For steps, it's a bit different... combat has different steps"
      const phaseDef: PhaseDefinition<TestGameState> = {
        order: 2,
        steps: {
          damage: {
            next: undefined,
            order: 2, // Ends the combat phase
          },
          declare: {
            next: "target",
            order: 0,
          },
          target: {
            next: "damage",
          },
        },
      };

      expect(phaseDef.steps).toBeDefined();
      expect(phaseDef.steps?.declare.next).toBe("target");
    });
  });

  describe("StepDefinition", () => {
    it("should support lifecycle hooks", () => {
      const stepDef: StepDefinition<TestGameState> = {
        onBegin: (context) => {
          context.state.stepCount += 1;
        },
        onEnd: (context) => {
          context.state.step = undefined;
        },
        order: 0,
      };

      expect(stepDef.onBegin).toBeDefined();
      expect(stepDef.onEnd).toBeDefined();
    });

    it("should support automatic step end", () => {
      const stepDef: StepDefinition<TestGameState> = {
        endIf: (context) => context.state.stepCount >= 3,
        order: 0,
      };

      expect(stepDef.endIf).toBeDefined();
    });

    it("should support programmatic step end", () => {
      const stepDef: StepDefinition<TestGameState> = {
        onBegin: (context) => {
          if (context.state.players.length === 0) {
            context.endStep();
          }
        },
        order: 0,
      };

      expect(stepDef.onBegin).toBeDefined();
    });
  });

  describe("FlowDefinition", () => {
    it("should define complete game flow", () => {
      const flow: FlowDefinition<TestGameState> = {
        gameSegments: {
          mainGame: {
            order: 1,
            turn: {
              onBegin: (context) => {
                context.state.currentPlayer =
                  (context.state.currentPlayer + 1) % context.state.players.length;
              },
              phases: {
                draw: {
                  next: "main",
                },
                end: {
                  next: undefined,
                  order: 3,
                },
                main: {
                  next: "end",
                  order: 2,
                },
                ready: {
                  next: "draw",
                  order: 0,
                },
              },
            },
          },
        },
      };

      expect(flow.gameSegments).toBeDefined();
      expect(flow.gameSegments.mainGame).toBeDefined();
      expect(flow.gameSegments.mainGame.turn.phases).toBeDefined();
    });

    it("should support default progression behavior", () => {
      // User requirement: "We should have defaults, but we should also be able to customize them"
      const flowWithDefaults: FlowDefinition<TestGameState> = {
        gameSegments: {
          mainGame: {
            order: 1,
            turn: {
              // Uses default: when turn ends, next player starts their turn
              phases: {
                main: {
                  order: 0,
                  // Uses default: phases progress sequentially by order
                  next: undefined,
                },
              },
            },
          },
        },
      };

      expect(flowWithDefaults.gameSegments.mainGame.turn).toBeDefined();
    });

    it("should support custom progression behavior", () => {
      const flowWithCustom: FlowDefinition<TestGameState> = {
        gameSegments: {
          mainGame: {
            order: 1,
            turn: {
              onEnd: (context) => {
                // Custom logic: maybe skip players, go back to first player, etc.
                context.state.currentPlayer = 0;
              },
              phases: {
                combat: {
                  next: undefined,
                  order: 1,
                },
                main: {
                  next: "combat",
                  order: 0,
                  steps: {
                    declare: {
                      next: "resolve",
                      onEnd: (context) => {
                        // Custom step transition logic
                        if (context.state.stepCount > 5) {
                          context.endPhase(); // Skip remaining steps
                        }
                      },
                      order: 0,
                    },
                    resolve: {
                      next: undefined,
                      order: 1,
                    },
                  },
                },
              },
            },
          },
        },
      };

      expect(flowWithCustom.gameSegments.mainGame.turn.onEnd).toBeDefined();
      expect(flowWithCustom.gameSegments.mainGame.turn.phases?.main.steps).toBeDefined();
    });
  });

  describe("Type Safety", () => {
    it("should enforce correct generic state type", () => {
      // TypeScript compile-time test
      const flow: FlowDefinition<TestGameState> = {
        gameSegments: {
          mainGame: {
            order: 1,
            turn: {
              onBegin: (context) => {
                // Context.state should be Draft<TestGameState>
                context.state.turnCount += 1;
                context.state.currentPlayer = 0;
                // @ts-expect-error - nonexistent property should error
                context.state.nonExistent = true;
              },
            },
          },
        },
      };

      expect(flow).toBeDefined();
    });

    it("should provide type-safe FlowContext", () => {
      const phaseDef: PhaseDefinition<TestGameState> = {
        onBegin: (context) => {
          // All FlowContext methods should be type-safe
          const phase: string | undefined = context.getCurrentPhase();
          const player: string = context.getCurrentPlayer();
          const turn: number = context.getTurnNumber();

          expect(typeof player).toBe("string");
          expect(typeof turn).toBe("number");
          // Phase can be undefined in some contexts
          if (phase) {
            expect(typeof phase).toBe("string");
          }
        },
        order: 0,
      };

      expect(phaseDef).toBeDefined();
    });
  });
});
