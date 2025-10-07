import { beforeEach, describe, expect, it } from "bun:test";
import { createCardId } from "../../types/branded-types";
import type { Modifier } from "../modifier-types";

describe("Modifier", () => {
  let sourceCardId: ReturnType<typeof createCardId>;

  beforeEach(() => {
    sourceCardId = createCardId("source-card");
  });

  describe("Modifier Structure", () => {
    it("should have id field of type string", () => {
      const modifier: Modifier = {
        id: "modifier-1",
        type: "stat",
        property: "power",
        value: 2,
        duration: "permanent",
        source: sourceCardId,
      };

      expect(modifier.id).toBe("modifier-1");
      expect(typeof modifier.id).toBe("string");
    });

    it("should have type field with valid ModifierType", () => {
      const statModifier: Modifier = {
        id: "mod-1",
        type: "stat",
        property: "power",
        value: 2,
        duration: "permanent",
        source: sourceCardId,
      };

      const abilityModifier: Modifier = {
        id: "mod-2",
        type: "ability",
        property: "flying",
        value: true,
        duration: "permanent",
        source: sourceCardId,
      };

      const typeModifier: Modifier = {
        id: "mod-3",
        type: "type",
        property: "creature-type",
        value: "zombie",
        duration: "permanent",
        source: sourceCardId,
      };

      const keywordModifier: Modifier = {
        id: "mod-4",
        type: "keyword",
        property: "haste",
        value: true,
        duration: "until-end-of-turn",
        source: sourceCardId,
      };

      expect(statModifier.type).toBe("stat");
      expect(abilityModifier.type).toBe("ability");
      expect(typeModifier.type).toBe("type");
      expect(keywordModifier.type).toBe("keyword");
    });

    it("should have property field of type string", () => {
      const modifier: Modifier = {
        id: "mod-1",
        type: "stat",
        property: "toughness",
        value: 1,
        duration: "permanent",
        source: sourceCardId,
      };

      expect(modifier.property).toBe("toughness");
      expect(typeof modifier.property).toBe("string");
    });

    it("should have value field of type number, string, or boolean", () => {
      const numberModifier: Modifier = {
        id: "mod-1",
        type: "stat",
        property: "power",
        value: 3,
        duration: "permanent",
        source: sourceCardId,
      };

      const stringModifier: Modifier = {
        id: "mod-2",
        type: "type",
        property: "subtype",
        value: "warrior",
        duration: "permanent",
        source: sourceCardId,
      };

      const booleanModifier: Modifier = {
        id: "mod-3",
        type: "ability",
        property: "flying",
        value: true,
        duration: "permanent",
        source: sourceCardId,
      };

      expect(typeof numberModifier.value).toBe("number");
      expect(typeof stringModifier.value).toBe("string");
      expect(typeof booleanModifier.value).toBe("boolean");
    });

    it("should have duration field with valid ModifierDuration", () => {
      const permanentModifier: Modifier = {
        id: "mod-1",
        type: "stat",
        property: "power",
        value: 2,
        duration: "permanent",
        source: sourceCardId,
      };

      const endOfTurnModifier: Modifier = {
        id: "mod-2",
        type: "stat",
        property: "power",
        value: 1,
        duration: "until-end-of-turn",
        source: sourceCardId,
      };

      const conditionalModifier: Modifier = {
        id: "mod-3",
        type: "ability",
        property: "flying",
        value: true,
        duration: "while-condition",
        source: sourceCardId,
      };

      expect(permanentModifier.duration).toBe("permanent");
      expect(endOfTurnModifier.duration).toBe("until-end-of-turn");
      expect(conditionalModifier.duration).toBe("while-condition");
    });

    it("should have source field of type CardId", () => {
      const modifier: Modifier = {
        id: "mod-1",
        type: "stat",
        property: "power",
        value: 2,
        duration: "permanent",
        source: sourceCardId,
      };

      expect(modifier.source).toBe(sourceCardId);
    });

    it("should have optional condition field", () => {
      const modifierWithoutCondition: Modifier = {
        id: "mod-1",
        type: "stat",
        property: "power",
        value: 2,
        duration: "permanent",
        source: sourceCardId,
      };

      const modifierWithCondition: Modifier<{ turn: number }> = {
        id: "mod-2",
        type: "stat",
        property: "power",
        value: 3,
        duration: "while-condition",
        condition: (state) => state.turn > 5,
        source: sourceCardId,
      };

      expect(modifierWithoutCondition.condition).toBeUndefined();
      expect(modifierWithCondition.condition).toBeDefined();
      expect(typeof modifierWithCondition.condition).toBe("function");
    });

    it("should have optional layer field", () => {
      const modifierWithoutLayer: Modifier = {
        id: "mod-1",
        type: "stat",
        property: "power",
        value: 2,
        duration: "permanent",
        source: sourceCardId,
      };

      const modifierWithLayer: Modifier = {
        id: "mod-2",
        type: "stat",
        property: "power",
        value: 1,
        duration: "permanent",
        layer: 3,
        source: sourceCardId,
      };

      expect(modifierWithoutLayer.layer).toBeUndefined();
      expect(modifierWithLayer.layer).toBe(3);
    });
  });

  describe("Modifier Types", () => {
    describe("Stat Modifiers", () => {
      it("should create stat modifier for power", () => {
        const modifier: Modifier = {
          id: "power-buff",
          type: "stat",
          property: "power",
          value: 2,
          duration: "permanent",
          source: sourceCardId,
        };

        expect(modifier.type).toBe("stat");
        expect(modifier.property).toBe("power");
        expect(modifier.value).toBe(2);
      });

      it("should create stat modifier for toughness", () => {
        const modifier: Modifier = {
          id: "toughness-buff",
          type: "stat",
          property: "toughness",
          value: 3,
          duration: "permanent",
          source: sourceCardId,
        };

        expect(modifier.type).toBe("stat");
        expect(modifier.property).toBe("toughness");
        expect(modifier.value).toBe(3);
      });

      it("should create stat modifier for cost reduction", () => {
        const modifier: Modifier = {
          id: "cost-reduction",
          type: "stat",
          property: "cost",
          value: -2,
          duration: "permanent",
          source: sourceCardId,
        };

        expect(modifier.type).toBe("stat");
        expect(modifier.property).toBe("cost");
        expect(modifier.value).toBe(-2);
      });
    });

    describe("Ability Modifiers", () => {
      it("should create ability modifier granting flying", () => {
        const modifier: Modifier = {
          id: "grant-flying",
          type: "ability",
          property: "flying",
          value: true,
          duration: "permanent",
          source: sourceCardId,
        };

        expect(modifier.type).toBe("ability");
        expect(modifier.property).toBe("flying");
        expect(modifier.value).toBe(true);
      });

      it("should create ability modifier removing haste", () => {
        const modifier: Modifier = {
          id: "remove-haste",
          type: "ability",
          property: "haste",
          value: false,
          duration: "permanent",
          source: sourceCardId,
        };

        expect(modifier.type).toBe("ability");
        expect(modifier.value).toBe(false);
      });
    });

    describe("Type Modifiers", () => {
      it("should create type modifier adding creature type", () => {
        const modifier: Modifier = {
          id: "add-zombie-type",
          type: "type",
          property: "creature-type",
          value: "zombie",
          duration: "permanent",
          source: sourceCardId,
        };

        expect(modifier.type).toBe("type");
        expect(modifier.property).toBe("creature-type");
        expect(modifier.value).toBe("zombie");
      });
    });

    describe("Keyword Modifiers", () => {
      it("should create keyword modifier for haste", () => {
        const modifier: Modifier = {
          id: "grant-haste",
          type: "keyword",
          property: "haste",
          value: true,
          duration: "until-end-of-turn",
          source: sourceCardId,
        };

        expect(modifier.type).toBe("keyword");
        expect(modifier.property).toBe("haste");
        expect(modifier.duration).toBe("until-end-of-turn");
      });
    });
  });

  describe("Modifier Durations", () => {
    it("should create permanent modifier", () => {
      const modifier: Modifier = {
        id: "mod-1",
        type: "stat",
        property: "power",
        value: 2,
        duration: "permanent",
        source: sourceCardId,
      };

      expect(modifier.duration).toBe("permanent");
    });

    it("should create until-end-of-turn modifier", () => {
      const modifier: Modifier = {
        id: "mod-1",
        type: "stat",
        property: "power",
        value: 2,
        duration: "until-end-of-turn",
        source: sourceCardId,
      };

      expect(modifier.duration).toBe("until-end-of-turn");
    });

    it("should create while-condition modifier", () => {
      const modifier: Modifier<{ attackersCount: number }> = {
        id: "mod-1",
        type: "stat",
        property: "power",
        value: 1,
        duration: "while-condition",
        condition: (state) => state.attackersCount >= 3,
        source: sourceCardId,
      };

      expect(modifier.duration).toBe("while-condition");
      expect(modifier.condition).toBeDefined();
    });
  });

  describe("Conditional Modifiers", () => {
    it("should create modifier with condition function", () => {
      type GameState = {
        turn: number;
        phase: string;
      };

      const modifier: Modifier<GameState> = {
        id: "mod-1",
        type: "stat",
        property: "power",
        value: 2,
        duration: "while-condition",
        condition: (state) => state.turn > 5 && state.phase === "combat",
        source: sourceCardId,
      };

      expect(modifier.condition).toBeDefined();

      if (modifier.condition) {
        expect(modifier.condition({ turn: 6, phase: "combat" })).toBe(true);
        expect(modifier.condition({ turn: 3, phase: "combat" })).toBe(false);
        expect(modifier.condition({ turn: 6, phase: "main" })).toBe(false);
      }
    });

    it("should evaluate condition based on game state", () => {
      type GameState = {
        creaturesControlled: number;
      };

      const modifier: Modifier<GameState> = {
        id: "mod-1",
        type: "stat",
        property: "power",
        value: 1,
        duration: "while-condition",
        condition: (state) => state.creaturesControlled >= 3,
        source: sourceCardId,
      };

      if (modifier.condition) {
        expect(modifier.condition({ creaturesControlled: 3 })).toBe(true);
        expect(modifier.condition({ creaturesControlled: 5 })).toBe(true);
        expect(modifier.condition({ creaturesControlled: 2 })).toBe(false);
      }
    });
  });

  describe("Modifier Layers", () => {
    it("should support layered modifiers for complex interactions", () => {
      const layer1Modifier: Modifier = {
        id: "mod-1",
        type: "stat",
        property: "power",
        value: 2,
        duration: "permanent",
        layer: 1,
        source: sourceCardId,
      };

      const layer3Modifier: Modifier = {
        id: "mod-2",
        type: "stat",
        property: "power",
        value: 3,
        duration: "permanent",
        layer: 3,
        source: sourceCardId,
      };

      expect(layer1Modifier.layer).toBe(1);
      expect(layer3Modifier.layer).toBe(3);
    });
  });

  describe("Complete Modifier Examples", () => {
    it("should create complete stat modifier example", () => {
      const modifier: Modifier = {
        id: "giants-growth",
        type: "stat",
        property: "power",
        value: 3,
        duration: "until-end-of-turn",
        source: sourceCardId,
      };

      expect(modifier.id).toBe("giants-growth");
      expect(modifier.type).toBe("stat");
      expect(modifier.property).toBe("power");
      expect(modifier.value).toBe(3);
      expect(modifier.duration).toBe("until-end-of-turn");
      expect(modifier.source).toBe(sourceCardId);
    });

    it("should create complete conditional modifier example", () => {
      type GameState = {
        landsControlled: number;
      };

      const modifier: Modifier<GameState> = {
        id: "landfall-buff",
        type: "stat",
        property: "power",
        value: 2,
        duration: "while-condition",
        condition: (state) => state.landsControlled >= 5,
        layer: 2,
        source: sourceCardId,
      };

      expect(modifier.id).toBe("landfall-buff");
      expect(modifier.type).toBe("stat");
      expect(modifier.property).toBe("power");
      expect(modifier.value).toBe(2);
      expect(modifier.duration).toBe("while-condition");
      expect(modifier.condition).toBeDefined();
      expect(modifier.layer).toBe(2);
      expect(modifier.source).toBe(sourceCardId);
    });
  });
});
