import { describe, expect, it } from "bun:test";
import { createPlayerId, createZoneId } from "../types";
import type { CardFilter, NumberFilter } from "./card-filter";

describe("Card Filter Types", () => {
  describe("CardFilter", () => {
    it("should support zone filtering with single zone", () => {
      const filter: CardFilter = {
        zone: createZoneId("play"),
      };

      expect(filter.zone).toBe(createZoneId("play"));
    });

    it("should support zone filtering with multiple zones", () => {
      const filter: CardFilter = {
        zone: [createZoneId("hand"), createZoneId("graveyard")],
      };

      expect(Array.isArray(filter.zone)).toBe(true);
      expect(filter.zone).toHaveLength(2);
    });

    it("should support owner filtering with single player", () => {
      const playerId = createPlayerId("player-1");
      const filter: CardFilter = {
        owner: playerId,
      };

      expect(filter.owner).toBe(playerId);
    });

    it("should support owner filtering with multiple players", () => {
      const filter: CardFilter = {
        owner: [createPlayerId("player-1"), createPlayerId("player-2")],
      };

      expect(Array.isArray(filter.owner)).toBe(true);
      expect(filter.owner).toHaveLength(2);
    });

    it("should support controller filtering", () => {
      const playerId = createPlayerId("player-1");
      const filter: CardFilter = {
        controller: playerId,
      };

      expect(filter.controller).toBe(playerId);
    });

    it("should support type filtering with single type", () => {
      const filter: CardFilter = {
        type: "creature",
      };

      expect(filter.type).toBe("creature");
    });

    it("should support type filtering with multiple types", () => {
      const filter: CardFilter = {
        type: ["creature", "artifact"],
      };

      expect(Array.isArray(filter.type)).toBe(true);
      expect(filter.type).toHaveLength(2);
    });

    it("should support name filtering with string", () => {
      const filter: CardFilter = {
        name: "Lightning Bolt",
      };

      expect(filter.name).toBe("Lightning Bolt");
    });

    it("should support name filtering with RegExp", () => {
      const filter: CardFilter = {
        name: /Lightning.*/,
      };

      expect(filter.name).toBeInstanceOf(RegExp);
    });

    it("should support generic property filtering", () => {
      const filter: CardFilter = {
        properties: {
          baseCost: { gte: 3 },
          basePower: { gt: 5 },
        },
      };

      expect(filter.properties).toBeDefined();
      expect(filter.properties?.baseCost).toEqual({ gte: 3 });
      expect(filter.properties?.basePower).toEqual({ gt: 5 });
    });

    it("should support tapped state filtering", () => {
      const filter: CardFilter = {
        tapped: true,
      };

      expect(filter.tapped).toBe(true);
    });

    it("should support revealed state filtering", () => {
      const filter: CardFilter = {
        revealed: true,
      };

      expect(filter.revealed).toBe(true);
    });

    it("should support flipped state filtering", () => {
      const filter: CardFilter = {
        flipped: true,
      };

      expect(filter.flipped).toBe(true);
    });

    it("should support phased state filtering", () => {
      const filter: CardFilter = {
        phased: false,
      };

      expect(filter.phased).toBe(false);
    });

    it("should support composite AND filters", () => {
      const filter: CardFilter = {
        and: [{ type: "creature" }, { tapped: false }],
      };

      expect(Array.isArray(filter.and)).toBe(true);
      expect(filter.and).toHaveLength(2);
    });

    it("should support composite OR filters", () => {
      const filter: CardFilter = {
        or: [
          { zone: createZoneId("hand") },
          { zone: createZoneId("graveyard") },
        ],
      };

      expect(Array.isArray(filter.or)).toBe(true);
      expect(filter.or).toHaveLength(2);
    });

    it("should support NOT filters", () => {
      const filter: CardFilter = {
        not: { type: "land" },
      };

      expect(filter.not).toBeDefined();
      expect(filter.not?.type).toBe("land");
    });

    it("should support custom where predicate", () => {
      const filter: CardFilter = {
        where: (card, _state) => card.tapped === true,
      };

      expect(typeof filter.where).toBe("function");
    });

    it("should support combining multiple filter properties", () => {
      const filter: CardFilter = {
        zone: createZoneId("play"),
        type: "creature",
        controller: createPlayerId("player-1"),
        tapped: false,
        properties: {
          basePower: { gte: 3 },
        },
      };

      expect(filter.zone).toBeDefined();
      expect(filter.type).toBe("creature");
      expect(filter.controller).toBeDefined();
      expect(filter.tapped).toBe(false);
      expect(filter.properties?.basePower).toEqual({ gte: 3 });
    });
  });

  describe("NumberFilter", () => {
    it("should support exact number match", () => {
      const filter: NumberFilter = 5;

      expect(filter).toBe(5);
      expect(typeof filter).toBe("number");
    });

    it("should support eq (equal) filter", () => {
      const filter: NumberFilter = { eq: 5 };

      expect(filter).toEqual({ eq: 5 });
    });

    it("should support gte (greater than or equal) filter", () => {
      const filter: NumberFilter = { gte: 3 };

      expect(filter).toEqual({ gte: 3 });
    });

    it("should support lte (less than or equal) filter", () => {
      const filter: NumberFilter = { lte: 7 };

      expect(filter).toEqual({ lte: 7 });
    });

    it("should support gt (greater than) filter", () => {
      const filter: NumberFilter = { gt: 10 };

      expect(filter).toEqual({ gt: 10 });
    });

    it("should support lt (less than) filter", () => {
      const filter: NumberFilter = { lt: 2 };

      expect(filter).toEqual({ lt: 2 });
    });

    it("should support between (range) filter", () => {
      const filter: NumberFilter = { between: [2, 5] };

      expect(filter).toEqual({ between: [2, 5] });
    });
  });
});
