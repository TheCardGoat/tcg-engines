import { describe, expect, it } from "bun:test";
import type { ResourcePool } from "../resources/resource-management";
import { createResourcePool } from "../resources/resource-management";
import type { Result } from "../shared/result";
import {
  type Cost,
  type CostError,
  calculateAbilityCost,
  calculateDeploymentCost,
  canPayCost,
  type PaymentContext,
  payCost,
} from "./cost-system";

describe("Cost System", () => {
  describe("Cost Calculation", () => {
    describe("calculateDeploymentCost", () => {
      it("calculates base deployment cost from card", () => {
        const card = { cost: 3 };
        const cost = calculateDeploymentCost(card);

        expect(cost.resourceCost).toBe(3);
        expect(cost.additionalCosts).toEqual([]);
      });

      it("returns zero cost for cards without cost property", () => {
        const card = {};
        const cost = calculateDeploymentCost(card);

        expect(cost.resourceCost).toBe(0);
      });

      it("applies cost reduction effect", () => {
        const card = { cost: 5 };
        const costReduction = 2;
        const cost = calculateDeploymentCost(card, { costReduction });

        expect(cost.resourceCost).toBe(3);
      });

      it("cost reduction cannot go below zero", () => {
        const card = { cost: 2 };
        const costReduction = 5;
        const cost = calculateDeploymentCost(card, { costReduction });

        expect(cost.resourceCost).toBe(0);
      });

      it("calculates cost with multiple cost reduction effects", () => {
        const card = { cost: 7 };
        const costReduction = 3;
        const cost = calculateDeploymentCost(card, { costReduction });

        expect(cost.resourceCost).toBe(4);
      });
    });

    describe("calculateAbilityCost", () => {
      it("parses ① symbol as cost 1", () => {
        const cost = calculateAbilityCost("①");
        expect(cost.resourceCost).toBe(1);
        expect(cost.additionalCosts).toEqual([]);
      });

      it("parses ② symbol as cost 2", () => {
        const cost = calculateAbilityCost("②");
        expect(cost.resourceCost).toBe(2);
      });

      it("parses ③ through ⑩ symbols correctly", () => {
        expect(calculateAbilityCost("③").resourceCost).toBe(3);
        expect(calculateAbilityCost("④").resourceCost).toBe(4);
        expect(calculateAbilityCost("⑤").resourceCost).toBe(5);
        expect(calculateAbilityCost("⑥").resourceCost).toBe(6);
        expect(calculateAbilityCost("⑦").resourceCost).toBe(7);
        expect(calculateAbilityCost("⑧").resourceCost).toBe(8);
        expect(calculateAbilityCost("⑨").resourceCost).toBe(9);
        expect(calculateAbilityCost("⑩").resourceCost).toBe(10);
      });

      it("applies cost reduction to ability costs", () => {
        const cost = calculateAbilityCost("③", { costReduction: 1 });
        expect(cost.resourceCost).toBe(2);
      });

      it("cost reduction cannot go below zero for abilities", () => {
        const cost = calculateAbilityCost("①", { costReduction: 5 });
        expect(cost.resourceCost).toBe(0);
      });

      it("returns zero cost for unrecognized symbols", () => {
        const cost = calculateAbilityCost("X");
        expect(cost.resourceCost).toBe(0);
      });

      it("returns zero cost for empty string", () => {
        const cost = calculateAbilityCost("");
        expect(cost.resourceCost).toBe(0);
      });
    });
  });

  describe("Cost Validation", () => {
    describe("canPayCost", () => {
      it("returns true when player has enough active resources", () => {
        const pool = createResourcePool(5);
        const cost: Cost = { resourceCost: 3, additionalCosts: [] };

        expect(canPayCost(cost, pool)).toBe(true);
      });

      it("returns false when player has insufficient resources", () => {
        const pool = createResourcePool(2);
        const cost: Cost = { resourceCost: 5, additionalCosts: [] };

        expect(canPayCost(cost, pool)).toBe(false);
      });

      it("returns true for zero cost", () => {
        const pool = createResourcePool(0);
        const cost: Cost = { resourceCost: 0, additionalCosts: [] };

        expect(canPayCost(cost, pool)).toBe(true);
      });

      it("returns true when resources exactly match cost", () => {
        const pool = createResourcePool(4);
        const cost: Cost = { resourceCost: 4, additionalCosts: [] };

        expect(canPayCost(cost, pool)).toBe(true);
      });
    });
  });

  describe("Cost Payment", () => {
    describe("payCost", () => {
      it("pays resource cost by resting active resources", () => {
        const pool = createResourcePool(5);
        const cost: Cost = { resourceCost: 3, additionalCosts: [] };
        const context: PaymentContext = { resourcePool: pool };

        const result = payCost(cost, context);

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.updatedResourcePool.activeResources.length).toBe(
            2,
          );
          expect(result.data.updatedResourcePool.restedResources.length).toBe(
            3,
          );
        }
      });

      it("returns error when insufficient resources", () => {
        const pool = createResourcePool(2);
        const cost: Cost = { resourceCost: 5, additionalCosts: [] };
        const context: PaymentContext = { resourcePool: pool };

        const result = payCost(cost, context);

        // TypeScript control flow limitation: requires explicit success check first
        expect(result.success).toBe(false);
        if (result.success === false) {
          expect(result.error.type).toBe("insufficientResources");
          if (result.error.type === "insufficientResources") {
            expect(result.error.required).toBe(5);
            expect(result.error.available).toBe(2);
          }
        }
      });

      it("successfully pays zero cost", () => {
        const pool = createResourcePool(3);
        const cost: Cost = { resourceCost: 0, additionalCosts: [] };
        const context: PaymentContext = { resourcePool: pool };

        const result = payCost(cost, context);

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.updatedResourcePool.activeResources.length).toBe(
            3,
          );
          expect(result.data.updatedResourcePool.restedResources.length).toBe(
            0,
          );
        }
      });

      it("maintains immutability when paying cost", () => {
        const pool = createResourcePool(5);
        const originalActiveCount = pool.activeResources.length;
        const cost: Cost = { resourceCost: 2, additionalCosts: [] };
        const context: PaymentContext = { resourcePool: pool };

        const result = payCost(cost, context);

        expect(result.success).toBe(true);
        if (result.success) {
          // Original pool unchanged
          expect(pool.activeResources.length).toBe(originalActiveCount);
          // New pool reflects payment
          expect(result.data.updatedResourcePool).not.toBe(pool);
          expect(result.data.updatedResourcePool.activeResources.length).toBe(
            3,
          );
        }
      });

      it("pays exact cost matching all active resources", () => {
        const pool = createResourcePool(4);
        const cost: Cost = { resourceCost: 4, additionalCosts: [] };
        const context: PaymentContext = { resourcePool: pool };

        const result = payCost(cost, context);

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.updatedResourcePool.activeResources.length).toBe(
            0,
          );
          expect(result.data.updatedResourcePool.restedResources.length).toBe(
            4,
          );
        }
      });
    });
  });

  describe("Type Safety", () => {
    it("enforces Cost type structure", () => {
      const cost: Cost = {
        resourceCost: 5,
        additionalCosts: [],
      };

      expect(cost).toHaveProperty("resourceCost");
      expect(cost).toHaveProperty("additionalCosts");
      expect(typeof cost.resourceCost).toBe("number");
      expect(Array.isArray(cost.additionalCosts)).toBe(true);
    });

    it("Result type provides type-safe error handling", () => {
      const pool = createResourcePool(1);
      const cost: Cost = { resourceCost: 5, additionalCosts: [] };
      const context: PaymentContext = { resourcePool: pool };

      const result = payCost(cost, context);

      // TypeScript control flow limitation: requires explicit success check first
      expect(result.success).toBe(false);
      if (result.success === false) {
        const errorType:
          | "insufficientResources"
          | "invalidCost"
          | "additionalCostNotMet" = result.error.type;
        expect([
          "insufficientResources",
          "invalidCost",
          "additionalCostNotMet",
        ]).toContain(errorType);
      }
    });
  });
});
