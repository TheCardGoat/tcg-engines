import { describe, expect, it } from "bun:test";
import { countSlotsByType, createPackResult } from "./index";

describe("pack-simulator contract", () => {
  describe("countSlotsByType", () => {
    it("counts slots by their slotType", () => {
      const result = createPackResult("set1", [
        { slotType: "common", cardRef: "c1" },
        { slotType: "common", cardRef: "c2" },
        { slotType: "rare", cardRef: "r1" },
        { slotType: "foil", cardRef: "f1", foil: true },
      ]);

      expect(countSlotsByType(result)).toEqual({
        common: 2,
        rare: 1,
        foil: 1,
      });
    });

    it("returns an empty object for an empty pack", () => {
      const result = createPackResult("set1", []);
      expect(countSlotsByType(result)).toEqual({});
    });
  });

  describe("createPackResult", () => {
    it("builds a result with the provided slots and seed", () => {
      const slots = [{ slotType: "common", cardRef: "c1" }];
      const result = createPackResult("set2", slots, "my-seed");

      expect(result.setId).toBe("set2");
      expect(result.slots).toEqual(slots);
      expect(result.seed).toBe("my-seed");
    });
  });
});
