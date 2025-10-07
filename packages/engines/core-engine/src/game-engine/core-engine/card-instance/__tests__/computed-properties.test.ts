import { beforeEach, describe, expect, it } from "bun:test";
import {
  createCardId,
  createPlayerId,
  createZoneId,
} from "../../types/branded-types";
import type {
  CardDefinition,
  DefinitionRegistry,
} from "../card-definition-types";
import type { CardInstance } from "../card-instance-types";
import {
  createDefinitionRegistry,
  getCardCost,
  getCardPower,
  getCardToughness,
} from "../computed-properties";
import type { Modifier } from "../modifier-types";

describe("Computed Properties", () => {
  let cardId: ReturnType<typeof createCardId>;
  let playerId: ReturnType<typeof createPlayerId>;
  let zoneId: ReturnType<typeof createZoneId>;
  let sourceCardId: ReturnType<typeof createCardId>;
  let registry: DefinitionRegistry;

  beforeEach(() => {
    cardId = createCardId("card-1");
    playerId = createPlayerId("player-1");
    zoneId = createZoneId("battlefield");
    sourceCardId = createCardId("source");

    // Create test card definitions
    const grizzlyBears: CardDefinition = {
      id: "grizzly-bears",
      name: "Grizzly Bears",
      type: "creature",
      basePower: 2,
      baseToughness: 2,
      baseCost: 2,
      abilities: [],
    };

    const fireballSpell: CardDefinition = {
      id: "fireball",
      name: "Fireball",
      type: "spell",
      baseCost: 1,
      abilities: ["X spell"],
    };

    const mountainLand: CardDefinition = {
      id: "mountain",
      name: "Mountain",
      type: "land",
      abilities: ["tap: add R"],
    };

    registry = createDefinitionRegistry([
      grizzlyBears,
      fireballSpell,
      mountainLand,
    ]);
  });

  describe("CardDefinition", () => {
    it("should have all required fields", () => {
      const definition: CardDefinition = {
        id: "test-card",
        name: "Test Card",
        type: "creature",
        basePower: 3,
        baseToughness: 3,
        baseCost: 3,
        abilities: ["flying", "vigilance"],
      };

      expect(definition.id).toBe("test-card");
      expect(definition.name).toBe("Test Card");
      expect(definition.type).toBe("creature");
      expect(definition.basePower).toBe(3);
      expect(definition.baseToughness).toBe(3);
      expect(definition.baseCost).toBe(3);
      expect(definition.abilities).toEqual(["flying", "vigilance"]);
    });

    it("should allow optional power and toughness for non-creatures", () => {
      const definition: CardDefinition = {
        id: "lightning-bolt",
        name: "Lightning Bolt",
        type: "spell",
        baseCost: 1,
        abilities: ["deal 3 damage"],
      };

      expect(definition.basePower).toBeUndefined();
      expect(definition.baseToughness).toBeUndefined();
    });

    it("should allow optional cost for lands", () => {
      const definition: CardDefinition = {
        id: "forest",
        name: "Forest",
        type: "land",
        abilities: ["tap: add G"],
      };

      expect(definition.baseCost).toBeUndefined();
    });
  });

  describe("DefinitionRegistry", () => {
    it("should retrieve card definition by id", () => {
      const definition = registry.getDefinition("grizzly-bears");

      expect(definition).toBeDefined();
      expect(definition?.id).toBe("grizzly-bears");
      expect(definition?.name).toBe("Grizzly Bears");
    });

    it("should return undefined for non-existent definition", () => {
      const definition = registry.getDefinition("non-existent");

      expect(definition).toBeUndefined();
    });
  });

  describe("getCardPower", () => {
    it("should return base power with no modifiers", () => {
      const card: CardInstance<{ modifiers: Modifier[] }> = {
        id: cardId,
        definitionId: "grizzly-bears",
        owner: playerId,
        controller: playerId,
        zone: zoneId,
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
        modifiers: [],
      };

      const power = getCardPower(card, {}, registry);

      expect(power).toBe(2);
    });

    it("should return 0 for cards without base power", () => {
      const card: CardInstance<{ modifiers: Modifier[] }> = {
        id: cardId,
        definitionId: "mountain",
        owner: playerId,
        controller: playerId,
        zone: zoneId,
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
        modifiers: [],
      };

      const power = getCardPower(card, {}, registry);

      expect(power).toBe(0);
    });

    it("should apply positive power modifier", () => {
      const powerBuff: Modifier = {
        id: "buff-1",
        type: "stat",
        property: "power",
        value: 2,
        duration: "permanent",
        source: sourceCardId,
      };

      const card: CardInstance<{ modifiers: Modifier[] }> = {
        id: cardId,
        definitionId: "grizzly-bears",
        owner: playerId,
        controller: playerId,
        zone: zoneId,
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
        modifiers: [powerBuff],
      };

      const power = getCardPower(card, {}, registry);

      expect(power).toBe(4); // 2 base + 2 modifier
    });

    it("should apply negative power modifier", () => {
      const powerDebuff: Modifier = {
        id: "debuff-1",
        type: "stat",
        property: "power",
        value: -1,
        duration: "permanent",
        source: sourceCardId,
      };

      const card: CardInstance<{ modifiers: Modifier[] }> = {
        id: cardId,
        definitionId: "grizzly-bears",
        owner: playerId,
        controller: playerId,
        zone: zoneId,
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
        modifiers: [powerDebuff],
      };

      const power = getCardPower(card, {}, registry);

      expect(power).toBe(1); // 2 base - 1 modifier
    });

    it("should sum multiple power modifiers", () => {
      const modifier1: Modifier = {
        id: "buff-1",
        type: "stat",
        property: "power",
        value: 2,
        duration: "permanent",
        source: sourceCardId,
      };

      const modifier2: Modifier = {
        id: "buff-2",
        type: "stat",
        property: "power",
        value: 1,
        duration: "permanent",
        source: sourceCardId,
      };

      const card: CardInstance<{ modifiers: Modifier[] }> = {
        id: cardId,
        definitionId: "grizzly-bears",
        owner: playerId,
        controller: playerId,
        zone: zoneId,
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
        modifiers: [modifier1, modifier2],
      };

      const power = getCardPower(card, {}, registry);

      expect(power).toBe(5); // 2 base + 2 + 1
    });

    it("should ignore non-power stat modifiers", () => {
      const toughnessModifier: Modifier = {
        id: "tough-1",
        type: "stat",
        property: "toughness",
        value: 3,
        duration: "permanent",
        source: sourceCardId,
      };

      const card: CardInstance<{ modifiers: Modifier[] }> = {
        id: cardId,
        definitionId: "grizzly-bears",
        owner: playerId,
        controller: playerId,
        zone: zoneId,
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
        modifiers: [toughnessModifier],
      };

      const power = getCardPower(card, {}, registry);

      expect(power).toBe(2); // Only base power, toughness modifier ignored
    });

    it("should ignore non-stat modifiers", () => {
      const abilityModifier: Modifier = {
        id: "flying-1",
        type: "ability",
        property: "flying",
        value: true,
        duration: "permanent",
        source: sourceCardId,
      };

      const card: CardInstance<{ modifiers: Modifier[] }> = {
        id: cardId,
        definitionId: "grizzly-bears",
        owner: playerId,
        controller: playerId,
        zone: zoneId,
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
        modifiers: [abilityModifier],
      };

      const power = getCardPower(card, {}, registry);

      expect(power).toBe(2); // Only base power
    });

    it("should apply conditional modifiers when condition is true", () => {
      type GameState = {
        turn: number;
      };

      const conditionalModifier: Modifier<GameState> = {
        id: "conditional-1",
        type: "stat",
        property: "power",
        value: 3,
        duration: "while-condition",
        condition: (state) => state.turn > 5,
        source: sourceCardId,
      };

      const card: CardInstance<{ modifiers: Modifier<GameState>[] }> = {
        id: cardId,
        definitionId: "grizzly-bears",
        owner: playerId,
        controller: playerId,
        zone: zoneId,
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
        modifiers: [conditionalModifier],
      };

      const state: GameState = { turn: 6 };
      const power = getCardPower(card, state, registry);

      expect(power).toBe(5); // 2 base + 3 conditional
    });

    it("should not apply conditional modifiers when condition is false", () => {
      type GameState = {
        turn: number;
      };

      const conditionalModifier: Modifier<GameState> = {
        id: "conditional-1",
        type: "stat",
        property: "power",
        value: 3,
        duration: "while-condition",
        condition: (state) => state.turn > 5,
        source: sourceCardId,
      };

      const card: CardInstance<{ modifiers: Modifier<GameState>[] }> = {
        id: cardId,
        definitionId: "grizzly-bears",
        owner: playerId,
        controller: playerId,
        zone: zoneId,
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
        modifiers: [conditionalModifier],
      };

      const state: GameState = { turn: 3 };
      const power = getCardPower(card, state, registry);

      expect(power).toBe(2); // Only base power, condition not met
    });
  });

  describe("getCardToughness", () => {
    it("should return base toughness with no modifiers", () => {
      const card: CardInstance<{ modifiers: Modifier[] }> = {
        id: cardId,
        definitionId: "grizzly-bears",
        owner: playerId,
        controller: playerId,
        zone: zoneId,
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
        modifiers: [],
      };

      const toughness = getCardToughness(card, {}, registry);

      expect(toughness).toBe(2);
    });

    it("should apply toughness modifiers", () => {
      const modifier: Modifier = {
        id: "tough-1",
        type: "stat",
        property: "toughness",
        value: 2,
        duration: "permanent",
        source: sourceCardId,
      };

      const card: CardInstance<{ modifiers: Modifier[] }> = {
        id: cardId,
        definitionId: "grizzly-bears",
        owner: playerId,
        controller: playerId,
        zone: zoneId,
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
        modifiers: [modifier],
      };

      const toughness = getCardToughness(card, {}, registry);

      expect(toughness).toBe(4); // 2 base + 2 modifier
    });

    it("should ignore power modifiers when calculating toughness", () => {
      const powerModifier: Modifier = {
        id: "power-1",
        type: "stat",
        property: "power",
        value: 5,
        duration: "permanent",
        source: sourceCardId,
      };

      const card: CardInstance<{ modifiers: Modifier[] }> = {
        id: cardId,
        definitionId: "grizzly-bears",
        owner: playerId,
        controller: playerId,
        zone: zoneId,
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
        modifiers: [powerModifier],
      };

      const toughness = getCardToughness(card, {}, registry);

      expect(toughness).toBe(2); // Only base toughness
    });
  });

  describe("getCardCost", () => {
    it("should return base cost with no modifiers", () => {
      const card: CardInstance<{ modifiers: Modifier[] }> = {
        id: cardId,
        definitionId: "grizzly-bears",
        owner: playerId,
        controller: playerId,
        zone: zoneId,
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
        modifiers: [],
      };

      const cost = getCardCost(card, {}, registry);

      expect(cost).toBe(2);
    });

    it("should return 0 for cards without base cost", () => {
      const card: CardInstance<{ modifiers: Modifier[] }> = {
        id: cardId,
        definitionId: "mountain",
        owner: playerId,
        controller: playerId,
        zone: zoneId,
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
        modifiers: [],
      };

      const cost = getCardCost(card, {}, registry);

      expect(cost).toBe(0);
    });

    it("should apply cost reduction", () => {
      const costReduction: Modifier = {
        id: "reduce-1",
        type: "stat",
        property: "cost",
        value: -1,
        duration: "permanent",
        source: sourceCardId,
      };

      const card: CardInstance<{ modifiers: Modifier[] }> = {
        id: cardId,
        definitionId: "grizzly-bears",
        owner: playerId,
        controller: playerId,
        zone: zoneId,
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
        modifiers: [costReduction],
      };

      const cost = getCardCost(card, {}, registry);

      expect(cost).toBe(1); // 2 base - 1 reduction
    });

    it("should not allow negative cost", () => {
      const costReduction: Modifier = {
        id: "reduce-1",
        type: "stat",
        property: "cost",
        value: -5,
        duration: "permanent",
        source: sourceCardId,
      };

      const card: CardInstance<{ modifiers: Modifier[] }> = {
        id: cardId,
        definitionId: "grizzly-bears",
        owner: playerId,
        controller: playerId,
        zone: zoneId,
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
        modifiers: [costReduction],
      };

      const cost = getCardCost(card, {}, registry);

      expect(cost).toBe(0); // Can't go below 0
    });

    it("should apply conditional cost reduction", () => {
      type GameState = {
        artifactsControlled: number;
      };

      const conditionalReduction: Modifier<GameState> = {
        id: "affinity-1",
        type: "stat",
        property: "cost",
        value: -1,
        duration: "while-condition",
        condition: (state) => state.artifactsControlled >= 3,
        source: sourceCardId,
      };

      const card: CardInstance<{ modifiers: Modifier<GameState>[] }> = {
        id: cardId,
        definitionId: "grizzly-bears",
        owner: playerId,
        controller: playerId,
        zone: zoneId,
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
        modifiers: [conditionalReduction],
      };

      const stateWithArtifacts: GameState = { artifactsControlled: 3 };
      const costWithArtifacts = getCardCost(card, stateWithArtifacts, registry);

      const stateWithoutArtifacts: GameState = { artifactsControlled: 1 };
      const costWithoutArtifacts = getCardCost(
        card,
        stateWithoutArtifacts,
        registry,
      );

      expect(costWithArtifacts).toBe(1); // 2 base - 1 reduction
      expect(costWithoutArtifacts).toBe(2); // Only base cost
    });
  });
});
