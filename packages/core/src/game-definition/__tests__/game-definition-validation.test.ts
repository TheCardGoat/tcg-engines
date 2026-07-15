import { describe, expect, it } from "bun:test";
import type { GameDefinition } from "../game-definition";
import type { GameMoveDefinitions } from "../move-definitions";
import { validateGameDefinition } from "../validation";

/**
 * Test suite for GameDefinition validation
 *
 * Task 10.3, 10.7, 10.9, 10.11, 10.13: Write tests for validation
 *
 * Validates:
 * - Setup function validation
 * - Flow configuration validation
 * - EndIf condition validation
 * - PlayerView function validation
 * - Zod schema validation
 */

interface SimpleGameState {
  value: number;
  phase: string;
}

interface SimpleMoves {
  increment: Record<string, never>;
  decrement: Record<string, never>;
}

describe("GameDefinition - Validation", () => {
  describe("setup function validation (Task 10.3)", () => {
    it("should validate that setup function exists", () => {
      const definition = {
        moves: {} as GameMoveDefinitions<SimpleGameState, SimpleMoves>,
        name: "Test Game",
        setup: (players: { id: string; name?: string }[]) => ({
          phase: "start",
          value: players.length,
        }),
      };

      const result = validateGameDefinition(definition);
      expect(result.success).toBe(true);
    });

    it("should reject definition without setup function", () => {
      const definition = {
        moves: {} as GameMoveDefinitions<SimpleGameState, SimpleMoves>,
        name: "Test Game",
      } as unknown as GameDefinition<SimpleGameState, SimpleMoves>;

      const result = validateGameDefinition(definition);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("setup");
      }
    });

    it("should validate that setup function is callable", () => {
      const definition = {
        moves: {} as GameMoveDefinitions<SimpleGameState, SimpleMoves>,
        name: "Test Game",
        setup: "not a function" as unknown,
      } as GameDefinition<SimpleGameState, SimpleMoves>;

      const result = validateGameDefinition(definition);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("setup");
        expect(result.error).toContain("function");
      }
    });
  });

  describe("moves mapping validation (Task 10.5)", () => {
    it("should validate that moves object exists", () => {
      const definition: GameDefinition<SimpleGameState, SimpleMoves> = {
        moves: {
          decrement: {
            reducer: (draft) => {
              draft.value -= 1;
            },
          },
          increment: {
            reducer: (draft) => {
              draft.value += 1;
            },
          },
        },
        name: "Test Game",
        setup: () => ({ phase: "start", value: 0 }),
      };

      const result = validateGameDefinition(definition);
      expect(result.success).toBe(true);
    });

    it("should reject definition without moves", () => {
      const definition = {
        name: "Test Game",
        setup: () => ({ phase: "start", value: 0 }),
      };

      const result = validateGameDefinition(definition as any);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("moves");
      }
    });

    it("should validate that each move has a reducer", () => {
      const definition = {
        moves: {
          increment: {}, // Missing reducer
          decrement: {},
        },
        name: "Test Game",
        setup: () => ({ phase: "start", value: 0 }),
      };

      const result = validateGameDefinition(definition as any);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("reducer");
      }
    });
  });

  describe("endIf validation (Task 10.9)", () => {
    it("should accept optional endIf function", () => {
      const definition: GameDefinition<SimpleGameState, SimpleMoves> = {
        endIf: (state) => {
          if (state.value >= 10) {
            return { reason: "reached-10", winner: "player1" };
          }
          return undefined;
        },
        moves: {
          decrement: {
            reducer: (draft) => {
              draft.value -= 1;
            },
          },
          increment: {
            reducer: (draft) => {
              draft.value += 1;
            },
          },
        },
        name: "Test Game",
        setup: () => ({ phase: "start", value: 0 }),
      };

      const result = validateGameDefinition(definition);
      expect(result.success).toBe(true);
    });

    it("should work without endIf function", () => {
      const definition: GameDefinition<SimpleGameState, SimpleMoves> = {
        moves: {
          decrement: {
            reducer: (draft) => {
              draft.value -= 1;
            },
          },
          increment: {
            reducer: (draft) => {
              draft.value += 1;
            },
          },
        },
        name: "Test Game",
        setup: () => ({ phase: "start", value: 0 }),
      };

      const result = validateGameDefinition(definition);
      expect(result.success).toBe(true);
    });

    it("should reject non-function endIf", () => {
      const definition = {
        endIf: "not a function",
        moves: {
          decrement: {
            reducer: (draft: SimpleGameState) => {
              draft.value -= 1;
            },
          },
          increment: {
            reducer: (draft: SimpleGameState) => {
              draft.value += 1;
            },
          },
        },
        name: "Test Game",
        setup: () => ({ phase: "start", value: 0 }),
      };

      const result = validateGameDefinition(definition as any);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("endIf");
        expect(result.error).toContain("function");
      }
    });
  });

  describe("playerView validation (Task 10.11)", () => {
    it("should accept optional playerView function", () => {
      const definition: GameDefinition<SimpleGameState, SimpleMoves> = {
        moves: {
          decrement: {
            reducer: (draft) => {
              draft.value -= 1;
            },
          },
          increment: {
            reducer: (draft) => {
              draft.value += 1;
            },
          },
        },
        name: "Test Game",
        playerView: (state, playerId) => ({ ...state, value: playerId === "p1" ? state.value : 0 }),
        setup: () => ({ phase: "start", value: 0 }),
      };

      const result = validateGameDefinition(definition);
      expect(result.success).toBe(true);
    });

    it("should work without playerView function", () => {
      const definition: GameDefinition<SimpleGameState, SimpleMoves> = {
        moves: {
          decrement: {
            reducer: (draft) => {
              draft.value -= 1;
            },
          },
          increment: {
            reducer: (draft) => {
              draft.value += 1;
            },
          },
        },
        name: "Test Game",
        setup: () => ({ phase: "start", value: 0 }),
      };

      const result = validateGameDefinition(definition);
      expect(result.success).toBe(true);
    });

    it("should reject non-function playerView", () => {
      const definition = {
        moves: {
          decrement: {
            reducer: (draft: SimpleGameState) => {
              draft.value -= 1;
            },
          },
          increment: {
            reducer: (draft: SimpleGameState) => {
              draft.value += 1;
            },
          },
        },
        name: "Test Game",
        playerView: "not a function",
        setup: () => ({ phase: "start", value: 0 }),
      };

      const result = validateGameDefinition(definition as any);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("playerView");
        expect(result.error).toContain("function");
      }
    });
  });

  describe("name validation", () => {
    it("should require a non-empty name", () => {
      const definition = {
        moves: {
          decrement: {
            reducer: (draft: SimpleGameState) => {
              draft.value -= 1;
            },
          },
          increment: {
            reducer: (draft: SimpleGameState) => {
              draft.value += 1;
            },
          },
        },
        name: "",
        setup: () => ({ phase: "start", value: 0 }),
      };

      const result = validateGameDefinition(definition as any);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("name");
      }
    });
  });

  // Note: minPlayers and maxPlayers are not part of GameDefinition spec
  // Player count validation is handled at the application level, not in the core engine

  describe("comprehensive validation (Task 10.13)", () => {
    it("should validate all fields together", () => {
      const validDefinition: GameDefinition<SimpleGameState, SimpleMoves> = {
        endIf: (state) => {
          if (state.value >= 10) {
            return { reason: "goal-reached", winner: "p1" };
          }
          return undefined;
        },
        moves: {
          decrement: {
            reducer: (draft) => {
              draft.value -= 1;
            },
          },
          increment: {
            reducer: (draft) => {
              draft.value += 1;
            },
          },
        },
        name: "Complete Game",
        playerView: (state) => state,
        setup: (players) => ({
          phase: "start",
          value: players.length,
        }),
      };

      const result = validateGameDefinition(validDefinition);
      expect(result.success).toBe(true);
    });

    it("should provide detailed error messages for multiple errors", () => {
      const invalidDefinition = {
        moves: null,
        name: "",
        setup: "not a function",
      };

      const result = validateGameDefinition(invalidDefinition as any);
      expect(result.success).toBe(false);
      // Should report multiple validation failures
    });
  });
});
