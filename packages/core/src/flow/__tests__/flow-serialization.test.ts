import { describe, expect, it } from "bun:test";
import type { FlowDefinition } from "../flow-definition";
import { FlowManager } from "../flow-manager";

/**
 * End-to-End Serialization Tests
 *
 * Use case: When a game ends, we store a serialized version of the state in a database.
 * Players can later recover this state and check their replay.
 *
 * These tests verify that:
 * - Game state (including flow state) can be serialized to JSON
 * - Serialized state can be deserialized
 * - Flow can continue from deserialized state
 * - Flow position (phase, segment, turn) is preserved
 */

type GameState = {
  currentPlayer: number;
  players: Array<{ id: string; name: string; score: number }>;
  turnCount: number;
  phase?: string;
  step?: string;
  log: string[];
  // Flow state that needs to be preserved
  flowState?: {
    currentPhase?: string;
    currentStep?: string;
    turnNumber: number;
  };
};

describe("Flow Serialization - End to End", () => {
  it("should serialize and deserialize complete game state with flow position", () => {
    // Setup: Create a game with flow
    const flow: FlowDefinition<GameState> = {
      gameSegments: {
        mainGame: {
          order: 1,
          turn: {
            onBegin: (context) => {
              context.state.turnCount += 1;
              context.state.log.push(`turn-${context.state.turnCount}-begin`);
            },
            phases: {
              ready: {
                order: 0,
                next: "draw",
                onBegin: (context) => {
                  context.state.log.push("ready-phase");
                },
              },
              draw: {
                order: 1,
                next: "main",
                onBegin: (context) => {
                  context.state.log.push("draw-phase");
                },
              },
              main: {
                order: 2,
                next: "end",
                onBegin: (context) => {
                  context.state.log.push("main-phase");
                },
              },
              end: {
                order: 3,
                next: undefined,
                onBegin: (context) => {
                  context.state.log.push("end-phase");
                },
              },
            },
          },
        },
      },
    };

    const initialState: GameState = {
      currentPlayer: 0,
      players: [
        { id: "p1", name: "Alice", score: 0 },
        { id: "p2", name: "Bob", score: 0 },
      ],
      turnCount: 0,
      log: [],
    };

    const manager = new FlowManager(flow, initialState);

    // Progress through some phases
    manager.nextPhase(); // ready → draw
    manager.nextPhase(); // draw → main

    const gameStateBeforeSerialization = manager.getGameState();

    // Serialize: Capture both game state and flow state
    const serializedState = JSON.stringify({
      gameState: gameStateBeforeSerialization,
      flowState: manager.serializeFlowState(),
    });

    // Simulate: Save to database, then load later
    expect(serializedState).toBeDefined();
    expect(serializedState.length).toBeGreaterThan(0);

    // Deserialize: Parse from JSON
    const deserialized = JSON.parse(serializedState);

    expect(deserialized.gameState).toBeDefined();
    expect(deserialized.flowState).toBeDefined();

    // Verify flow state was preserved
    expect(deserialized.flowState.currentPhase).toBe("main");
    expect(deserialized.flowState.turnNumber).toBeGreaterThan(0);
  });

  it("should restore flow manager from serialized state and continue playing", () => {
    const flow: FlowDefinition<GameState> = {
      gameSegments: {
        mainGame: {
          order: 1,
          turn: {
            onBegin: (context) => {
              context.state.turnCount += 1;
            },
            phases: {
              ready: { order: 0, next: "draw" },
              draw: { order: 1, next: "main" },
              main: { order: 2, next: "end" },
              end: { order: 3, next: undefined },
            },
          },
        },
      },
    };

    // Step 1: Original game session
    const originalState: GameState = {
      currentPlayer: 0,
      players: [
        { id: "p1", name: "Alice", score: 10 },
        { id: "p2", name: "Bob", score: 15 },
      ],
      turnCount: 0,
      log: [],
    };

    const originalManager = new FlowManager(flow, originalState);
    originalManager.nextPhase(); // ready → draw
    originalManager.nextPhase(); // draw → main

    // Step 2: Serialize (save to database)
    const savedState = {
      gameState: originalManager.getGameState(),
      flowState: originalManager.serializeFlowState(),
    };

    const serialized = JSON.stringify(savedState);

    // Step 3: Later... deserialize (load from database)
    const loaded = JSON.parse(serialized);

    // Step 4: Restore game state
    const restoredState = loaded.gameState;
    const restoredFlowState = loaded.flowState;

    // Step 5: Create new FlowManager with restored state
    const restoredManager = new FlowManager(flow, restoredState, {
      restoreFrom: restoredFlowState,
    });

    // Verify: Restored state matches original
    expect(restoredManager.getGameState().players[0].score).toBe(10);
    expect(restoredManager.getGameState().players[1].score).toBe(15);

    // Step 6: Continue playing from restored state
    restoredManager.nextPhase(); // main → end

    expect(restoredManager.getCurrentPhase()).toBe("end");

    // Game continues normally after restoration
    restoredManager.nextPhase(); // end → new turn (ready phase)
    expect(restoredManager.getCurrentPhase()).toBe("ready");
    expect(restoredManager.getGameState().turnCount).toBeGreaterThan(1);
  });

  it("should preserve step state during serialization", () => {
    const flow: FlowDefinition<GameState> = {
      gameSegments: {
        mainGame: {
          order: 1,
          turn: {
            phases: {
              combat: {
                order: 0,
                next: undefined,
                steps: {
                  declare: {
                    order: 0,
                    next: "target",
                    onBegin: (context) => {
                      context.state.log.push("declare-attackers");
                    },
                  },
                  target: {
                    order: 1,
                    next: "damage",
                    onBegin: (context) => {
                      context.state.log.push("declare-targets");
                    },
                  },
                  damage: {
                    order: 2,
                    next: undefined,
                    onBegin: (context) => {
                      context.state.log.push("deal-damage");
                    },
                  },
                },
              },
            },
          },
        },
      },
    };

    const initialState: GameState = {
      currentPlayer: 0,
      players: [{ id: "p1", name: "Alice", score: 0 }],
      turnCount: 0,
      log: [],
    };

    const manager = new FlowManager(flow, initialState);

    // Progress to middle of combat
    manager.nextStep(); // declare → target

    // Serialize with step information
    const snapshot = {
      game: manager.getGameState(),
      flow: manager.serializeFlowState(),
    };

    const serialized = JSON.stringify(snapshot);
    const restored = JSON.parse(serialized);

    // Verify step was preserved
    expect(restored.flow.currentPhase).toBe("combat");
    expect(restored.flow.currentStep).toBe("target");
    expect(restored.game.log).toContain("declare-attackers");
    expect(restored.game.log).toContain("declare-targets");

    // Create new manager with restored state
    const restoredManager = new FlowManager(flow, restored.game, {
      restoreFrom: restored.flow,
    });

    // Continue from where we left off
    restoredManager.nextStep(); // target → damage

    expect(restoredManager.getCurrentStep()).toBe("damage");
    expect(restoredManager.getGameState().log).toContain("deal-damage");
  });

  it("should handle replay scenario: deserialize multiple snapshots in sequence", () => {
    const flow: FlowDefinition<GameState> = {
      gameSegments: {
        mainGame: {
          order: 1,
          turn: {
            onBegin: (context) => {
              context.state.turnCount += 1;
              context.state.currentPlayer =
                (context.state.currentPlayer + 1) %
                context.state.players.length;
            },
            phases: {
              main: {
                order: 0,
                next: undefined,
                onBegin: (context) => {
                  context.state.log.push(
                    `player-${context.state.currentPlayer}-main`,
                  );
                },
              },
            },
          },
        },
      },
    };

    const initialState: GameState = {
      currentPlayer: 0,
      players: [
        { id: "p1", name: "Alice", score: 0 },
        { id: "p2", name: "Bob", score: 0 },
      ],
      turnCount: 0,
      log: [],
    };

    const manager = new FlowManager(flow, initialState);

    // Simulate game progression with snapshots
    const snapshots: string[] = [];

    // Snapshot 1: After turn 1
    manager.nextTurn();
    snapshots.push(
      JSON.stringify({
        game: manager.getGameState(),
        flow: manager.serializeFlowState(),
      }),
    );

    // Snapshot 2: After turn 2
    manager.nextTurn();
    snapshots.push(
      JSON.stringify({
        game: manager.getGameState(),
        flow: manager.serializeFlowState(),
      }),
    );

    // Snapshot 3: After turn 3
    manager.nextTurn();
    snapshots.push(
      JSON.stringify({
        game: manager.getGameState(),
        flow: manager.serializeFlowState(),
      }),
    );

    // Replay scenario: Load and verify each snapshot
    const snapshot1 = JSON.parse(snapshots[0]);
    expect(snapshot1.game.turnCount).toBe(2); // Initial turn + 1
    expect(snapshot1.flow.turnNumber).toBe(2);

    const snapshot2 = JSON.parse(snapshots[1]);
    expect(snapshot2.game.turnCount).toBe(3);
    expect(snapshot2.flow.turnNumber).toBe(3);

    const snapshot3 = JSON.parse(snapshots[2]);
    expect(snapshot3.game.turnCount).toBe(4);
    expect(snapshot3.flow.turnNumber).toBe(4);

    // Verify log progression
    expect(snapshot1.game.log.length).toBeLessThan(snapshot2.game.log.length);
    expect(snapshot2.game.log.length).toBeLessThan(snapshot3.game.log.length);
  });

  it("should preserve complex game state with nested objects during serialization", () => {
    type ComplexGameState = GameState & {
      cards: Record<string, { id: string; owner: string; zone: string }>;
      zones: Record<string, string[]>;
    };

    const flow: FlowDefinition<ComplexGameState> = {
      gameSegments: {
        mainGame: {
          order: 1,
          turn: {
            phases: {
              main: {
                order: 0,
                next: undefined,
                onBegin: (context) => {
                  // Modify nested structures
                  context.state.cards.card1 = {
                    id: "card1",
                    owner: "p1",
                    zone: "hand",
                  };
                  context.state.zones.hand = ["card1"];
                },
              },
            },
          },
        },
      },
    };

    const initialState: ComplexGameState = {
      currentPlayer: 0,
      players: [{ id: "p1", name: "Alice", score: 0 }],
      turnCount: 0,
      log: [],
      cards: {},
      zones: { hand: [], deck: [], discard: [] },
    };

    const manager = new FlowManager(flow, initialState);

    const gameState = manager.getGameState();

    // Serialize complex nested state
    const serialized = JSON.stringify({
      game: gameState,
      flow: manager.serializeFlowState(),
    });

    // Deserialize
    const restored = JSON.parse(serialized);

    // Verify nested structures preserved
    expect(restored.game.cards.card1).toBeDefined();
    expect(restored.game.cards.card1.owner).toBe("p1");
    expect(restored.game.zones.hand).toEqual(["card1"]);
    expect(Array.isArray(restored.game.zones.deck)).toBe(true);

    // Create new manager and verify it works
    const restoredManager = new FlowManager(flow, restored.game, {
      restoreFrom: restored.flow,
    });
    expect(restoredManager.getGameState().cards.card1).toBeDefined();
  });

  it("should handle serialization with automatic transitions (endIf)", () => {
    const flow: FlowDefinition<GameState> = {
      gameSegments: {
        mainGame: {
          order: 1,
          turn: {
            phases: {
              waiting: {
                order: 0,
                next: "ready",
                endIf: (context) => {
                  // Auto-transition when all players ready
                  return context.state.players.every((p) => p.score > 0);
                },
                onBegin: (context) => {
                  context.state.log.push("waiting-for-players");
                },
              },
              ready: {
                order: 1,
                next: undefined,
                onBegin: (context) => {
                  context.state.log.push("all-players-ready");
                },
              },
            },
          },
        },
      },
    };

    const initialState: GameState = {
      currentPlayer: 0,
      players: [
        { id: "p1", name: "Alice", score: 0 },
        { id: "p2", name: "Bob", score: 0 },
      ],
      turnCount: 0,
      log: [],
    };

    const manager = new FlowManager(flow, initialState);

    expect(manager.getCurrentPhase()).toBe("waiting");

    // Trigger state change that will cause endIf to activate
    manager.updateState((draft) => {
      draft.players[0].score = 10;
      draft.players[1].score = 15;
    });

    // endIf should have triggered automatic transition
    expect(manager.getCurrentPhase()).toBe("ready");

    // Serialize after automatic transition
    const snapshot = {
      game: manager.getGameState(),
      flow: manager.serializeFlowState(),
    };

    const serialized = JSON.stringify(snapshot);
    const restored = JSON.parse(serialized);

    // Verify state after automatic transition was preserved
    expect(restored.flow.currentPhase).toBe("ready");
    expect(restored.game.log).toContain("waiting-for-players");
    expect(restored.game.log).toContain("all-players-ready");
    expect(restored.game.players[0].score).toBe(10);
  });

  it("should validate that FlowManager state is fully reconstructible", () => {
    // This test verifies that we can reconstruct a FlowManager
    // with the exact same state and continue from any point

    const flow: FlowDefinition<GameState> = {
      gameSegments: {
        mainGame: {
          order: 1,
          turn: {
            onBegin: (context) => {
              context.state.turnCount += 1;
            },
            phases: {
              phase1: {
                order: 0,
                next: "phase2",
                steps: {
                  step1: { order: 0, next: "step2" },
                  step2: { order: 1, next: undefined },
                },
              },
              phase2: {
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
      players: [{ id: "p1", name: "Alice", score: 0 }],
      turnCount: 0,
      log: [],
    };

    // Original manager at specific state
    const original = new FlowManager(flow, initialState);
    original.nextStep(); // phase1.step1 → phase1.step2

    // Capture full state
    const fullState = {
      gameState: original.getGameState(),
      flowState: original.serializeFlowState(),
    };

    // Serialize and deserialize
    const serialized = JSON.stringify(fullState);
    const deserialized = JSON.parse(serialized);

    // Create new manager from deserialized state
    const reconstructed = new FlowManager(flow, deserialized.gameState, {
      restoreFrom: deserialized.flowState,
    });

    // Verify reconstruction is accurate
    expect(reconstructed.getGameState()).toEqual(original.getGameState());

    // Both managers should be able to continue identically
    original.nextStep(); // phase1.step2 → phase2
    reconstructed.nextStep(); // phase1.step2 → phase2

    const origPhase = original.getCurrentPhase();
    const origStep = original.getCurrentStep();
    if (origPhase) {
      expect(reconstructed.getCurrentPhase()).toBe(origPhase);
    }
    if (origStep) {
      expect(reconstructed.getCurrentStep()).toBe(origStep);
    }
  });
});
