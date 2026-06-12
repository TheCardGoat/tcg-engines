import { describe, expect, it } from "bun:test";
import { getMoveCategoryId, sortMoveCategories } from "./move-presentation";

describe("move-presentation", () => {
  describe("getMoveCategoryId", () => {
    it("maps questWithAll to quest-all category", () => {
      expect(getMoveCategoryId("questWithAll")).toBe("quest-all");
    });

    it("maps quest to quest category", () => {
      expect(getMoveCategoryId("quest")).toBe("quest");
    });

    it("maps undo to undo category", () => {
      expect(getMoveCategoryId("undo")).toBe("undo");
    });

    it("returns unknown for unrecognized move IDs", () => {
      expect(getMoveCategoryId("unknownMove")).toBe("unknown");
    });
  });

  describe("sortMoveCategories", () => {
    it("places quest-all after quest in sort order", () => {
      const groups = [
        { id: "quest-all" as const, label: "Quest All", count: 1 },
        { id: "quest" as const, label: "Quest", count: 2 },
        { id: "play-card" as const, label: "Play", count: 3 },
      ];

      const sorted = sortMoveCategories(groups);

      const questIndex = sorted.findIndex((g) => g.id === "quest");
      const questAllIndex = sorted.findIndex((g) => g.id === "quest-all");

      expect(questIndex).toBeGreaterThanOrEqual(0);
      expect(questAllIndex).toBeGreaterThanOrEqual(0);
      expect(questAllIndex).toBeGreaterThan(questIndex);
    });

    it("preserves original order for groups with same priority", () => {
      const groups = [
        { id: "quest" as const, label: "Quest A", count: 1 },
        { id: "quest" as const, label: "Quest B", count: 2 },
      ];

      const sorted = sortMoveCategories(groups);

      expect(sorted[0].label).toBe("Quest A");
      expect(sorted[1].label).toBe("Quest B");
    });
  });
});
