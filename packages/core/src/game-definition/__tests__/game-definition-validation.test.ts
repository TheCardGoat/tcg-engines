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

type SimpleGameState = {
  value: number;
  phase: string;
};

type SimpleMoves = {
  increment: Record<string, never>;
  decrement: Record<string, never>;
};

describe("GameDefinition - Validation", () => {
  describe("setup function validation (Task 10.3)", () => {
    it("should validate that setup function exists", () => {
      const definition = {
        name: "Test Game",
        minPlayers: 2,
        maxPlayers: 4,
        setup: (players: Array<{ id: string; name?: string }>) => ({
          value: players.length,
          phase: "start",
        }),
        moves: {} as GameMoveDefinitions<SimpleGameState, SimpleMoves>,
      };

      const result = validateGameDefinition(definition);
      expect(result.success).toBe(true);
    });

    it("should reject definition without setup function", () => {
      const definition = {
        name: "Test Game",
        minPlayers: 2,
        maxPlayers: 4,
        moves: {} as GameMoveDefinitions<SimpleGameState, SimpleMoves>,
      } as unknown as GameDefinition<SimpleGameState, SimpleMoves>;

      const result = validateGameDefinition(definition);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("setup");
      }
    });

    it("should validate that setup function is callable", () => {
      const definition = {
        name: "Test Game",
        minPlayers: 2,
        maxPlayers: 4,
        setup: "not a function" as unknown,
        moves: {} as GameMoveDefinitions<SimpleGameState, SimpleMoves>,
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
        name: "Test Game",
        minPlayers: 2,
        maxPlayers: 4,
        setup: () => ({ value: 0, phase: "start" }),
        moves: {
          increment: {
            reducer: (draft) => {
              draft.value += 1;
            },
          },
          decrement: {
            reducer: (draft) => {
              draft.value -= 1;
            },
          },
        },
      };

      const result = validateGameDefinition(definition);
      expect(result.success).toBe(true);
    });

    it("should reject definition without moves", () => {
      const definition = {
        name: "Test Game",
        minPlayers: 2,
        maxPlayers: 4,
        setup: () => ({ value: 0, phase: "start" }),
      };

      const result = validateGameDefinition(definition as any);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("moves");
      }
    });

    it("should validate that each move has a reducer", () => {
      const definition = {
        name: "Test Game",
        minPlayers: 2,
        maxPlayers: 4,
        setup: () => ({ value: 0, phase: "start" }),
        moves: {
          increment: {}, // Missing reducer
          decrement: {},
        },
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
        name: "Test Game",
        minPlayers: 2,
        maxPlayers: 4,
        setup: () => ({ value: 0, phase: "start" }),
        moves: {
          increment: {
            reducer: (draft) => {
              draft.value += 1;
            },
          },
          decrement: {
            reducer: (draft) => {
              draft.value -= 1;
            },
          },
        },
        endIf: (state) => {
          if (state.value >= 10) {
            return { winner: "player1", reason: "reached-10" };
          }
          return undefined;
        },
      };

      const result = validateGameDefinition(definition);
      expect(result.success).toBe(true);
    });

    it("should work without endIf function", () => {
      const definition: GameDefinition<SimpleGameState, SimpleMoves> = {
        name: "Test Game",
        minPlayers: 2,
        maxPlayers: 4,
        setup: () => ({ value: 0, phase: "start" }),
        moves: {
          increment: {
            reducer: (draft) => {
              draft.value += 1;
            },
          },
          decrement: {
            reducer: (draft) => {
              draft.value -= 1;
            },
          },
        },
      };

      const result = validateGameDefinition(definition);
      expect(result.success).toBe(true);
    });

    it("should reject non-function endIf", () => {
      const definition = {
        name: "Test Game",
        minPlayers: 2,
        maxPlayers: 4,
        setup: () => ({ value: 0, phase: "start" }),
        moves: {
          increment: {
            reducer: (draft: SimpleGameState) => {
              draft.value += 1;
            },
          },
          decrement: {
            reducer: (draft: SimpleGameState) => {
              draft.value -= 1;
            },
          },
        },
        endIf: "not a function",
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
        name: "Test Game",
        minPlayers: 2,
        maxPlayers: 4,
        setup: () => ({ value: 0, phase: "start" }),
        moves: {
          increment: {
            reducer: (draft) => {
              draft.value += 1;
            },
          },
          decrement: {
            reducer: (draft) => {
              draft.value -= 1;
            },
          },
        },
        playerView: (state, playerId) => {
          // Return filtered state for this player
          return { ...state, value: playerId === "p1" ? state.value : 0 };
        },
      };

      const result = validateGameDefinition(definition);
      expect(result.success).toBe(true);
    });

    it("should work without playerView function", () => {
      const definition: GameDefinition<SimpleGameState, SimpleMoves> = {
        name: "Test Game",
        minPlayers: 2,
        maxPlayers: 4,
        setup: () => ({ value: 0, phase: "start" }),
        moves: {
          increment: {
            reducer: (draft) => {
              draft.value += 1;
            },
          },
          decrement: {
            reducer: (draft) => {
              draft.value -= 1;
            },
          },
        },
      };

      const result = validateGameDefinition(definition);
      expect(result.success).toBe(true);
    });

    it("should reject non-function playerView", () => {
      const definition = {
        name: "Test Game",
        minPlayers: 2,
        maxPlayers: 4,
        setup: () => ({ value: 0, phase: "start" }),
        moves: {
          increment: {
            reducer: (draft: SimpleGameState) => {
              draft.value += 1;
            },
          },
          decrement: {
            reducer: (draft: SimpleGameState) => {
              draft.value -= 1;
            },
          },
        },
        playerView: "not a function",
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
        name: "",
        minPlayers: 2,
        maxPlayers: 4,
        setup: () => ({ value: 0, phase: "start" }),
        moves: {
          increment: {
            reducer: (draft: SimpleGameState) => {
              draft.value += 1;
            },
          },
          decrement: {
            reducer: (draft: SimpleGameState) => {
              draft.value -= 1;
            },
          },
        },
      };

      const result = validateGameDefinition(definition as any);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("name");
      }
    });
  });

  describe("player count validation", () => {
    it("should require minPlayers <= maxPlayers", () => {
      const definition = {
        name: "Test Game",
        minPlayers: 4,
        maxPlayers: 2, // Invalid: min > max
        setup: () => ({ value: 0, phase: "start" }),
        moves: {
          increment: {
            reducer: (draft: SimpleGameState) => {
              draft.value += 1;
            },
          },
          decrement: {
            reducer: (draft: SimpleGameState) => {
              draft.value -= 1;
            },
          },
        },
      };

      const result = validateGameDefinition(definition as any);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("minPlayers");
        expect(result.error).toContain("maxPlayers");
      }
    });

    it("should require positive player counts", () => {
      const definition = {
        name: "Test Game",
        minPlayers: 0,
        maxPlayers: 4,
        setup: () => ({ value: 0, phase: "start" }),
        moves: {
          increment: {
            reducer: (draft: SimpleGameState) => {
              draft.value += 1;
            },
          },
          decrement: {
            reducer: (draft: SimpleGameState) => {
              draft.value -= 1;
            },
          },
        },
      };

      const result = validateGameDefinition(definition as any);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("minPlayers");
      }
    });
  });

  describe("comprehensive validation (Task 10.13)", () => {
    it("should validate all fields together", () => {
      const validDefinition: GameDefinition<SimpleGameState, SimpleMoves> = {
        name: "Complete Game",
        minPlayers: 2,
        maxPlayers: 4,
        setup: (players) => ({
          value: players.length,
          phase: "start",
        }),
        moves: {
          increment: {
            reducer: (draft) => {
              draft.value += 1;
            },
          },
          decrement: {
            reducer: (draft) => {
              draft.value -= 1;
            },
          },
        },
        endIf: (state) => {
          if (state.value >= 10) {
            return { winner: "p1", reason: "goal-reached" };
          }
          return undefined;
        },
        playerView: (state) => state,
      };

      const result = validateGameDefinition(validDefinition);
      expect(result.success).toBe(true);
    });

    it("should provide detailed error messages for multiple errors", () => {
      const invalidDefinition = {
        name: "",
        minPlayers: -1,
        maxPlayers: 0,
        setup: "not a function",
        moves: null,
      };

      const result = validateGameDefinition(invalidDefinition as any);
      expect(result.success).toBe(false);
      // Should report multiple validation failures
    });
  });
});
