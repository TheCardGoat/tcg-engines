import { describe, expect, it } from "bun:test";
import { RuleEngine } from "../engine/rule-engine";
import type { FlowDefinition } from "../flow/flow-definition";
import type { GameDefinition } from "../game-definition/game-definition";
import type { GameMoveDefinitions } from "../game-definition/move-definitions";
import { createPlayerId, type PlayerId } from "../types";
import { expectPhaseTransition } from "./test-flow-assertions";

/**
 * Test state for flow assertions
 */
type FlowTestState = {
  players: Array<{
    id: PlayerId;
    name: string;
  }>;
  phase: "draw" | "main" | "end";
  turnNumber: number;
};

type FlowTestMoves = {
  nextPhase: Record<string, never>;
};

describe("test-flow-assertions", () => {
  function createTestEngine() {
    const moves: GameMoveDefinitions<FlowTestState, FlowTestMoves> = {
      nextPhase: {
        reducer: (draft) => {
          // Transition through phases
          if (draft.phase === "draw") {
            draft.phase = "main";
          } else if (draft.phase === "main") {
            draft.phase = "end";
          } else if (draft.phase === "end") {
            draft.phase = "draw";
            draft.turnNumber += 1;
          }
        },
      },
    };

    const flow: FlowDefinition<FlowTestState> = {
      turn: {
        onBegin: (context) => {
          context.state.phase = "draw";
        },
        phases: {
          draw: {
            order: 0,
            next: "main",
          },
          main: {
            order: 1,
            next: "end",
          },
          end: {
            order: 2,
            next: undefined,
          },
        },
      },
    };

    const gameDefinition: GameDefinition<FlowTestState, FlowTestMoves> = {
      name: "Flow Test Game",
      setup: (players) => ({
        players: players.map((p) => ({
          id: p.id as PlayerId,
          name: p.name || "Player",
        })),
        phase: "draw" as const,
        turnNumber: 1,
      }),
      moves,
      flow,
    };

    const players = [
      { id: createPlayerId("p1"), name: "Alice" },
      { id: createPlayerId("p2"), name: "Bob" },
    ];

    return new RuleEngine(gameDefinition, players);
  }

  describe("expectPhaseTransition", () => {
    it("should pass when phase transitions correctly", () => {
      const engine = createTestEngine();

      // Should not throw
      expectPhaseTransition(
        engine,
        "nextPhase",
        { playerId: createPlayerId("p1"), params: {} },
        "draw",
        "main",
      );
    });

    it("should throw when initial phase does not match", () => {
      const engine = createTestEngine();

      expect(() => {
        expectPhaseTransition(
          engine,
          "nextPhase",
          { playerId: createPlayerId("p1"), params: {} },
          "main", // Wrong initial phase
          "end",
        );
      }).toThrow(/Expected initial phase to be 'main'/);
    });

    it("should throw when final phase does not match", () => {
      const engine = createTestEngine();

      expect(() => {
        expectPhaseTransition(
          engine,
          "nextPhase",
          { playerId: createPlayerId("p1"), params: {} },
          "draw",
          "end", // Wrong final phase (should be 'main')
        );
      }).toThrow(/Expected final phase to be 'end'/);
    });

    it("should work with multiple transitions", () => {
      const engine = createTestEngine();

      expectPhaseTransition(
        engine,
        "nextPhase",
        { playerId: createPlayerId("p1"), params: {} },
        "draw",
        "main",
      );

      expectPhaseTransition(
        engine,
        "nextPhase",
        { playerId: createPlayerId("p1"), params: {} },
        "main",
        "end",
      );

      expectPhaseTransition(
        engine,
        "nextPhase",
        { playerId: createPlayerId("p1"), params: {} },
        "end",
        "draw",
      );
    });

    it("should handle move failures", () => {
      const _engine = createTestEngine();

      // Create a move that will fail
      const moves: GameMoveDefinitions<FlowTestState, FlowTestMoves> = {
        nextPhase: {
          condition: () => false, // Always fails
          reducer: () => {},
        },
      };

      const flow: FlowDefinition<FlowTestState> = {
        turn: {
          phases: {
            draw: { order: 0, next: "main" },
            main: { order: 1, next: undefined },
          },
        },
      };

      const gameDefinition: GameDefinition<FlowTestState, FlowTestMoves> = {
        name: "Failing Flow Test",
        setup: (players) => ({
          players: players.map((p) => ({
            id: p.id as PlayerId,
            name: p.name || "Player",
          })),
          phase: "draw" as const,
          turnNumber: 1,
        }),
        moves,
        flow,
      };

      const failEngine = new RuleEngine(gameDefinition, [
        { id: createPlayerId("p1"), name: "Alice" },
      ]);

      expect(() => {
        expectPhaseTransition(
          failEngine,
          "nextPhase",
          { playerId: createPlayerId("p1"), params: {} },
          "draw",
          "main",
        );
      }).toThrow(/Move failed/);
    });

    it("should work with FlowManager integration", () => {
      const engine = createTestEngine();
      const flowManager = engine.getFlowManager();

      expect(flowManager).toBeDefined();
      expect(flowManager?.getCurrentPhase()).toBe("draw");

      // Transition phase
      expectPhaseTransition(
        engine,
        "nextPhase",
        { playerId: createPlayerId("p1"), params: {} },
        "draw",
        "main",
      );

      // Note: FlowManager tracks its own phase state separate from game state
      // This test verifies that expectPhaseTransition works with engines that have FlowManager
      const state = engine.getState();
      expect(state.phase).toBe("main");
    });

    it("should accept phase path for nested state", () => {
      // Create engine with nested phase in state
      type NestedFlowState = {
        players: Array<{ id: PlayerId; name: string }>;
        gameState: {
          currentPhase: "start" | "middle" | "end";
        };
        turnNumber: number;
      };

      type NestedMoves = {
        advance: Record<string, never>;
      };

      const moves: GameMoveDefinitions<NestedFlowState, NestedMoves> = {
        advance: {
          reducer: (draft) => {
            if (draft.gameState.currentPhase === "start") {
              draft.gameState.currentPhase = "middle";
            } else if (draft.gameState.currentPhase === "middle") {
              draft.gameState.currentPhase = "end";
            }
          },
        },
      };

      const gameDefinition: GameDefinition<NestedFlowState, NestedMoves> = {
        name: "Nested Flow Test",
        setup: (players) => ({
          players: players.map((p) => ({
            id: p.id as PlayerId,
            name: p.name || "Player",
          })),
          gameState: {
            currentPhase: "start" as const,
          },
          turnNumber: 1,
        }),
        moves,
      };

      const nestedEngine = new RuleEngine(gameDefinition, [
        { id: createPlayerId("p1"), name: "Alice" },
      ]);

      // Should work with custom phase path
      expectPhaseTransition(
        nestedEngine,
        "advance",
        { playerId: createPlayerId("p1"), params: {} },
        "start",
        "middle",
        "gameState.currentPhase",
      );
    });
  });
});
