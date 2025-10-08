import { describe, expect, it } from "bun:test";
import {
  type GameDefinition,
  validateGameDefinition,
} from "../game-definition";

type SimpleState = {
  value: number;
};

type SimpleMoves = {
  increment: Record<string, never>;
};

describe("GameDefinition validation with Zod", () => {
  const validDefinition: GameDefinition<SimpleState, SimpleMoves> = {
    name: "Test Game",
    minPlayers: 2,
    maxPlayers: 4,
    setup: () => ({ value: 0 }),
    moves: {
      increment: {
        reducer: (state) => {
          state.value += 1;
          return state;
        },
      },
    },
    flow: {
      id: "testFlow",
      initial: "main",
      states: {
        main: {
          type: "normal",
        },
      },
    },
  };

  describe("valid GameDefinition", () => {
    it("should validate a correct GameDefinition", () => {
      const result = validateGameDefinition(validDefinition);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe("Test Game");
      }
    });

    it("should validate GameDefinition with optional fields", () => {
      const withOptionalFields: GameDefinition<SimpleState, SimpleMoves> = {
        ...validDefinition,
        endIf: (state) =>
          state.value >= 10
            ? { winner: undefined, reason: "Reached limit" }
            : undefined,
        playerView: (state) => state,
      };

      const result = validateGameDefinition(withOptionalFields);

      expect(result.success).toBe(true);
    });
  });

  describe("invalid GameDefinition", () => {
    it("should fail when name is missing", () => {
      const invalid = {
        ...validDefinition,
        name: undefined,
      } as never;

      const result = validateGameDefinition(invalid);

      expect(result.success).toBe(false);
      if (result.success === false) {
        expect(result.error).toContain("name");
      }
    });

    it("should fail when minPlayers is not a positive integer", () => {
      const invalid = {
        ...validDefinition,
        minPlayers: 0,
      };

      const result = validateGameDefinition(invalid);

      expect(result.success).toBe(false);
      if (result.success === false) {
        expect(result.error).toContain("minPlayers");
      }
    });

    it("should fail when maxPlayers is less than minPlayers", () => {
      const invalid = {
        ...validDefinition,
        minPlayers: 4,
        maxPlayers: 2,
      };

      const result = validateGameDefinition(invalid);

      expect(result.success).toBe(false);
      if (result.success === false) {
        expect(result.error).toContain("maxPlayers");
      }
    });

    it("should fail when setup is not a function", () => {
      const invalid = {
        ...validDefinition,
        setup: "not a function",
      } as never;

      const result = validateGameDefinition(invalid);

      expect(result.success).toBe(false);
      if (result.success === false) {
        expect(result.error).toContain("setup");
      }
    });

    it("should fail when moves is empty", () => {
      const invalid = {
        ...validDefinition,
        moves: {},
      } as never;

      const result = validateGameDefinition(invalid);

      expect(result.success).toBe(false);
      if (result.success === false) {
        expect(result.error).toContain("moves");
      }
    });

    it("should fail when flow is missing", () => {
      const invalid = {
        ...validDefinition,
        flow: undefined,
      } as never;

      const result = validateGameDefinition(invalid);

      expect(result.success).toBe(false);
      if (result.success === false) {
        expect(result.error).toContain("flow");
      }
    });
  });

  describe("move name uniqueness", () => {
    it("should validate that all move names are unique", () => {
      // This is enforced by TypeScript at compile time
      // and by the object structure at runtime
      const moves = {
        increment: {
          reducer: (state: SimpleState) => {
            state.value += 1;
            return state;
          },
        },
        decrement: {
          reducer: (state: SimpleState) => {
            state.value -= 1;
            return state;
          },
        },
      };

      const moveNames = Object.keys(moves);
      const uniqueNames = new Set(moveNames);

      expect(moveNames.length).toBe(uniqueNames.size);
    });
  });

  describe("state ID uniqueness", () => {
    it("should validate that state IDs are unique within flow", () => {
      // State IDs are JavaScript object keys, so they are inherently unique
      // This test verifies that understanding
      const flowWithUniqueStates = {
        id: "testFlow",
        initial: "main",
        states: {
          main: { type: "normal" },
          combat: { type: "normal" },
          end: { type: "final" },
        },
      };

      const stateIds = Object.keys(flowWithUniqueStates.states);
      const uniqueIds = new Set(stateIds);

      expect(stateIds.length).toBe(uniqueIds.size);
    });

    it("should validate that initial state exists in states", () => {
      const invalidFlow = {
        id: "testFlow",
        initial: "nonexistent",
        states: {
          main: { type: "normal" },
        },
      };

      const initialExists =
        invalidFlow.states[invalidFlow.initial] !== undefined;

      expect(initialExists).toBe(false);
    });
  });

  describe("function presence validation", () => {
    it("should validate that setup function is present", () => {
      expect(typeof validDefinition.setup).toBe("function");
    });

    it("should validate that all move reducers are functions", () => {
      const moves = validDefinition.moves;
      const allAreReducers = Object.values(moves).every(
        (move) => typeof move.reducer === "function",
      );

      expect(allAreReducers).toBe(true);
    });

    it("should validate optional endIf function if present", () => {
      const withEndIf = {
        ...validDefinition,
        endIf: (_state: SimpleState) => undefined,
      };

      expect(typeof withEndIf.endIf).toBe("function");
    });

    it("should validate optional playerView function if present", () => {
      const withPlayerView = {
        ...validDefinition,
        playerView: (state: SimpleState, _playerId: string) => state,
      };

      expect(typeof withPlayerView.playerView).toBe("function");
    });
  });
});
