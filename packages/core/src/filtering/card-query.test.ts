import { describe, expect, it } from "bun:test";
import type { CardDefinition } from "../cards/card-definition";
import { createDefinitionRegistry } from "../cards/card-definition";
import type { CardInstance } from "../cards/card-instance";
import type { Modifier } from "../cards/modifiers";
import { createCardId, createPlayerId, createZoneId } from "../types";
import { CardQuery } from "./card-query";

type TestGameState = {
  cards: Record<string, CardInstance<{ modifiers: Modifier[] }>>;
};

describe("CardQuery Builder", () => {
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

  const registry = createDefinitionRegistry(definitions);

  describe("Basic Filters", () => {
    it("should filter by zone", () => {
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
      ];

      const state: TestGameState = {
        cards: Object.fromEntries(cards.map((c) => [String(c.id), c])),
      };

      const result = CardQuery.create(state, registry)
        .inZone(playZone)
        .execute();

      expect(result).toHaveLength(1);
      expect(result[0].definitionId).toBe("bear");
    });

    it("should filter by multiple zones", () => {
      const playZone = createZoneId("play");
      const handZone = createZoneId("hand");
      const deckZone = createZoneId("deck");
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

      const result = CardQuery.create(state, registry)
        .inZone([playZone, handZone])
        .execute();

      expect(result).toHaveLength(2);
    });

    it("should filter by owner", () => {
      const player1 = createPlayerId("player-1");
      const player2 = createPlayerId("player-2");
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
          owner: player2,
          controller: player2,
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

      const result = CardQuery.create(state, registry)
        .ownedBy(player1)
        .execute();

      expect(result).toHaveLength(1);
      expect(result[0].owner).toBe(player1);
    });

    it("should filter by controller", () => {
      const player1 = createPlayerId("player-1");
      const player2 = createPlayerId("player-2");
      const playZone = createZoneId("play");

      const cards: CardInstance<{ modifiers: Modifier[] }>[] = [
        {
          id: createCardId("card-1"),
          definitionId: "bear",
          owner: player1,
          controller: player2,
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

      const result = CardQuery.create(state, registry)
        .controlledBy(player2)
        .execute();

      expect(result).toHaveLength(1);
    });

    it("should filter by type", () => {
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

      const result = CardQuery.create(state, registry)
        .ofType("creature")
        .execute();

      expect(result).toHaveLength(1);
      expect(result[0].definitionId).toBe("bear");
    });

    it("should filter by name", () => {
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
      ];

      const state: TestGameState = {
        cards: Object.fromEntries(cards.map((c) => [String(c.id), c])),
      };

      const result = CardQuery.create(state, registry)
        .withName("Grizzly Bears")
        .execute();

      expect(result).toHaveLength(1);
    });

    it("should filter by name pattern", () => {
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

      const result = CardQuery.create(state, registry)
        .withNameMatching(/.*Dragon/)
        .execute();

      expect(result).toHaveLength(1);
      expect(result[0].definitionId).toBe("dragon");
    });

    it("should filter by tapped state", () => {
      const player1 = createPlayerId("player-1");
      const playZone = createZoneId("play");

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
      ];

      const state: TestGameState = {
        cards: Object.fromEntries(cards.map((c) => [String(c.id), c])),
      };

      const result = CardQuery.create(state, registry).tapped().execute();

      expect(result).toHaveLength(1);
      expect(result[0].tapped).toBe(true);
    });

    it("should filter by untapped state", () => {
      const player1 = createPlayerId("player-1");
      const playZone = createZoneId("play");

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
      ];

      const state: TestGameState = {
        cards: Object.fromEntries(cards.map((c) => [String(c.id), c])),
      };

      const result = CardQuery.create(state, registry).untapped().execute();

      expect(result).toHaveLength(1);
      expect(result[0].tapped).toBe(false);
    });
  });

  describe("Property Filters", () => {
    it("should filter by baseCost property", () => {
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

      const result = CardQuery.create(state, registry)
        .withProperty("baseCost", { lte: 3 })
        .execute();

      expect(result).toHaveLength(1);
      expect(result[0].definitionId).toBe("bear");
    });

    it("should filter by basePower property", () => {
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

      const result = CardQuery.create(state, registry)
        .withProperty("basePower", { gte: 4 })
        .execute();

      expect(result).toHaveLength(1);
      expect(result[0].definitionId).toBe("dragon");
    });

    it("should filter by baseToughness property", () => {
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

      const result = CardQuery.create(state, registry)
        .withProperty("baseToughness", { eq: 2 })
        .execute();

      expect(result).toHaveLength(1);
      expect(result[0].definitionId).toBe("bear");
    });

    it("should filter by multiple properties", () => {
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

      // Find creatures with baseCost 2 and basePower 2
      const result = CardQuery.create(state, registry)
        .ofType("creature")
        .withProperty("baseCost", 2)
        .withProperty("basePower", 2)
        .execute();

      expect(result).toHaveLength(1);
      expect(result[0].definitionId).toBe("bear");
    });
  });

  describe("Chaining Filters", () => {
    it("should chain multiple filters", () => {
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

      const result = CardQuery.create(state, registry)
        .inZone(playZone)
        .ofType("creature")
        .untapped()
        .execute();

      expect(result).toHaveLength(1);
      expect(result[0].definitionId).toBe("bear");
    });
  });

  describe("Custom Predicates", () => {
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

      const result = CardQuery.create(state, registry)
        .where((card, _state) => {
          const definition = registry.get(card.definitionId);
          return (
            definition?.baseCost !== undefined && definition.baseCost % 2 === 0
          );
        })
        .execute();

      expect(result).toHaveLength(2);
    });
  });

  describe("Query Methods", () => {
    it("should execute query and return cards", () => {
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
      ];

      const state: TestGameState = {
        cards: Object.fromEntries(cards.map((c) => [String(c.id), c])),
      };

      const result = CardQuery.create(state, registry)
        .inZone(playZone)
        .execute();

      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(1);
    });

    it("should count matching cards", () => {
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

      const count = CardQuery.create(state, registry)
        .inZone(playZone)
        .ofType("creature")
        .count();

      expect(count).toBe(2);
    });

    it("should check if any card matches", () => {
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
      ];

      const state: TestGameState = {
        cards: Object.fromEntries(cards.map((c) => [String(c.id), c])),
      };

      const hasCreature = CardQuery.create(state, registry)
        .ofType("creature")
        .any();

      const hasLand = CardQuery.create(state, registry).ofType("land").any();

      expect(hasCreature).toBe(true);
      expect(hasLand).toBe(false);
    });

    it("should get first matching card", () => {
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

      const first = CardQuery.create(state, registry)
        .ofType("creature")
        .first();

      expect(first).toBeDefined();
      expect(first?.definitionId).toBe("bear");
    });

    it("should return undefined when no card matches for first()", () => {
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
      ];

      const state: TestGameState = {
        cards: Object.fromEntries(cards.map((c) => [String(c.id), c])),
      };

      const first = CardQuery.create(state, registry).ofType("land").first();

      expect(first).toBeUndefined();
    });
  });
});
