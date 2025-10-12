import { describe, expect, it } from "bun:test";
import type { FlowDefinition } from "../flow-definition";
import { FlowManager } from "../flow-manager";

/**
 * Task 9.3, 9.4: Tests for FlowManager
 *
 * Tests verify:
 * - Turn/phase/step state machine construction
 * - Lifecycle hook execution
 * - Automatic and programmatic transitions
 * - Hierarchical state management
 * - Event handling
 */

type GameState = {
  currentPlayer: number;
  players: Array<{ id: string; ready: boolean }>;
  turnCount: number;
  phase?: string;
  step?: string;
  log: string[];
};

describe("FlowManager - State Machine", () => {
  describe("Task 9.3, 9.4: Turn/Phase/Step State Machine", () => {
    it("should initialize with turn → phase hierarchy", () => {
      // Red: Test initialization
      const flow: FlowDefinition<GameState> = {
        turn: {
          phases: {
            ready: { order: 0, next: "draw" },
            draw: { order: 1, next: "main" },
            main: { order: 2, next: undefined },
          },
        },
      };

      const initialState: GameState = {
        currentPlayer: 0,
        players: [{ id: "p1", ready: false }],
        turnCount: 0,
        log: [],
      };

      const manager = new FlowManager(flow, initialState);

      const state = manager.getState();
      expect(state).toBeDefined();
    });

    it("should progress through phases sequentially", () => {
      const flow: FlowDefinition<GameState> = {
        turn: {
          phases: {
            ready: { order: 0, next: "draw" },
            draw: { order: 1, next: "main" },
            main: { order: 2, next: undefined },
          },
        },
      };

      const initialState: GameState = {
        currentPlayer: 0,
        players: [{ id: "p1", ready: false }],
        turnCount: 0,
        log: [],
      };

      const manager = new FlowManager(flow, initialState);

      // Should start in ready phase
      expect(manager.getCurrentPhase()).toBe("ready");

      // Transition to draw
      manager.nextPhase();
      expect(manager.getCurrentPhase()).toBe("draw");

      // Transition to main
      manager.nextPhase();
      expect(manager.getCurrentPhase()).toBe("main");

      // Next phase is undefined, should end turn
      manager.nextPhase();
      expect(manager.getCurrentPhase()).toBe("ready"); // New turn
    });

    it("should support hierarchical states (phase → segments)", () => {
      // Task 9.13: Hierarchical states
      const flow: FlowDefinition<GameState> = {
        turn: {
          phases: {
            main: {
              order: 0,
              next: undefined,
              segments: {
                declare: { order: 0, next: "target" },
                target: { order: 1, next: "damage" },
                damage: { order: 2, next: undefined },
              },
            },
          },
        },
      };

      const initialState: GameState = {
        currentPlayer: 0,
        players: [{ id: "p1", ready: false }],
        turnCount: 0,
        log: [],
      };

      const manager = new FlowManager(flow, initialState);

      expect(manager.getCurrentPhase()).toBe("main");
      expect(manager.getCurrentSegment()).toBe("declare");

      manager.nextSegment();
      expect(manager.getCurrentSegment()).toBe("target");

      manager.nextSegment();
      expect(manager.getCurrentSegment()).toBe("damage");
    });
  });

  describe("Task 9.5, 9.6: Lifecycle Hooks", () => {
    it("should execute onBegin hook when phase starts", () => {
      const flow: FlowDefinition<GameState> = {
        turn: {
          onBegin: (context) => {
            context.state.turnCount += 1;
            context.state.log.push("turn-begin");
          },
          phases: {
            ready: {
              order: 0,
              next: undefined,
              onBegin: (context) => {
                context.state.log.push("ready-begin");
              },
            },
          },
        },
      };

      const initialState: GameState = {
        currentPlayer: 0,
        players: [{ id: "p1", ready: false }],
        turnCount: 0,
        log: [],
      };

      const manager = new FlowManager(flow, initialState);
      const state = manager.getGameState();

      expect(state.turnCount).toBe(1);
      expect(state.log).toContain("turn-begin");
      expect(state.log).toContain("ready-begin");
    });

    it("should execute onEnd hook when phase ends", () => {
      const flow: FlowDefinition<GameState> = {
        turn: {
          phases: {
            ready: {
              order: 0,
              next: "draw",
              onEnd: (context) => {
                context.state.log.push("ready-end");
              },
            },
            draw: {
              order: 1,
              next: undefined,
            },
          },
        },
      };

      const initialState: GameState = {
        currentPlayer: 0,
        players: [{ id: "p1", ready: false }],
        turnCount: 0,
        log: [],
      };

      const manager = new FlowManager(flow, initialState);

      manager.nextPhase();
      const state = manager.getGameState();

      expect(state.log).toContain("ready-end");
      expect(manager.getCurrentPhase()).toBe("draw");
    });

    it("should execute segment lifecycle hooks", () => {
      const flow: FlowDefinition<GameState> = {
        turn: {
          phases: {
            main: {
              order: 0,
              next: undefined,
              segments: {
                declare: {
                  order: 0,
                  next: "target",
                  onBegin: (context) => {
                    context.state.log.push("declare-begin");
                  },
                  onEnd: (context) => {
                    context.state.log.push("declare-end");
                  },
                },
                target: {
                  order: 1,
                  next: undefined,
                },
              },
            },
          },
        },
      };

      const initialState: GameState = {
        currentPlayer: 0,
        players: [{ id: "p1", ready: false }],
        turnCount: 0,
        log: [],
      };

      const manager = new FlowManager(flow, initialState);
      let state = manager.getGameState();

      expect(state.log).toContain("declare-begin");

      manager.nextSegment();
      state = manager.getGameState();

      expect(state.log).toContain("declare-end");
    });
  });

  describe("Task 9.7, 9.8: EndIf Conditions", () => {
    it("should automatically transition when endIf returns true", () => {
      const flow: FlowDefinition<GameState> = {
        turn: {
          phases: {
            ready: {
              order: 0,
              next: "draw",
              endIf: (context) => {
                // Auto-end when all players are ready
                return context.state.players.every((p) => p.ready);
              },
            },
            draw: {
              order: 1,
              next: undefined,
            },
          },
        },
      };

      const initialState: GameState = {
        currentPlayer: 0,
        players: [
          { id: "p1", ready: false },
          { id: "p2", ready: false },
        ],
        turnCount: 0,
        log: [],
      };

      const manager = new FlowManager(flow, initialState);

      expect(manager.getCurrentPhase()).toBe("ready");

      // Make all players ready
      manager.updateState((draft) => {
        for (const player of draft.players) {
          player.ready = true;
        }
      });

      // Should auto-transition to draw
      expect(manager.getCurrentPhase()).toBe("draw");
    });

    it("should check endIf after state updates", () => {
      const flow: FlowDefinition<GameState> = {
        turn: {
          phases: {
            main: {
              order: 0,
              next: "end",
              endIf: (context) => context.state.turnCount >= 5,
            },
            end: {
              order: 1,
              next: undefined,
            },
          },
        },
      };

      const initialState: GameState = {
        currentPlayer: 0,
        players: [{ id: "p1", ready: false }],
        turnCount: 0,
        log: [],
      };

      const manager = new FlowManager(flow, initialState);

      expect(manager.getCurrentPhase()).toBe("main");

      // Increment turn count
      manager.updateState((draft) => {
        draft.turnCount = 5;
      });

      // Should auto-transition to end
      expect(manager.getCurrentPhase()).toBe("end");
    });
  });

  describe("Task 9.9, 9.10: FlowContext", () => {
    it("should provide programmatic endPhase control", () => {
      const flow: FlowDefinition<GameState> = {
        turn: {
          phases: {
            ready: {
              order: 0,
              next: "draw",
              onBegin: (context) => {
                // Skip this phase if no players
                if (context.state.players.length === 0) {
                  context.endPhase();
                }
              },
            },
            draw: {
              order: 1,
              next: undefined,
            },
          },
        },
      };

      const initialState: GameState = {
        currentPlayer: 0,
        players: [],
        turnCount: 0,
        log: [],
      };

      const manager = new FlowManager(flow, initialState);

      // Should have skipped ready phase via endPhase()
      expect(manager.getCurrentPhase()).toBe("draw");
    });

    it("should provide programmatic endSegment control", () => {
      const flow: FlowDefinition<GameState> = {
        turn: {
          phases: {
            main: {
              order: 0,
              next: undefined,
              segments: {
                declare: {
                  order: 0,
                  next: "target",
                  onBegin: (context) => {
                    if (context.state.players.length === 0) {
                      context.endSegment();
                    }
                  },
                },
                target: {
                  order: 1,
                  next: undefined,
                },
              },
            },
          },
        },
      };

      const initialState: GameState = {
        currentPlayer: 0,
        players: [],
        turnCount: 0,
        log: [],
      };

      const manager = new FlowManager(flow, initialState);

      // Should have skipped declare segment
      expect(manager.getCurrentSegment()).toBe("target");
    });

    it("should provide programmatic endTurn control", () => {
      const flow: FlowDefinition<GameState> = {
        turn: {
          onBegin: (context) => {
            context.state.turnCount += 1;
            // End turn immediately if turn count is 5
            if (context.state.turnCount === 5) {
              context.endTurn();
            }
          },
          phases: {
            main: { order: 0, next: undefined },
          },
        },
      };

      const initialState: GameState = {
        currentPlayer: 0,
        players: [{ id: "p1", ready: false }],
        turnCount: 4, // Next turn will be 5
        log: [],
      };

      const manager = new FlowManager(flow, initialState);

      manager.nextTurn();
      const state = manager.getGameState();

      // Turn should have ended immediately
      expect(state.turnCount).toBeGreaterThan(5);
    });

    it("should provide current flow information", () => {
      const flow: FlowDefinition<GameState> = {
        turn: {
          phases: {
            main: {
              order: 0,
              next: undefined,
              onBegin: (context) => {
                // Access flow information
                const phase = context.getCurrentPhase();
                const turn = context.getTurnNumber();
                const player = context.getCurrentPlayer();

                expect(phase).toBe("main");
                expect(turn).toBeGreaterThan(0);
                expect(player).toBeDefined();
              },
            },
          },
        },
      };

      const initialState: GameState = {
        currentPlayer: 0,
        players: [{ id: "p1", ready: false }],
        turnCount: 0,
        log: [],
      };

      const manager = new FlowManager(flow, initialState);
      manager.getGameState(); // Trigger onBegin
    });
  });

  describe("Task 9.11, 9.12: Flow Event Handling", () => {
    it("should handle NEXT_PHASE event", () => {
      const flow: FlowDefinition<GameState> = {
        turn: {
          phases: {
            ready: { order: 0, next: "draw" },
            draw: { order: 1, next: undefined },
          },
        },
      };

      const initialState: GameState = {
        currentPlayer: 0,
        players: [{ id: "p1", ready: false }],
        turnCount: 0,
        log: [],
      };

      const manager = new FlowManager(flow, initialState);

      expect(manager.getCurrentPhase()).toBe("ready");

      manager.send({ type: "NEXT_PHASE" });

      expect(manager.getCurrentPhase()).toBe("draw");
    });

    it("should handle END_TURN event", () => {
      const flow: FlowDefinition<GameState> = {
        turn: {
          onBegin: (context) => {
            context.state.turnCount += 1;
          },
          phases: {
            main: { order: 0, next: undefined },
          },
        },
      };

      const initialState: GameState = {
        currentPlayer: 0,
        players: [{ id: "p1", ready: false }],
        turnCount: 0,
        log: [],
      };

      const manager = new FlowManager(flow, initialState);

      const initialTurnCount = manager.getGameState().turnCount;

      manager.send({ type: "END_TURN" });

      expect(manager.getGameState().turnCount).toBeGreaterThan(
        initialTurnCount,
      );
    });

    it("should handle END_SEGMENT event", () => {
      const flow: FlowDefinition<GameState> = {
        turn: {
          phases: {
            main: {
              order: 0,
              next: undefined,
              segments: {
                declare: { order: 0, next: "target" },
                target: { order: 1, next: undefined },
              },
            },
          },
        },
      };

      const initialState: GameState = {
        currentPlayer: 0,
        players: [{ id: "p1", ready: false }],
        turnCount: 0,
        log: [],
      };

      const manager = new FlowManager(flow, initialState);

      expect(manager.getCurrentSegment()).toBe("declare");

      manager.send({ type: "END_SEGMENT" });

      expect(manager.getCurrentSegment()).toBe("target");
    });
  });

  describe("Task 9.13, 9.14: Hierarchical States", () => {
    it("should support nested phase → segment hierarchy", () => {
      const flow: FlowDefinition<GameState> = {
        turn: {
          phases: {
            main: {
              order: 0,
              next: "end",
              segments: {
                start: { order: 0, next: "middle" },
                middle: { order: 1, next: "finish" },
                finish: { order: 2, next: undefined },
              },
            },
            end: {
              order: 1,
              next: undefined,
            },
          },
        },
      };

      const initialState: GameState = {
        currentPlayer: 0,
        players: [{ id: "p1", ready: false }],
        turnCount: 0,
        log: [],
      };

      const manager = new FlowManager(flow, initialState);

      // Should start in main.start
      expect(manager.getCurrentPhase()).toBe("main");
      expect(manager.getCurrentSegment()).toBe("start");

      // Progress through segments
      manager.nextSegment();
      expect(manager.getCurrentSegment()).toBe("middle");

      manager.nextSegment();
      expect(manager.getCurrentSegment()).toBe("finish");

      // End segment should end phase
      manager.nextSegment();
      expect(manager.getCurrentPhase()).toBe("end");
      expect(manager.getCurrentSegment()).toBeUndefined();
    });

    it("should handle lifecycle hooks at all levels", () => {
      const flow: FlowDefinition<GameState> = {
        turn: {
          onBegin: (context) => {
            context.state.log.push("turn-begin");
          },
          onEnd: (context) => {
            context.state.log.push("turn-end");
          },
          phases: {
            main: {
              order: 0,
              next: undefined,
              onBegin: (context) => {
                context.state.log.push("phase-begin");
              },
              onEnd: (context) => {
                context.state.log.push("phase-end");
              },
              segments: {
                start: {
                  order: 0,
                  next: undefined,
                  onBegin: (context) => {
                    context.state.log.push("segment-begin");
                  },
                  onEnd: (context) => {
                    context.state.log.push("segment-end");
                  },
                },
              },
            },
          },
        },
      };

      const initialState: GameState = {
        currentPlayer: 0,
        players: [{ id: "p1", ready: false }],
        turnCount: 0,
        log: [],
      };

      const manager = new FlowManager(flow, initialState);
      let state = manager.getGameState();

      expect(state.log).toContain("turn-begin");
      expect(state.log).toContain("phase-begin");
      expect(state.log).toContain("segment-begin");

      manager.nextTurn();
      state = manager.getGameState();

      expect(state.log).toContain("segment-end");
      expect(state.log).toContain("phase-end");
      expect(state.log).toContain("turn-end");
    });
  });
});
