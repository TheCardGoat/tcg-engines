import { describe, expect, it } from "bun:test";
import type { CardDefinition } from "../cards/card-definition";
import type { CardInstance } from "../cards/card-instance";
import type { Modifier } from "../cards/modifiers";
import { createCardRegistry } from "../operations/card-registry-impl";
import { createCardId, createPlayerId, createZoneId } from "../types";
import type { CardFilter } from "./card-filter";
import {
  anyCard,
  countCards,
  matchesNumberFilter,
  selectCards,
} from "./filter-matching";

type TestGameState = {
  cards: Record<string, CardInstance<{ modifiers: Modifier[] }>>;
};

describe("Filter Matching", () => {
  describe("matchesNumberFilter", () => {
    it("should match exact number", () => {
      expect(matchesNumberFilter(5, 5)).toBe(true);
      expect(matchesNumberFilter(5, 3)).toBe(false);
    });

    it("should match eq (equal)", () => {
      expect(matchesNumberFilter({ eq: 5 }, 5)).toBe(true);
      expect(matchesNumberFilter({ eq: 5 }, 3)).toBe(false);
    });

    it("should match gte (greater than or equal)", () => {
      expect(matchesNumberFilter({ gte: 5 }, 5)).toBe(true);
      expect(matchesNumberFilter({ gte: 5 }, 6)).toBe(true);
      expect(matchesNumberFilter({ gte: 5 }, 4)).toBe(false);
    });

    it("should match lte (less than or equal)", () => {
      expect(matchesNumberFilter({ lte: 5 }, 5)).toBe(true);
      expect(matchesNumberFilter({ lte: 5 }, 4)).toBe(true);
      expect(matchesNumberFilter({ lte: 5 }, 6)).toBe(false);
    });

    it("should match gt (greater than)", () => {
      expect(matchesNumberFilter({ gt: 5 }, 6)).toBe(true);
      expect(matchesNumberFilter({ gt: 5 }, 5)).toBe(false);
      expect(matchesNumberFilter({ gt: 5 }, 4)).toBe(false);
    });

    it("should match lt (less than)", () => {
      expect(matchesNumberFilter({ lt: 5 }, 4)).toBe(true);
      expect(matchesNumberFilter({ lt: 5 }, 5)).toBe(false);
      expect(matchesNumberFilter({ lt: 5 }, 6)).toBe(false);
    });

    it("should match between (range inclusive)", () => {
      expect(matchesNumberFilter({ between: [2, 5] }, 2)).toBe(true);
      expect(matchesNumberFilter({ between: [2, 5] }, 3)).toBe(true);
      expect(matchesNumberFilter({ between: [2, 5] }, 5)).toBe(true);
      expect(matchesNumberFilter({ between: [2, 5] }, 1)).toBe(false);
      expect(matchesNumberFilter({ between: [2, 5] }, 6)).toBe(false);
    });
  });

  describe("selectCards", () => {
    const definitions: CardDefinition[] = [
      {
        id: "grizzly-bears",
        name: "Grizzly Bears",
        type: "creature",
        basePower: 2,
        baseToughness: 2,
        baseCost: 2,
        abilities: [],
      },
      {
        id: "lightning-bolt",
        name: "Lightning Bolt",
        type: "instant",
        baseCost: 1,
        abilities: [],
      },
      {
        id: "dragon",
        name: "Shivan Dragon",
        type: "creature",
        basePower: 5,
        baseToughness: 5,
        baseCost: 6,
        abilities: ["flying"],
      },
    ];

    const registry = createCardRegistry(definitions);

    it("should filter by zone", () => {
      const playZone = createZoneId("play");
      const handZone = createZoneId("hand");

      const card1: CardInstance<{ modifiers: Modifier[] }> = {
        id: createCardId("card-1"),
        definitionId: "grizzly-bears",
        owner: createPlayerId("player-1"),
        controller: createPlayerId("player-1"),
        zone: playZone,
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
        modifiers: [],
      };

      const card2: CardInstance<{ modifiers: Modifier[] }> = {
        id: createCardId("card-2"),
        definitionId: "lightning-bolt",
        owner: createPlayerId("player-1"),
        controller: createPlayerId("player-1"),
        zone: handZone,
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
        modifiers: [],
      };

      const state: TestGameState = {
        cards: {
          [String(card1.id)]: card1,
          [String(card2.id)]: card2,
        },
      };

      const filter: CardFilter = { zone: playZone };
      const result = selectCards(state, filter, registry);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(card1.id);
    });

    it("should filter by multiple zones", () => {
      const playZone = createZoneId("play");
      const handZone = createZoneId("hand");
      const deckZone = createZoneId("deck");

      const cards: CardInstance<{ modifiers: Modifier[] }>[] = [
        {
          id: createCardId("card-1"),
          definitionId: "grizzly-bears",
          owner: createPlayerId("player-1"),
          controller: createPlayerId("player-1"),
          zone: playZone,
          tapped: false,
          flipped: false,
          revealed: false,
          phased: false,
          modifiers: [],
        },
        {
          id: createCardId("card-2"),
          definitionId: "lightning-bolt",
          owner: createPlayerId("player-1"),
          controller: createPlayerId("player-1"),
          zone: handZone,
          tapped: false,
          flipped: false,
          revealed: false,
          phased: false,
          modifiers: [],
        },
        {
          id: createCardId("card-3"),
          definitionId: "dragon",
          owner: createPlayerId("player-1"),
          controller: createPlayerId("player-1"),
          zone: deckZone,
          tapped: false,
          flipped: false,
          revealed: false,
          phased: false,
          modifiers: [],
        },
      ];

      const state: TestGameState = {
        cards: Object.fromEntries(cards.map((c) => [String(c.id), c])),
      };

      const filter: CardFilter = { zone: [playZone, handZone] };
      const result = selectCards(state, filter, registry);

      expect(result).toHaveLength(2);
    });

    it("should filter by owner", () => {
      const player1 = createPlayerId("player-1");
      const player2 = createPlayerId("player-2");

      const card1: CardInstance<{ modifiers: Modifier[] }> = {
        id: createCardId("card-1"),
        definitionId: "grizzly-bears",
        owner: player1,
        controller: player1,
        zone: createZoneId("play"),
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
        modifiers: [],
      };

      const card2: CardInstance<{ modifiers: Modifier[] }> = {
        id: createCardId("card-2"),
        definitionId: "dragon",
        owner: player2,
        controller: player2,
        zone: createZoneId("play"),
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
        modifiers: [],
      };

      const state: TestGameState = {
        cards: {
          [String(card1.id)]: card1,
          [String(card2.id)]: card2,
        },
      };

      const filter: CardFilter = { owner: player1 };
      const result = selectCards(state, filter, registry);

      expect(result).toHaveLength(1);
      expect(result[0].owner).toBe(player1);
    });

    it("should filter by tapped state", () => {
      const card1: CardInstance<{ modifiers: Modifier[] }> = {
        id: createCardId("card-1"),
        definitionId: "grizzly-bears",
        owner: createPlayerId("player-1"),
        controller: createPlayerId("player-1"),
        zone: createZoneId("play"),
        tapped: true,
        flipped: false,
        revealed: false,
        phased: false,
        modifiers: [],
      };

      const card2: CardInstance<{ modifiers: Modifier[] }> = {
        id: createCardId("card-2"),
        definitionId: "dragon",
        owner: createPlayerId("player-1"),
        controller: createPlayerId("player-1"),
        zone: createZoneId("play"),
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
        modifiers: [],
      };

      const state: TestGameState = {
        cards: {
          [String(card1.id)]: card1,
          [String(card2.id)]: card2,
        },
      };

      const filter: CardFilter = { tapped: true };
      const result = selectCards(state, filter, registry);

      expect(result).toHaveLength(1);
      expect(result[0].tapped).toBe(true);
    });

    it("should combine multiple filters with AND logic", () => {
      const player1 = createPlayerId("player-1");
      const playZone = createZoneId("play");

      const cards: CardInstance<{ modifiers: Modifier[] }>[] = [
        {
          id: createCardId("card-1"),
          definitionId: "grizzly-bears",
          owner: player1,
          controller: player1,
          zone: playZone,
          tapped: false,
          flipped: false,
          revealed: false,
          phased: false,
          modifiers: [],
        },
        {
          id: createCardId("card-2"),
          definitionId: "dragon",
          owner: player1,
          controller: player1,
          zone: playZone,
          tapped: true,
          flipped: false,
          revealed: false,
          phased: false,
          modifiers: [],
        },
        {
          id: createCardId("card-3"),
          definitionId: "lightning-bolt",
          owner: player1,
          controller: player1,
          zone: createZoneId("hand"),
          tapped: false,
          flipped: false,
          revealed: false,
          phased: false,
          modifiers: [],
        },
      ];

      const state: TestGameState = {
        cards: Object.fromEntries(cards.map((c) => [String(c.id), c])),
      };

      // Filter: in play zone AND not tapped AND type is creature
      const filter: CardFilter = {
        zone: playZone,
        tapped: false,
        type: "creature",
      };

      const result = selectCards(state, filter, registry);

      // Only card-1 matches all criteria
      expect(result).toHaveLength(1);
      expect(result[0].definitionId).toBe("grizzly-bears");
    });
  });

  describe("countCards", () => {
    it("should count cards matching filter", () => {
      const definitions: CardDefinition[] = [
        {
          id: "creature1",
          name: "Creature 1",
          type: "creature",
          basePower: 2,
          baseToughness: 2,
          abilities: [],
        },
        {
          id: "creature2",
          name: "Creature 2",
          type: "creature",
          basePower: 3,
          baseToughness: 3,
          abilities: [],
        },
        {
          id: "instant",
          name: "Instant",
          type: "instant",
          abilities: [],
        },
      ];

      const registry = createCardRegistry(definitions);

      const cards: CardInstance<{ modifiers: Modifier[] }>[] = [
        {
          id: createCardId("card-1"),
          definitionId: "creature1",
          owner: createPlayerId("player-1"),
          controller: createPlayerId("player-1"),
          zone: createZoneId("play"),
          tapped: false,
          flipped: false,
          revealed: false,
          phased: false,
          modifiers: [],
        },
        {
          id: createCardId("card-2"),
          definitionId: "creature2",
          owner: createPlayerId("player-1"),
          controller: createPlayerId("player-1"),
          zone: createZoneId("play"),
          tapped: false,
          flipped: false,
          revealed: false,
          phased: false,
          modifiers: [],
        },
        {
          id: createCardId("card-3"),
          definitionId: "instant",
          owner: createPlayerId("player-1"),
          controller: createPlayerId("player-1"),
          zone: createZoneId("hand"),
          tapped: false,
          flipped: false,
          revealed: false,
          phased: false,
          modifiers: [],
        },
      ];

      const state: TestGameState = {
        cards: Object.fromEntries(cards.map((c) => [String(c.id), c])),
      };

      const filter: CardFilter = { type: "creature" };
      const count = countCards(state, filter, registry);

      expect(count).toBe(2);
    });
  });

  describe("anyCard", () => {
    it("should return true if any card matches filter", () => {
      const definitions: CardDefinition[] = [
        {
          id: "creature",
          name: "Creature",
          type: "creature",
          abilities: [],
        },
        {
          id: "instant",
          name: "Instant",
          type: "instant",
          abilities: [],
        },
      ];

      const registry = createCardRegistry(definitions);

      const cards: CardInstance<{ modifiers: Modifier[] }>[] = [
        {
          id: createCardId("card-1"),
          definitionId: "creature",
          owner: createPlayerId("player-1"),
          controller: createPlayerId("player-1"),
          zone: createZoneId("play"),
          tapped: false,
          flipped: false,
          revealed: false,
          phased: false,
          modifiers: [],
        },
      ];

      const state: TestGameState = {
        cards: Object.fromEntries(cards.map((c) => [String(c.id), c])),
      };

      expect(anyCard(state, { type: "creature" }, registry)).toBe(true);
      expect(anyCard(state, { type: "land" }, registry)).toBe(false);
    });
  });

  describe("Composite Filters", () => {
    const definitions: CardDefinition[] = [
      {
        id: "bear",
        name: "Grizzly Bears",
        type: "creature",
        basePower: 2,
        baseToughness: 2,
        baseCost: 2,
        abilities: [],
      },
      {
        id: "dragon",
        name: "Shivan Dragon",
        type: "creature",
        basePower: 5,
        baseToughness: 5,
        baseCost: 6,
        abilities: ["flying"],
      },
      {
        id: "bolt",
        name: "Lightning Bolt",
        type: "instant",
        baseCost: 1,
        abilities: [],
      },
      {
        id: "mountain",
        name: "Mountain",
        type: "land",
        abilities: [],
      },
    ];

    const registry = createCardRegistry(definitions);

    describe("AND filters", () => {
      it("should match when all sub-filters match", () => {
        const playZone = createZoneId("play");
        const player1 = createPlayerId("player-1");

        const cards: CardInstance<{ modifiers: Modifier[] }>[] = [
          {
            id: createCardId("card-1"),
            definitionId: "bear",
            owner: player1,
            controller: player1,
            zone: playZone,
            tapped: false,
            flipped: false,
            revealed: false,
            phased: false,
            modifiers: [],
          },
          {
            id: createCardId("card-2"),
            definitionId: "dragon",
            owner: player1,
            controller: player1,
            zone: playZone,
            tapped: true,
            flipped: false,
            revealed: false,
            phased: false,
            modifiers: [],
          },
          {
            id: createCardId("card-3"),
            definitionId: "bolt",
            owner: player1,
            controller: player1,
            zone: createZoneId("hand"),
            tapped: false,
            flipped: false,
            revealed: false,
            phased: false,
            modifiers: [],
          },
        ];

        const state: TestGameState = {
          cards: Object.fromEntries(cards.map((c) => [String(c.id), c])),
        };

        // Find untapped creatures in play
        const filter: CardFilter = {
          and: [{ zone: playZone }, { type: "creature" }, { tapped: false }],
        };

        const result = selectCards(state, filter, registry);

        expect(result).toHaveLength(1);
        expect(result[0].definitionId).toBe("bear");
      });

      it("should not match when any sub-filter fails", () => {
        const playZone = createZoneId("play");
        const player1 = createPlayerId("player-1");

        const cards: CardInstance<{ modifiers: Modifier[] }>[] = [
          {
            id: createCardId("card-1"),
            definitionId: "bear",
            owner: player1,
            controller: player1,
            zone: playZone,
            tapped: true,
            flipped: false,
            revealed: false,
            phased: false,
            modifiers: [],
          },
        ];

        const state: TestGameState = {
          cards: Object.fromEntries(cards.map((c) => [String(c.id), c])),
        };

        const filter: CardFilter = {
          and: [{ type: "creature" }, { tapped: false }],
        };

        const result = selectCards(state, filter, registry);
        expect(result).toHaveLength(0);
      });
    });

    describe("OR filters", () => {
      it("should match when any sub-filter matches", () => {
        const playZone = createZoneId("play");
        const handZone = createZoneId("hand");
        const player1 = createPlayerId("player-1");

        const cards: CardInstance<{ modifiers: Modifier[] }>[] = [
          {
            id: createCardId("card-1"),
            definitionId: "bear",
            owner: player1,
            controller: player1,
            zone: playZone,
            tapped: false,
            flipped: false,
            revealed: false,
            phased: false,
            modifiers: [],
          },
          {
            id: createCardId("card-2"),
            definitionId: "bolt",
            owner: player1,
            controller: player1,
            zone: handZone,
            tapped: false,
            flipped: false,
            revealed: false,
            phased: false,
            modifiers: [],
          },
          {
            id: createCardId("card-3"),
            definitionId: "mountain",
            owner: player1,
            controller: player1,
            zone: createZoneId("deck"),
            tapped: false,
            flipped: false,
            revealed: false,
            phased: false,
            modifiers: [],
          },
        ];

        const state: TestGameState = {
          cards: Object.fromEntries(cards.map((c) => [String(c.id), c])),
        };

        // Find cards that are either creatures OR instants
        const filter: CardFilter = {
          or: [{ type: "creature" }, { type: "instant" }],
        };

        const result = selectCards(state, filter, registry);

        expect(result).toHaveLength(2);
        expect(result.map((c) => c.definitionId).sort()).toEqual([
          "bear",
          "bolt",
        ]);
      });

      it("should not match when no sub-filter matches", () => {
        const player1 = createPlayerId("player-1");

        const cards: CardInstance<{ modifiers: Modifier[] }>[] = [
          {
            id: createCardId("card-1"),
            definitionId: "mountain",
            owner: player1,
            controller: player1,
            zone: createZoneId("play"),
            tapped: false,
            flipped: false,
            revealed: false,
            phased: false,
            modifiers: [],
          },
        ];

        const state: TestGameState = {
          cards: Object.fromEntries(cards.map((c) => [String(c.id), c])),
        };

        const filter: CardFilter = {
          or: [{ type: "creature" }, { type: "instant" }],
        };

        const result = selectCards(state, filter, registry);
        expect(result).toHaveLength(0);
      });
    });

    describe("NOT filters", () => {
      it("should match when sub-filter does not match", () => {
        const player1 = createPlayerId("player-1");
        const playZone = createZoneId("play");

        const cards: CardInstance<{ modifiers: Modifier[] }>[] = [
          {
            id: createCardId("card-1"),
            definitionId: "bear",
            owner: player1,
            controller: player1,
            zone: playZone,
            tapped: false,
            flipped: false,
            revealed: false,
            phased: false,
            modifiers: [],
          },
          {
            id: createCardId("card-2"),
            definitionId: "mountain",
            owner: player1,
            controller: player1,
            zone: playZone,
            tapped: false,
            flipped: false,
            revealed: false,
            phased: false,
            modifiers: [],
          },
        ];

        const state: TestGameState = {
          cards: Object.fromEntries(cards.map((c) => [String(c.id), c])),
        };

        // Find all cards in play that are NOT lands
        const filter: CardFilter = {
          zone: playZone,
          not: { type: "land" },
        };

        const result = selectCards(state, filter, registry);

        expect(result).toHaveLength(1);
        expect(result[0].definitionId).toBe("bear");
      });

      it("should not match when sub-filter matches", () => {
        const player1 = createPlayerId("player-1");

        const cards: CardInstance<{ modifiers: Modifier[] }>[] = [
          {
            id: createCardId("card-1"),
            definitionId: "bear",
            owner: player1,
            controller: player1,
            zone: createZoneId("play"),
            tapped: false,
            flipped: false,
            revealed: false,
            phased: false,
            modifiers: [],
          },
        ];

        const state: TestGameState = {
          cards: Object.fromEntries(cards.map((c) => [String(c.id), c])),
        };

        const filter: CardFilter = {
          not: { type: "creature" },
        };

        const result = selectCards(state, filter, registry);
        expect(result).toHaveLength(0);
      });
    });

    describe("Complex composite filters", () => {
      it("should support nested composite filters", () => {
        const playZone = createZoneId("play");
        const player1 = createPlayerId("player-1");

        const cards: CardInstance<{ modifiers: Modifier[] }>[] = [
          {
            id: createCardId("card-1"),
            definitionId: "bear",
            owner: player1,
            controller: player1,
            zone: playZone,
            tapped: false,
            flipped: false,
            revealed: false,
            phased: false,
            modifiers: [],
          },
          {
            id: createCardId("card-2"),
            definitionId: "dragon",
            owner: player1,
            controller: player1,
            zone: playZone,
            tapped: false,
            flipped: false,
            revealed: false,
            phased: false,
            modifiers: [],
          },
          {
            id: createCardId("card-3"),
            definitionId: "bolt",
            owner: player1,
            controller: player1,
            zone: playZone,
            tapped: false,
            flipped: false,
            revealed: false,
            phased: false,
            modifiers: [],
          },
        ];

        const state: TestGameState = {
          cards: Object.fromEntries(cards.map((c) => [String(c.id), c])),
        };

        // Find creatures in play with power >= 3 OR cost <= 2
        const filter: CardFilter = {
          and: [
            { zone: playZone },
            { type: "creature" },
            {
              or: [
                { properties: { basePower: { gte: 3 } } },
                { properties: { baseCost: { lte: 2 } } },
              ],
            },
          ],
        };

        const result = selectCards(state, filter, registry);

        // Should match both bear (cost 2) and dragon (power 5)
        expect(result).toHaveLength(2);
        expect(result.map((c) => c.definitionId).sort()).toEqual([
          "bear",
          "dragon",
        ]);
      });
    });

    describe("Custom predicate filters", () => {
      it("should support custom where predicate", () => {
        const player1 = createPlayerId("player-1");
        const playZone = createZoneId("play");

        const cards: CardInstance<{ modifiers: Modifier[] }>[] = [
          {
            id: createCardId("card-1"),
            definitionId: "bear",
            owner: player1,
            controller: player1,
            zone: playZone,
            tapped: false,
            flipped: false,
            revealed: false,
            phased: false,
            modifiers: [],
          },
          {
            id: createCardId("card-2"),
            definitionId: "dragon",
            owner: player1,
            controller: player1,
            zone: playZone,
            tapped: true,
            flipped: false,
            revealed: false,
            phased: false,
            modifiers: [],
          },
        ];

        const state: TestGameState = {
          cards: Object.fromEntries(cards.map((c) => [String(c.id), c])),
        };

        // Custom filter: cards with even cost
        const filter: CardFilter<TestGameState> = {
          where: (card, _state) => {
            const definition = registry.getCard(card.definitionId);
            return (
              definition?.baseCost !== undefined &&
              definition.baseCost % 2 === 0
            );
          },
        };

        const result = selectCards(state, filter, registry);

        // Should match bear (cost 2) and dragon (cost 6)
        expect(result).toHaveLength(2);
      });

      it("should combine where predicate with other filters", () => {
        const player1 = createPlayerId("player-1");
        const playZone = createZoneId("play");

        const cards: CardInstance<{ modifiers: Modifier[] }>[] = [
          {
            id: createCardId("card-1"),
            definitionId: "bear",
            owner: player1,
            controller: player1,
            zone: playZone,
            tapped: false,
            flipped: false,
            revealed: false,
            phased: false,
            modifiers: [],
          },
          {
            id: createCardId("card-2"),
            definitionId: "dragon",
            owner: player1,
            controller: player1,
            zone: playZone,
            tapped: true,
            flipped: false,
            revealed: false,
            phased: false,
            modifiers: [],
          },
        ];

        const state: TestGameState = {
          cards: Object.fromEntries(cards.map((c) => [String(c.id), c])),
        };

        // Custom filter combined with tapped state
        const filter: CardFilter<TestGameState> = {
          tapped: false,
          where: (card, _state) => {
            const definition = registry.getCard(card.definitionId);
            return (
              definition?.baseCost !== undefined &&
              definition.baseCost % 2 === 0
            );
          },
        };

        const result = selectCards(state, filter, registry);

        // Should match only bear (cost 2 and not tapped)
        expect(result).toHaveLength(1);
        expect(result[0].definitionId).toBe("bear");
      });
    });
  });
});
