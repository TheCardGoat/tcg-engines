import { describe, expect, it } from "bun:test";
import { createPlayerId, createZoneId } from "../types";
import type { TargetDefinition, TargetRestriction } from "./target-definition";

describe("Target Definition Types", () => {
  describe("TargetDefinition", () => {
    it("should define target with filter and count", () => {
      const target: TargetDefinition = {
        filter: { zone: createZoneId("play") },
        count: 1,
      };

      expect(target.filter).toBeDefined();
      expect(target.count).toBe(1);
    });

    it("should support optional targets with min/max count", () => {
      const target: TargetDefinition = {
        filter: { type: "creature" },
        count: { min: 0, max: 3 },
      };

      expect(target.count).toEqual({ min: 0, max: 3 });
    });

    it("should support required targets with exact count", () => {
      const target: TargetDefinition = {
        filter: { zone: createZoneId("hand") },
        count: 2,
      };

      expect(target.count).toBe(2);
    });

    it("should support targeting restrictions", () => {
      const target: TargetDefinition = {
        filter: { type: "creature" },
        count: 1,
        restrictions: ["not-self"],
      };

      expect(target.restrictions).toContain("not-self");
    });

    it("should support multiple restrictions", () => {
      const target: TargetDefinition = {
        filter: { zone: createZoneId("play") },
        count: 2,
        restrictions: ["not-self", "different-targets"],
      };

      expect(target.restrictions).toHaveLength(2);
    });

    it("should work without restrictions", () => {
      const target: TargetDefinition = {
        filter: { type: "land" },
        count: 1,
      };

      expect(target.restrictions).toBeUndefined();
    });
  });

  describe("TargetRestriction", () => {
    it("should support 'not-self' restriction", () => {
      const restriction: TargetRestriction = "not-self";
      expect(restriction).toBe("not-self");
    });

    it("should support 'not-controller' restriction", () => {
      const restriction: TargetRestriction = "not-controller";
      expect(restriction).toBe("not-controller");
    });

    it("should support 'not-owner' restriction", () => {
      const restriction: TargetRestriction = "not-owner";
      expect(restriction).toBe("not-owner");
    });

    it("should support 'different-targets' restriction", () => {
      const restriction: TargetRestriction = "different-targets";
      expect(restriction).toBe("different-targets");
    });
  });

  describe("Target Count Types", () => {
    it("should support exact count as number", () => {
      const count: number | { min: number; max: number } = 1;
      expect(count).toBe(1);
    });

    it("should support range with min and max", () => {
      const count: number | { min: number; max: number } = {
        min: 1,
        max: 3,
      };
      expect(count).toEqual({ min: 1, max: 3 });
    });

    it("should support optional targets with min 0", () => {
      const count: number | { min: number; max: number } = {
        min: 0,
        max: 5,
      };
      expect(count.min).toBe(0);
    });

    it("should support unbounded max targets", () => {
      const count: number | { min: number; max: number } = {
        min: 1,
        max: Number.POSITIVE_INFINITY,
      };
      expect(count.max).toBe(Number.POSITIVE_INFINITY);
    });
  });

  describe("Multi-Target Definitions", () => {
    it("should support multiple target groups", () => {
      const targets: TargetDefinition[] = [
        {
          filter: { type: "creature" },
          count: 1,
        },
        {
          filter: { type: "player" },
          count: 1,
        },
      ];

      expect(targets).toHaveLength(2);
      expect(targets[0].filter.type).toBe("creature");
      expect(targets[1].filter.type).toBe("player");
    });

    it("should support optional and required targets together", () => {
      const targets: TargetDefinition[] = [
        {
          filter: { type: "creature" },
          count: 1,
        },
        {
          filter: { type: "land" },
          count: { min: 0, max: 2 },
        },
      ];

      expect(typeof targets[0].count).toBe("number");
      expect(typeof targets[1].count).toBe("object");
    });
  });

  describe("Complex Target Definitions", () => {
    it("should support targets with complex filters", () => {
      const playZone = createZoneId("play");
      const target: TargetDefinition = {
        filter: {
          zone: playZone,
          type: "creature",
          properties: {
            basePower: { gte: 3 },
          },
          tapped: false,
        },
        count: { min: 1, max: 3 },
        restrictions: ["not-self"],
      };

      expect(target.filter.zone).toBe(playZone);
      expect(target.filter.type).toBe("creature");
      expect(target.filter.properties?.basePower).toEqual({ gte: 3 });
      expect(target.filter.tapped).toBe(false);
      expect(target.count).toEqual({ min: 1, max: 3 });
      expect(target.restrictions).toContain("not-self");
    });

    it("should support targets with composite filters", () => {
      const target: TargetDefinition = {
        filter: {
          or: [{ type: "creature" }, { type: "artifact" }],
        },
        count: 2,
        restrictions: ["different-targets"],
      };

      expect(target.filter.or).toBeDefined();
      expect(target.filter.or).toHaveLength(2);
      expect(target.restrictions).toContain("different-targets");
    });
  });

  describe("Real-World Examples", () => {
    it("should model Lightning Bolt (1 target, any creature or player)", () => {
      const target: TargetDefinition = {
        filter: {
          or: [{ type: "creature" }, { type: "player" }],
        },
        count: 1,
      };

      expect(target.count).toBe(1);
      expect(target.filter.or).toHaveLength(2);
    });

    it("should model Wrath of God (no targets)", () => {
      const targets: TargetDefinition[] = [];

      expect(targets).toHaveLength(0);
    });

    it("should model Fireball (1 required target, additional optional)", () => {
      const targets: TargetDefinition[] = [
        {
          filter: {
            or: [{ type: "creature" }, { type: "player" }],
          },
          count: 1,
        },
        {
          filter: {
            or: [{ type: "creature" }, { type: "player" }],
          },
          count: { min: 0, max: Number.POSITIVE_INFINITY },
          restrictions: ["different-targets"],
        },
      ];

      expect(targets).toHaveLength(2);
      expect(targets[0].count).toBe(1);
      expect(targets[1].count).toEqual({
        min: 0,
        max: Number.POSITIVE_INFINITY,
      });
    });

    it("should model Pump spell (target creature you control)", () => {
      const player = createPlayerId("player-1");
      const target: TargetDefinition = {
        filter: {
          type: "creature",
          controller: player,
        },
        count: 1,
      };

      expect(target.filter.controller).toBe(player);
    });

    it("should model Fight spell (2 creatures, can't target same)", () => {
      const target: TargetDefinition = {
        filter: { type: "creature" },
        count: 2,
        restrictions: ["different-targets"],
      };

      expect(target.count).toBe(2);
      expect(target.restrictions).toContain("different-targets");
    });

    it("should model Act of Treason (opponent's creature)", () => {
      const _player = createPlayerId("player-1");
      const target: TargetDefinition = {
        filter: {
          type: "creature",
        },
        count: 1,
        restrictions: ["not-controller"],
      };

      expect(target.restrictions).toContain("not-controller");
    });
  });
});
