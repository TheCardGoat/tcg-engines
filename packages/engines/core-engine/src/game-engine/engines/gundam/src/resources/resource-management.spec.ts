import { describe, expect, it } from "bun:test";
import type { Result } from "../shared/result";
import type { ResourcePool } from "./resource-management";
import {
  activateAllResources,
  canPayCost,
  createResourcePool,
  getActiveResourceCount,
  getRestedResourceCount,
  getTotalResourceCount,
  payResourceCost,
  placeResource,
  type ResourceError,
} from "./resource-management";

describe("Resource Management System", () => {
  describe("Resource Pool Creation", () => {
    it("creates empty resource pool", () => {
      const pool = createResourcePool();

      expect(getTotalResourceCount(pool)).toBe(0);
      expect(getActiveResourceCount(pool)).toBe(0);
      expect(getRestedResourceCount(pool)).toBe(0);
    });

    it("creates resource pool with initial resources", () => {
      const pool = createResourcePool(5);

      expect(getTotalResourceCount(pool)).toBe(5);
      expect(getActiveResourceCount(pool)).toBe(5);
      expect(getRestedResourceCount(pool)).toBe(0);
    });
  });

  describe("Resource Placement", () => {
    it("places resource from resource deck (Rule 6-4-1)", () => {
      const pool = createResourcePool(0);
      const result = placeResource(pool, "res1");

      expect(result.success).toBe(true);
      if (result.success) {
        expect(getTotalResourceCount(result.data)).toBe(1);
        expect(getActiveResourceCount(result.data)).toBe(1);
        expect(result.data.resources).toContain("res1");
      }
    });

    it("places resource in active state (Rule 4-4-4)", () => {
      const pool = createResourcePool(0);
      const result = placeResource(pool, "res1");

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.activeResources).toContain("res1");
      }
    });

    it("returns error when exceeding resource area limit (15 max)", () => {
      const pool = createResourcePool(15);
      const result = placeResource(pool, "res16");

      if (result.success) throw new Error("Expected error result");
      expect(result.success).toBe(false);
      expect(result.error.type).toBe("resourceAreaFull");
      expect(result.error.currentCount).toBe(15);
      expect(result.error.maxCapacity).toBe(15);
    });

    it("allows placing resource at capacity minus one", () => {
      const pool = createResourcePool(14);
      const result = placeResource(pool, "res15");

      expect(result.success).toBe(true);
      if (result.success) {
        expect(getTotalResourceCount(result.data)).toBe(15);
      }
    });

    it("maintains immutability when placing resource", () => {
      const pool = createResourcePool(2);
      const originalCount = getTotalResourceCount(pool);

      const result = placeResource(pool, "res3");

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).not.toBe(pool);
        expect(getTotalResourceCount(pool)).toBe(originalCount);
        expect(getTotalResourceCount(result.data)).toBe(3);
      }
    });
  });

  describe("Resource Cost Payment", () => {
    it("pays cost by resting active resources (Rule 2-9-1)", () => {
      const pool = createResourcePool(5);
      const result = payResourceCost(pool, 3);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(getActiveResourceCount(result.data)).toBe(2);
        expect(getRestedResourceCount(result.data)).toBe(3);
        expect(getTotalResourceCount(result.data)).toBe(5);
      }
    });

    it("returns error when insufficient active resources", () => {
      const pool = createResourcePool(2);
      const result = payResourceCost(pool, 5);

      if (result.success) throw new Error("Expected error result");
      expect(result.success).toBe(false);
      expect(result.error.type).toBe("insufficientResources");
      expect(result.error.required).toBe(5);
      expect(result.error.available).toBe(2);
    });

    it("allows paying cost of 0", () => {
      const pool = createResourcePool(3);
      const result = payResourceCost(pool, 0);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(getActiveResourceCount(result.data)).toBe(3);
        expect(getRestedResourceCount(result.data)).toBe(0);
      }
    });

    it("can pay exact cost matching active resources", () => {
      const pool = createResourcePool(4);
      const result = payResourceCost(pool, 4);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(getActiveResourceCount(result.data)).toBe(0);
        expect(getRestedResourceCount(result.data)).toBe(4);
      }
    });

    it("maintains immutability when paying cost", () => {
      const pool = createResourcePool(5);
      const originalActive = getActiveResourceCount(pool);

      const result = payResourceCost(pool, 2);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).not.toBe(pool);
        expect(getActiveResourceCount(pool)).toBe(originalActive);
        expect(getActiveResourceCount(result.data)).toBe(3);
      }
    });

    it("does not count rested resources when paying cost", () => {
      const pool = createResourcePool(5);
      // Rest 3 resources first
      const paidResult = payResourceCost(pool, 3);
      expect(paidResult.success).toBe(true);

      if (paidResult.success) {
        // Try to pay 3 more (only 2 active remaining)
        const result = payResourceCost(paidResult.data, 3);

        if (result.success) throw new Error("Expected error result");
        expect(result.success).toBe(false);
        expect(result.error.type).toBe("insufficientResources");
        expect(result.error.available).toBe(2);
      }
    });
  });

  describe("Cost Validation", () => {
    it("validates if pool can pay cost", () => {
      const pool = createResourcePool(5);

      expect(canPayCost(pool, 3)).toBe(true);
      expect(canPayCost(pool, 5)).toBe(true);
      expect(canPayCost(pool, 6)).toBe(false);
    });

    it("returns true for cost of 0", () => {
      const pool = createResourcePool(0);
      expect(canPayCost(pool, 0)).toBe(true);
    });

    it("returns false for negative cost", () => {
      const pool = createResourcePool(5);
      expect(canPayCost(pool, -1)).toBe(false);
    });

    it("only considers active resources for validation", () => {
      const pool = createResourcePool(5);
      const paidResult = payResourceCost(pool, 3);
      expect(paidResult.success).toBe(true);

      if (paidResult.success) {
        expect(canPayCost(paidResult.data, 2)).toBe(true);
        expect(canPayCost(paidResult.data, 3)).toBe(false);
      }
    });
  });

  describe("Resource Reset (Turn End)", () => {
    it("activates all rested resources at turn end", () => {
      const pool = createResourcePool(5);
      // Pay cost to rest some resources
      const paidResult = payResourceCost(pool, 3);
      expect(paidResult.success).toBe(true);

      if (paidResult.success) {
        expect(getRestedResourceCount(paidResult.data)).toBe(3);

        // Reset for new turn
        const resetPool = activateAllResources(paidResult.data);

        expect(getActiveResourceCount(resetPool)).toBe(5);
        expect(getRestedResourceCount(resetPool)).toBe(0);
      }
    });

    it("handles empty resource pool", () => {
      const pool = createResourcePool(0);
      const resetPool = activateAllResources(pool);

      expect(getActiveResourceCount(resetPool)).toBe(0);
      expect(getRestedResourceCount(resetPool)).toBe(0);
    });

    it("does not change already active resources", () => {
      const pool = createResourcePool(5);
      const resetPool = activateAllResources(pool);

      expect(getActiveResourceCount(resetPool)).toBe(5);
      expect(getRestedResourceCount(resetPool)).toBe(0);
    });

    it("maintains immutability during reset", () => {
      const pool = createResourcePool(5);
      const paidResult = payResourceCost(pool, 3);
      expect(paidResult.success).toBe(true);

      if (paidResult.success) {
        const resetPool = activateAllResources(paidResult.data);

        expect(resetPool).not.toBe(paidResult.data);
        expect(getRestedResourceCount(paidResult.data)).toBe(3);
        expect(getRestedResourceCount(resetPool)).toBe(0);
      }
    });
  });

  describe("Resource Counting Utilities", () => {
    it("counts total resources correctly", () => {
      const pool = createResourcePool(7);
      expect(getTotalResourceCount(pool)).toBe(7);
    });

    it("counts active resources correctly", () => {
      const pool = createResourcePool(7);
      const paidResult = payResourceCost(pool, 4);
      expect(paidResult.success).toBe(true);

      if (paidResult.success) {
        expect(getActiveResourceCount(paidResult.data)).toBe(3);
      }
    });

    it("counts rested resources correctly", () => {
      const pool = createResourcePool(7);
      const paidResult = payResourceCost(pool, 4);
      expect(paidResult.success).toBe(true);

      if (paidResult.success) {
        expect(getRestedResourceCount(paidResult.data)).toBe(4);
      }
    });

    it("maintains accurate counts through multiple operations", () => {
      const pool = createResourcePool(10);

      // Pay 5
      const paid1 = payResourceCost(pool, 5);
      expect(paid1.success).toBe(true);
      if (!paid1.success) return;

      expect(getActiveResourceCount(paid1.data)).toBe(5);
      expect(getRestedResourceCount(paid1.data)).toBe(5);

      // Pay 3 more
      const paid2 = payResourceCost(paid1.data, 3);
      expect(paid2.success).toBe(true);
      if (!paid2.success) return;

      expect(getActiveResourceCount(paid2.data)).toBe(2);
      expect(getRestedResourceCount(paid2.data)).toBe(8);

      // Reset
      const reset = activateAllResources(paid2.data);
      expect(getActiveResourceCount(reset)).toBe(10);
      expect(getRestedResourceCount(reset)).toBe(0);
    });
  });

  describe("Edge Cases", () => {
    it("handles resource pool with maximum resources (15)", () => {
      const pool = createResourcePool(15);
      expect(getTotalResourceCount(pool)).toBe(15);

      const result = payResourceCost(pool, 15);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(getRestedResourceCount(result.data)).toBe(15);
      }
    });

    it("prevents negative resource counts", () => {
      const pool = createResourcePool(3);
      const result = payResourceCost(pool, -1);

      if (result.success) throw new Error("Expected error result");
      expect(result.success).toBe(false);
      expect(result.error.type).toBe("invalidCost");
    });

    it("handles multiple place operations correctly", () => {
      let pool = createResourcePool(0);

      for (let i = 1; i <= 5; i++) {
        const result = placeResource(pool, `res${i}`);
        expect(result.success).toBe(true);
        if (result.success) {
          pool = result.data;
        }
      }

      expect(getTotalResourceCount(pool)).toBe(5);
      expect(pool.resources).toEqual(["res1", "res2", "res3", "res4", "res5"]);
    });

    it("rejects placing resource with empty string ID", () => {
      const pool = createResourcePool(0);
      const result = placeResource(pool, "");

      if (result.success) throw new Error("Expected error result");
      expect(result.success).toBe(false);
      expect(result.error.type).toBe("invalidResourceId");
      expect(result.error.resourceId).toBe("");
    });

    it("rejects placing resource with whitespace-only ID", () => {
      const pool = createResourcePool(0);
      const result = placeResource(pool, "   ");

      if (result.success) throw new Error("Expected error result");
      expect(result.success).toBe(false);
      expect(result.error.type).toBe("invalidResourceId");
    });

    it("rejects placing duplicate resource ID", () => {
      const pool = createResourcePool(0);
      const result1 = placeResource(pool, "res1");
      expect(result1.success).toBe(true);
      if (!result1.success) return;

      const result2 = placeResource(result1.data, "res1");

      if (result2.success) throw new Error("Expected error result");
      expect(result2.success).toBe(false);
      expect(result2.error.type).toBe("duplicateResource");
      expect(result2.error.resourceId).toBe("res1");
    });

    it("maintains immutability when paying zero cost", () => {
      const pool = createResourcePool(5);
      const result = payResourceCost(pool, 0);

      expect(result.success).toBe(true);
      if (result.success) {
        // Should create new object, not return same reference
        expect(result.data).not.toBe(pool);
        expect(getActiveResourceCount(result.data)).toBe(5);
        expect(getRestedResourceCount(result.data)).toBe(0);
      }
    });
  });

  describe("Type Safety", () => {
    it("enforces ResourcePool type structure", () => {
      const pool = createResourcePool(5);

      // Should have required properties
      expect(pool).toHaveProperty("resources");
      expect(pool).toHaveProperty("activeResources");
      expect(pool).toHaveProperty("restedResources");

      // Arrays should be proper types
      expect(Array.isArray(pool.resources)).toBe(true);
      expect(Array.isArray(pool.activeResources)).toBe(true);
      expect(Array.isArray(pool.restedResources)).toBe(true);
    });

    it("Result type provides type-safe error handling", () => {
      const pool = createResourcePool(2);
      const result = payResourceCost(pool, 5);

      // TypeScript should know this is an error result
      if (!result.success) {
        const errorType: "insufficientResources" | "invalidCost" =
          result.error.type;
        expect(["insufficientResources", "invalidCost"]).toContain(errorType);
      }
    });
  });
});
