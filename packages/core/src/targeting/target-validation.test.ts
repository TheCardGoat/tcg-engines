import { describe, expect, it } from "bun:test";
import { createDefinitionRegistry } from "../cards/card-definition";
import type { CardInstance } from "../cards/card-instance";
import type { Modifier } from "../cards/modifiers";
import { createCardId, createPlayerId, createZoneId } from "../types";
import type { TargetDefinition } from "./target-definition";
import {
  enumerateTargetCombinations,
  getLegalTargets,
  isLegalTarget,
  validateTargetSelection,
} from "./target-validation";

type TestGameState = {
  cards: Record<string, CardInstance<{ modifiers: Modifier[] }>>;
};

describe("Target Validation", () => {
  const registry = createDefinitionRegistry([
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
  ]);

  describe("isLegal Target", () => {
    it("should validate target matches filter", () => {
      const playZone = createZoneId("play");
      const player1 = createPlayerId("player-1");

      const card: CardInstance<{ modifiers: Modifier[] }> = {
        id: createCardId("card-1"),
        definitionId: "creature1",
        owner: player1,
        controller: player1,
        zone: playZone,
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
        modifiers: [],
      };

      const state: TestGameState = {
        cards: { [String(card.id)]: card },
      };

      const targetDef: TargetDefinition = {
        filter: { zone: playZone, type: "creature" },
        count: 1,
      };

      const result = isLegalTarget(card, targetDef, state, registry, {
        sourceCard: card,
        controller: player1,
        previousTargets: [],
      });

      expect(result).toBe(true);
    });

    it("should reject target that doesn't match filter", () => {
      const playZone = createZoneId("play");
      const player1 = createPlayerId("player-1");

      const card: CardInstance<{ modifiers: Modifier[] }> = {
        id: createCardId("card-1"),
        definitionId: "instant",
        owner: player1,
        controller: player1,
        zone: playZone,
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
        modifiers: [],
      };

      const state: TestGameState = {
        cards: { [String(card.id)]: card },
      };

      const targetDef: TargetDefinition = {
        filter: { type: "creature" },
        count: 1,
      };

      const result = isLegalTarget(card, targetDef, state, registry, {
        sourceCard: card,
        controller: player1,
        previousTargets: [],
      });

      expect(result).toBe(false);
    });

    it("should enforce 'not-self' restriction", () => {
      const playZone = createZoneId("play");
      const player1 = createPlayerId("player-1");

      const sourceCard: CardInstance<{ modifiers: Modifier[] }> = {
        id: createCardId("source"),
        definitionId: "creature1",
        owner: player1,
        controller: player1,
        zone: playZone,
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
        modifiers: [],
      };

      const state: TestGameState = {
        cards: { [String(sourceCard.id)]: sourceCard },
      };

      const targetDef: TargetDefinition = {
        filter: { type: "creature" },
        count: 1,
        restrictions: ["not-self"],
      };

      const result = isLegalTarget(sourceCard, targetDef, state, registry, {
        sourceCard,
        controller: player1,
        previousTargets: [],
      });

      expect(result).toBe(false);
    });

    it("should allow targeting self without 'not-self' restriction", () => {
      const playZone = createZoneId("play");
      const player1 = createPlayerId("player-1");

      const sourceCard: CardInstance<{ modifiers: Modifier[] }> = {
        id: createCardId("source"),
        definitionId: "creature1",
        owner: player1,
        controller: player1,
        zone: playZone,
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
        modifiers: [],
      };

      const state: TestGameState = {
        cards: { [String(sourceCard.id)]: sourceCard },
      };

      const targetDef: TargetDefinition = {
        filter: { type: "creature" },
        count: 1,
      };

      const result = isLegalTarget(sourceCard, targetDef, state, registry, {
        sourceCard,
        controller: player1,
        previousTargets: [],
      });

      expect(result).toBe(true);
    });

    it("should enforce 'not-controller' restriction", () => {
      const playZone = createZoneId("play");
      const player1 = createPlayerId("player-1");

      const card: CardInstance<{ modifiers: Modifier[] }> = {
        id: createCardId("card-1"),
        definitionId: "creature1",
        owner: player1,
        controller: player1,
        zone: playZone,
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
        modifiers: [],
      };

      const state: TestGameState = {
        cards: { [String(card.id)]: card },
      };

      const targetDef: TargetDefinition = {
        filter: { type: "creature" },
        count: 1,
        restrictions: ["not-controller"],
      };

      const result = isLegalTarget(card, targetDef, state, registry, {
        sourceCard: card,
        controller: player1,
        previousTargets: [],
      });

      expect(result).toBe(false);
    });

    it("should enforce 'not-owner' restriction", () => {
      const playZone = createZoneId("play");
      const player1 = createPlayerId("player-1");

      const card: CardInstance<{ modifiers: Modifier[] }> = {
        id: createCardId("card-1"),
        definitionId: "creature1",
        owner: player1,
        controller: player1,
        zone: playZone,
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
        modifiers: [],
      };

      const state: TestGameState = {
        cards: { [String(card.id)]: card },
      };

      const targetDef: TargetDefinition = {
        filter: { type: "creature" },
        count: 1,
        restrictions: ["not-owner"],
      };

      const result = isLegalTarget(card, targetDef, state, registry, {
        sourceCard: card,
        controller: player1,
        previousTargets: [],
      });

      expect(result).toBe(false);
    });

    it("should enforce 'different-targets' restriction", () => {
      const playZone = createZoneId("play");
      const player1 = createPlayerId("player-1");

      const card1: CardInstance<{ modifiers: Modifier[] }> = {
        id: createCardId("card-1"),
        definitionId: "creature1",
        owner: player1,
        controller: player1,
        zone: playZone,
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
        modifiers: [],
      };

      const card2: CardInstance<{ modifiers: Modifier[] }> = {
        id: createCardId("card-2"),
        definitionId: "creature2",
        owner: player1,
        controller: player1,
        zone: playZone,
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

      const targetDef: TargetDefinition = {
        filter: { type: "creature" },
        count: 2,
        restrictions: ["different-targets"],
      };

      // First target is always legal
      const result1 = isLegalTarget(card1, targetDef, state, registry, {
        sourceCard: card1,
        controller: player1,
        previousTargets: [],
      });
      expect(result1).toBe(true);

      // Second target must be different
      const result2 = isLegalTarget(card1, targetDef, state, registry, {
        sourceCard: card1,
        controller: player1,
        previousTargets: [card1],
      });
      expect(result2).toBe(false);

      // Different card is legal
      const result3 = isLegalTarget(card2, targetDef, state, registry, {
        sourceCard: card1,
        controller: player1,
        previousTargets: [card1],
      });
      expect(result3).toBe(true);
    });
  });

  describe("getLegalTargets", () => {
    it("should return all cards matching filter", () => {
      const playZone = createZoneId("play");
      const player1 = createPlayerId("player-1");

      const cards: CardInstance<{ modifiers: Modifier[] }>[] = [
        {
          id: createCardId("card-1"),
          definitionId: "creature1",
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
          definitionId: "creature2",
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
          definitionId: "instant",
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

      const targetDef: TargetDefinition = {
        filter: { type: "creature" },
        count: 1,
      };

      const result = getLegalTargets(targetDef, state, registry, {
        sourceCard: cards[0],
        controller: player1,
        previousTargets: [],
      });

      expect(result).toHaveLength(2);
      expect(result.map((c) => c.definitionId).sort()).toEqual([
        "creature1",
        "creature2",
      ]);
    });

    it("should exclude cards that don't meet restrictions", () => {
      const playZone = createZoneId("play");
      const player1 = createPlayerId("player-1");

      const sourceCard: CardInstance<{ modifiers: Modifier[] }> = {
        id: createCardId("source"),
        definitionId: "creature1",
        owner: player1,
        controller: player1,
        zone: playZone,
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
        modifiers: [],
      };

      const otherCard: CardInstance<{ modifiers: Modifier[] }> = {
        id: createCardId("other"),
        definitionId: "creature2",
        owner: player1,
        controller: player1,
        zone: playZone,
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
        modifiers: [],
      };

      const state: TestGameState = {
        cards: {
          [String(sourceCard.id)]: sourceCard,
          [String(otherCard.id)]: otherCard,
        },
      };

      const targetDef: TargetDefinition = {
        filter: { type: "creature" },
        count: 1,
        restrictions: ["not-self"],
      };

      const result = getLegalTargets(targetDef, state, registry, {
        sourceCard,
        controller: player1,
        previousTargets: [],
      });

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(otherCard.id);
    });

    it("should return empty array when no legal targets", () => {
      const playZone = createZoneId("play");
      const player1 = createPlayerId("player-1");

      const card: CardInstance<{ modifiers: Modifier[] }> = {
        id: createCardId("card-1"),
        definitionId: "instant",
        owner: player1,
        controller: player1,
        zone: playZone,
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
        modifiers: [],
      };

      const state: TestGameState = {
        cards: { [String(card.id)]: card },
      };

      const targetDef: TargetDefinition = {
        filter: { type: "creature" },
        count: 1,
      };

      const result = getLegalTargets(targetDef, state, registry, {
        sourceCard: card,
        controller: player1,
        previousTargets: [],
      });

      expect(result).toHaveLength(0);
    });
  });

  describe("validateTargetSelection", () => {
    it("should validate exact count matches", () => {
      const playZone = createZoneId("play");
      const player1 = createPlayerId("player-1");

      const card: CardInstance<{ modifiers: Modifier[] }> = {
        id: createCardId("card-1"),
        definitionId: "creature1",
        owner: player1,
        controller: player1,
        zone: playZone,
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
        modifiers: [],
      };

      const state: TestGameState = {
        cards: { [String(card.id)]: card },
      };

      const targetDef: TargetDefinition = {
        filter: { type: "creature" },
        count: 1,
      };

      const result = validateTargetSelection(
        [card],
        targetDef,
        state,
        registry,
        {
          sourceCard: card,
          controller: player1,
        },
      );

      expect(result.valid).toBe(true);
    });

    it("should reject when count doesn't match", () => {
      const playZone = createZoneId("play");
      const player1 = createPlayerId("player-1");

      const cards: CardInstance<{ modifiers: Modifier[] }>[] = [
        {
          id: createCardId("card-1"),
          definitionId: "creature1",
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
          definitionId: "creature2",
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

      const targetDef: TargetDefinition = {
        filter: { type: "creature" },
        count: 1,
      };

      const result = validateTargetSelection(
        cards,
        targetDef,
        state,
        registry,
        {
          sourceCard: cards[0],
          controller: player1,
        },
      );

      expect(result.valid).toBe(false);
      expect(result.error).toContain("Expected 1 target");
    });

    it("should validate range count (min/max)", () => {
      const playZone = createZoneId("play");
      const player1 = createPlayerId("player-1");

      const cards: CardInstance<{ modifiers: Modifier[] }>[] = [
        {
          id: createCardId("card-1"),
          definitionId: "creature1",
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
          definitionId: "creature2",
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

      const targetDef: TargetDefinition = {
        filter: { type: "creature" },
        count: { min: 1, max: 3 },
      };

      // 2 targets is within range
      const result = validateTargetSelection(
        cards,
        targetDef,
        state,
        registry,
        {
          sourceCard: cards[0],
          controller: player1,
        },
      );

      expect(result.valid).toBe(true);
    });

    it("should reject when below minimum count", () => {
      const playZone = createZoneId("play");
      const player1 = createPlayerId("player-1");

      const card: CardInstance<{ modifiers: Modifier[] }> = {
        id: createCardId("card-1"),
        definitionId: "creature1",
        owner: player1,
        controller: player1,
        zone: playZone,
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
        modifiers: [],
      };

      const state: TestGameState = {
        cards: { [String(card.id)]: card },
      };

      const targetDef: TargetDefinition = {
        filter: { type: "creature" },
        count: { min: 2, max: 4 },
      };

      const result = validateTargetSelection(
        [card],
        targetDef,
        state,
        registry,
        {
          sourceCard: card,
          controller: player1,
        },
      );

      expect(result.valid).toBe(false);
      expect(result.error).toContain("at least 2");
    });

    it("should reject when above maximum count", () => {
      const playZone = createZoneId("play");
      const player1 = createPlayerId("player-1");

      const cards: CardInstance<{ modifiers: Modifier[] }>[] = Array.from(
        { length: 5 },
        (_, i) => ({
          id: createCardId(`card-${i}`),
          definitionId: "creature1",
          owner: player1,
          controller: player1,
          zone: playZone,
          tapped: false,
          flipped: false,
          revealed: false,
          phased: false,
          modifiers: [],
        }),
      );

      const state: TestGameState = {
        cards: Object.fromEntries(cards.map((c) => [String(c.id), c])),
      };

      const targetDef: TargetDefinition = {
        filter: { type: "creature" },
        count: { min: 1, max: 3 },
      };

      const result = validateTargetSelection(
        cards,
        targetDef,
        state,
        registry,
        {
          sourceCard: cards[0],
          controller: player1,
        },
      );

      expect(result.valid).toBe(false);
      expect(result.error).toContain("at most 3");
    });

    it("should validate each target individually", () => {
      const playZone = createZoneId("play");
      const player1 = createPlayerId("player-1");

      const creatures: CardInstance<{ modifiers: Modifier[] }>[] = [
        {
          id: createCardId("creature-1"),
          definitionId: "creature1",
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

      const instant: CardInstance<{ modifiers: Modifier[] }> = {
        id: createCardId("instant"),
        definitionId: "instant",
        owner: player1,
        controller: player1,
        zone: playZone,
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
        modifiers: [],
      };

      const state: TestGameState = {
        cards: {
          [String(creatures[0].id)]: creatures[0],
          [String(instant.id)]: instant,
        },
      };

      const targetDef: TargetDefinition = {
        filter: { type: "creature" },
        count: 1,
      };

      const result = validateTargetSelection(
        [instant],
        targetDef,
        state,
        registry,
        {
          sourceCard: creatures[0],
          controller: player1,
        },
      );

      expect(result.valid).toBe(false);
      expect(result.error).toContain("not a legal target");
    });
  });

  describe("enumerateTargetCombinations", () => {
    it("should enumerate single target options", () => {
      const playZone = createZoneId("play");
      const player1 = createPlayerId("player-1");

      const cards: CardInstance<{ modifiers: Modifier[] }>[] = [
        {
          id: createCardId("card-1"),
          definitionId: "creature1",
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
          definitionId: "creature2",
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

      const targetDef: TargetDefinition = {
        filter: { type: "creature" },
        count: 1,
      };

      const result = enumerateTargetCombinations(
        targetDef,
        state,
        registry,
        {
          sourceCard: cards[0],
          controller: player1,
          previousTargets: [],
        },
        10,
      );

      expect(result).toHaveLength(2);
      expect(result[0]).toHaveLength(1);
      expect(result[1]).toHaveLength(1);
    });

    it("should enumerate multiple target combinations", () => {
      const playZone = createZoneId("play");
      const player1 = createPlayerId("player-1");

      const cards: CardInstance<{ modifiers: Modifier[] }>[] = [
        {
          id: createCardId("card-1"),
          definitionId: "creature1",
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
          definitionId: "creature2",
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
          definitionId: "creature1",
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

      const targetDef: TargetDefinition = {
        filter: { type: "creature" },
        count: 2,
        restrictions: ["different-targets"],
      };

      const result = enumerateTargetCombinations(
        targetDef,
        state,
        registry,
        {
          sourceCard: cards[0],
          controller: player1,
          previousTargets: [],
        },
        10,
      );

      // Should have C(3,2) = 3 combinations
      expect(result).toHaveLength(3);
      expect(result.every((combo) => combo.length === 2)).toBe(true);
    });

    it("should respect maxCombinations limit", () => {
      const playZone = createZoneId("play");
      const player1 = createPlayerId("player-1");

      const cards: CardInstance<{ modifiers: Modifier[] }>[] = Array.from(
        { length: 10 },
        (_, i) => ({
          id: createCardId(`card-${i}`),
          definitionId: "creature1",
          owner: player1,
          controller: player1,
          zone: playZone,
          tapped: false,
          flipped: false,
          revealed: false,
          phased: false,
          modifiers: [],
        }),
      );

      const state: TestGameState = {
        cards: Object.fromEntries(cards.map((c) => [String(c.id), c])),
      };

      const targetDef: TargetDefinition = {
        filter: { type: "creature" },
        count: 1,
      };

      const result = enumerateTargetCombinations(
        targetDef,
        state,
        registry,
        {
          sourceCard: cards[0],
          controller: player1,
          previousTargets: [],
        },
        5,
      );

      expect(result).toHaveLength(5);
    });

    it("should handle optional targets (min 0)", () => {
      const playZone = createZoneId("play");
      const player1 = createPlayerId("player-1");

      const card: CardInstance<{ modifiers: Modifier[] }> = {
        id: createCardId("card-1"),
        definitionId: "creature1",
        owner: player1,
        controller: player1,
        zone: playZone,
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
        modifiers: [],
      };

      const state: TestGameState = {
        cards: { [String(card.id)]: card },
      };

      const targetDef: TargetDefinition = {
        filter: { type: "creature" },
        count: { min: 0, max: 1 },
      };

      const result = enumerateTargetCombinations(
        targetDef,
        state,
        registry,
        {
          sourceCard: card,
          controller: player1,
          previousTargets: [],
        },
        10,
      );

      // Should have: [] (0 targets) and [card] (1 target)
      expect(result).toHaveLength(2);
      expect(result.some((combo) => combo.length === 0)).toBe(true);
      expect(result.some((combo) => combo.length === 1)).toBe(true);
    });
  });
});
