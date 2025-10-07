import { describe, expect, it } from "bun:test";
import {
  applyPatches,
  enablePatches,
  type Patch,
  produceWithPatches,
} from "immer";
import {
  applyPatchesToState,
  batchApplyPatches,
  deserializePatches,
  reversePatch,
  serializePatches,
  validatePatch,
  validatePatches,
} from "../delta-sync";

// Enable Immer patches
enablePatches();

describe("Delta Synchronization Utilities", () => {
  describe("serializePatches", () => {
    it("should serialize Immer patches to JSON string", () => {
      const patches: Patch[] = [
        { op: "replace", path: ["count"], value: 5 },
        { op: "add", path: ["items", 0], value: "new" },
      ];

      const serialized = serializePatches(patches);

      expect(typeof serialized).toBe("string");
      expect(JSON.parse(serialized)).toEqual(patches);
    });

    it("should handle empty patch array", () => {
      const patches: Patch[] = [];
      const serialized = serializePatches(patches);

      expect(serialized).toBe("[]");
    });

    it("should handle patches with complex values", () => {
      const patches: Patch[] = [
        {
          op: "add",
          path: ["nested", "object"],
          value: { id: "123", data: [1, 2, 3], flag: true },
        },
      ];

      const serialized = serializePatches(patches);
      const deserialized = JSON.parse(serialized);

      expect(deserialized).toEqual(patches);
    });
  });

  describe("deserializePatches", () => {
    it("should deserialize JSON string to Immer patches", () => {
      const patches: Patch[] = [
        { op: "replace", path: ["count"], value: 10 },
        { op: "remove", path: ["items", 1] },
      ];
      const serialized = JSON.stringify(patches);

      const deserialized = deserializePatches(serialized);

      expect(deserialized).toEqual(patches);
    });

    it("should handle empty JSON array", () => {
      const deserialized = deserializePatches("[]");

      expect(deserialized).toEqual([]);
    });

    it("should throw on invalid JSON", () => {
      expect(() => deserializePatches("invalid json")).toThrow();
    });

    it("should throw on non-array JSON", () => {
      expect(() => deserializePatches('{"not": "array"}')).toThrow();
    });
  });

  describe("applyPatchesToState", () => {
    it("should apply patches to state object", () => {
      const state = { count: 0, items: ["a", "b"] };
      const patches: Patch[] = [
        { op: "replace", path: ["count"], value: 5 },
        { op: "add", path: ["items", 2], value: "c" },
      ];

      const newState = applyPatchesToState(state, patches);

      expect(newState.count).toBe(5);
      expect(newState.items).toEqual(["a", "b", "c"]);
      // Original state unchanged
      expect(state.count).toBe(0);
      expect(state.items).toEqual(["a", "b"]);
    });

    it("should handle nested object changes", () => {
      const state = {
        player: { name: "Alice", score: 0 },
        game: { turn: 1 },
      };
      const patches: Patch[] = [
        { op: "replace", path: ["player", "score"], value: 10 },
        { op: "replace", path: ["game", "turn"], value: 2 },
      ];

      const newState = applyPatchesToState(state, patches);

      expect(newState.player.score).toBe(10);
      expect(newState.game.turn).toBe(2);
    });

    it("should handle empty patches array", () => {
      const state = { count: 5 };
      const newState = applyPatchesToState(state, []);

      expect(newState).toEqual(state);
      expect(newState).not.toBe(state); // Should be new object
    });
  });

  describe("reversePatch", () => {
    it("should generate inverse patches for undo", () => {
      const state = { count: 0, items: ["a"] };

      const [newState, patches, inversePatches] = produceWithPatches(
        state,
        (draft) => {
          draft.count = 5;
          draft.items.push("b");
        },
      );

      // Apply reverse patches
      const undoneState = applyPatches(newState, inversePatches);

      expect(undoneState).toEqual(state);
    });

    it("should work with multiple operations", () => {
      const state = {
        players: [{ name: "Alice", score: 0 }],
        turn: 1,
      };

      const [newState, patches, inversePatches] = produceWithPatches(
        state,
        (draft) => {
          draft.players[0].score = 10;
          draft.players.push({ name: "Bob", score: 5 });
          draft.turn = 2;
        },
      );

      const undoneState = applyPatches(newState, inversePatches);

      expect(undoneState).toEqual(state);
    });
  });

  describe("batchApplyPatches", () => {
    it("should apply multiple patch arrays in sequence", () => {
      const state = { count: 0 };
      const batch1: Patch[] = [{ op: "replace", path: ["count"], value: 5 }];
      const batch2: Patch[] = [{ op: "replace", path: ["count"], value: 10 }];
      const batch3: Patch[] = [{ op: "replace", path: ["count"], value: 15 }];

      const newState = batchApplyPatches(state, [batch1, batch2, batch3]);

      expect(newState.count).toBe(15);
    });

    it("should handle empty batch array", () => {
      const state = { count: 5 };
      const newState = batchApplyPatches(state, []);

      expect(newState).toEqual(state);
    });

    it("should work with complex state changes", () => {
      const state = {
        players: [],
        turn: 0,
      };

      const batch1: Patch[] = [
        { op: "add", path: ["players", 0], value: { name: "Alice", score: 0 } },
        { op: "replace", path: ["turn"], value: 1 },
      ];

      const batch2: Patch[] = [
        { op: "replace", path: ["players", 0, "score"], value: 10 },
      ];

      const batch3: Patch[] = [
        { op: "add", path: ["players", 1], value: { name: "Bob", score: 5 } },
        { op: "replace", path: ["turn"], value: 2 },
      ];

      const newState = batchApplyPatches(state, [batch1, batch2, batch3]);

      expect(newState.players).toEqual([
        { name: "Alice", score: 10 },
        { name: "Bob", score: 5 },
      ]);
      expect(newState.turn).toBe(2);
    });
  });

  describe("validatePatch", () => {
    it("should validate correct patch structure", () => {
      const patch: Patch = { op: "replace", path: ["count"], value: 5 };
      const result = validatePatch(patch);

      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it("should detect missing op field", () => {
      const patch = { path: ["count"], value: 5 } as unknown as Patch;
      const result = validatePatch(patch);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Missing required field: op");
    });

    it("should detect invalid op value", () => {
      const patch = {
        op: "invalid",
        path: ["count"],
        value: 5,
      } as unknown as Patch;
      const result = validatePatch(patch);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("should detect missing path field", () => {
      const patch = { op: "replace", value: 5 } as unknown as Patch;
      const result = validatePatch(patch);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Missing required field: path");
    });

    it("should detect non-array path", () => {
      const patch = {
        op: "replace",
        path: "count",
        value: 5,
      } as unknown as Patch;
      const result = validatePatch(patch);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("should validate add operation requires value", () => {
      const patch = { op: "add", path: ["items", 0] } as unknown as Patch;
      const result = validatePatch(patch);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("should allow remove operation without value", () => {
      const patch: Patch = { op: "remove", path: ["items", 0] };
      const result = validatePatch(patch);

      expect(result.valid).toBe(true);
    });
  });

  describe("validatePatches", () => {
    it("should validate array of patches", () => {
      const patches: Patch[] = [
        { op: "replace", path: ["count"], value: 5 },
        { op: "add", path: ["items", 0], value: "new" },
        { op: "remove", path: ["old"] },
      ];

      const result = validatePatches(patches);

      expect(result.valid).toBe(true);
      expect(result.invalidPatches).toEqual([]);
    });

    it("should detect invalid patches in array", () => {
      const patches = [
        { op: "replace", path: ["count"], value: 5 },
        { op: "invalid", path: ["bad"] }, // Invalid
        { path: ["missing"], value: 10 }, // Missing op
      ] as unknown as Patch[];

      const result = validatePatches(patches);

      expect(result.valid).toBe(false);
      expect(result.invalidPatches.length).toBe(2);
      expect(result.invalidPatches[0].index).toBe(1);
      expect(result.invalidPatches[1].index).toBe(2);
    });

    it("should handle empty array", () => {
      const result = validatePatches([]);

      expect(result.valid).toBe(true);
      expect(result.invalidPatches).toEqual([]);
    });
  });

  describe("Round-trip serialization", () => {
    it("should survive serialize -> deserialize -> apply", () => {
      const state = { count: 0, items: ["a", "b"] };

      // Generate patches
      const [newState, patches] = produceWithPatches(state, (draft) => {
        draft.count = 10;
        draft.items.push("c");
      });

      // Serialize
      const serialized = serializePatches(patches);

      // Deserialize
      const deserialized = deserializePatches(serialized);

      // Apply to original state
      const resultState = applyPatchesToState(state, deserialized);

      expect(resultState).toEqual(newState);
    });
  });
});
