import { describe, expect, it } from "bun:test";
import type { Draft } from "immer";
import type {
  FlowContext,
  FlowDefinition,
  PhaseDefinition,
  SegmentDefinition,
  TurnDefinition,
} from "../flow-definition";

/**
 * Task 9.1: Write tests for FlowDefinition type
 *
 * Tests verify the structure and behavior of FlowDefinition.
 * Following the user's requirements for flexible turn/phase/segment progression.
 */

type TestGameState = {
  currentPlayer: number;
  players: Array<{ id: string; ready: boolean }>;
  turnCount: number;
  phase: string;
  segment?: string;
  phaseCount: number;
  segmentCount: number;
};

describe("FlowDefinition Type", () => {
  describe("FlowContext API", () => {
    it("should provide rich context beyond just state", () => {
      // Task 9.1: FlowContext should provide:
      // - state access (draft for mutations)
      // - flow control methods (endPhase, endSegment, endTurn)
      // - current flow information (current phase, segment, turn, player)

      const mockContext: FlowContext<TestGameState> = {
        state: {} as Draft<TestGameState>,
        endPhase: () => {},
        endSegment: () => {},
        endTurn: () => {},
        getCurrentPhase: () => "main",
        getCurrentSegment: () => undefined,
        getCurrentPlayer: () => "player-1",
        getTurnNumber: () => 1,
      };

      expect(mockContext.endPhase).toBeDefined();
      expect(mockContext.endSegment).toBeDefined();
      expect(mockContext.endTurn).toBeDefined();
      expect(mockContext.getCurrentPhase()).toBe("main");
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
        endIf: (context) => {
          // Can check state and return boolean
          return context.state.phaseCount >= 4;
        },
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
          ready: {
            order: 0,
            next: "draw",
            onEnd: (context) => {
              context.state.phase = "draw";
            },
          },
          draw: {
            order: 1,
            next: "main",
          },
          main: {
            order: 2,
            next: "end",
          },
          end: {
            order: 3,
            next: undefined, // No next phase, turn ends
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
        order: 0,
        onBegin: (context) => {
          context.state.phaseCount += 1;
        },
        onEnd: (context) => {
          context.state.phase = "completed";
        },
      };

      expect(phaseDef.onBegin).toBeDefined();
      expect(phaseDef.onEnd).toBeDefined();
    });

    it("should support automatic phase end", () => {
      const phaseDef: PhaseDefinition<TestGameState> = {
        order: 0,
        endIf: (context) => {
          // Phase automatically ends when condition is true
          return context.state.players.every((p) => p.ready);
        },
      };

      expect(phaseDef.endIf).toBeDefined();
    });

    it("should support programmatic phase end", () => {
      const phaseDef: PhaseDefinition<TestGameState> = {
        order: 0,
        onBegin: (context) => {
          // Can call endPhase() from within phase
          if (context.state.players.length === 0) {
            context.endPhase();
          }
        },
      };

      expect(phaseDef.onBegin).toBeDefined();
    });

    it("should define segments/steps with custom progression", () => {
      // User requirement: "For steps, it's a bit different... combat has different steps"
      const phaseDef: PhaseDefinition<TestGameState> = {
        order: 2,
        segments: {
          declare: {
            order: 0,
            next: "target",
          },
          target: {
            order: 1,
            next: "damage",
          },
          damage: {
            order: 2,
            next: undefined, // Ends the combat phase
          },
        },
      };

      expect(phaseDef.segments).toBeDefined();
      expect(phaseDef.segments?.declare.next).toBe("target");
    });
  });

  describe("SegmentDefinition", () => {
    it("should support lifecycle hooks", () => {
      const segmentDef: SegmentDefinition<TestGameState> = {
        order: 0,
        onBegin: (context) => {
          context.state.segmentCount += 1;
        },
        onEnd: (context) => {
          context.state.segment = undefined;
        },
      };

      expect(segmentDef.onBegin).toBeDefined();
      expect(segmentDef.onEnd).toBeDefined();
    });

    it("should support automatic segment end", () => {
      const segmentDef: SegmentDefinition<TestGameState> = {
        order: 0,
        endIf: (context) => {
          return context.state.segmentCount >= 3;
        },
      };

      expect(segmentDef.endIf).toBeDefined();
    });

    it("should support programmatic segment end", () => {
      const segmentDef: SegmentDefinition<TestGameState> = {
        order: 0,
        onBegin: (context) => {
          if (context.state.players.length === 0) {
            context.endSegment();
          }
        },
      };

      expect(segmentDef.onBegin).toBeDefined();
    });
  });

  describe("FlowDefinition", () => {
    it("should define complete game flow", () => {
      const flow: FlowDefinition<TestGameState> = {
        turn: {
          onBegin: (context) => {
            context.state.currentPlayer =
              (context.state.currentPlayer + 1) % context.state.players.length;
          },
          phases: {
            ready: {
              order: 0,
              next: "draw",
            },
            draw: {
              order: 1,
              next: "main",
            },
            main: {
              order: 2,
              next: "end",
            },
            end: {
              order: 3,
              next: undefined,
            },
          },
        },
      };

      expect(flow.turn).toBeDefined();
      expect(flow.turn.phases).toBeDefined();
    });

    it("should support default progression behavior", () => {
      // User requirement: "We should have defaults, but we should also be able to customize them"
      const flowWithDefaults: FlowDefinition<TestGameState> = {
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
      };

      expect(flowWithDefaults.turn).toBeDefined();
    });

    it("should support custom progression behavior", () => {
      const flowWithCustom: FlowDefinition<TestGameState> = {
        turn: {
          onEnd: (context) => {
            // Custom logic: maybe skip players, go back to first player, etc.
            context.state.currentPlayer = 0;
          },
          phases: {
            main: {
              order: 0,
              next: "combat",
              segments: {
                declare: {
                  order: 0,
                  next: "resolve",
                  onEnd: (context) => {
                    // Custom segment transition logic
                    if (context.state.segmentCount > 5) {
                      context.endPhase(); // Skip remaining segments
                    }
                  },
                },
                resolve: {
                  order: 1,
                  next: undefined,
                },
              },
            },
            combat: {
              order: 1,
              next: undefined,
            },
          },
        },
      };

      expect(flowWithCustom.turn.onEnd).toBeDefined();
      expect(flowWithCustom.turn.phases?.main.segments).toBeDefined();
    });
  });

  describe("Type Safety", () => {
    it("should enforce correct generic state type", () => {
      // TypeScript compile-time test
      const flow: FlowDefinition<TestGameState> = {
        turn: {
          onBegin: (context) => {
            // context.state should be Draft<TestGameState>
            context.state.turnCount += 1;
            context.state.currentPlayer = 0;
            // @ts-expect-error - nonexistent property should error
            context.state.nonExistent = true;
          },
        },
      };

      expect(flow).toBeDefined();
    });

    it("should provide type-safe FlowContext", () => {
      const phaseDef: PhaseDefinition<TestGameState> = {
        order: 0,
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
      };

      expect(phaseDef).toBeDefined();
    });
  });
});
