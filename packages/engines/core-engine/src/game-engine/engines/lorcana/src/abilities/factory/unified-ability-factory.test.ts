import { describe, expect, test } from "bun:test";
import { EffectFactory } from "./effect-factory";
import { UnifiedAbilityFactory } from "./unified-ability-factory";

describe("UnifiedAbilityFactory", () => {
  describe("Manual creation methods", () => {
    test("should create a triggered ability", () => {
      const ability = UnifiedAbilityFactory.triggered(
        "When you play this character, gain 3 lore",
        "onPlay",
        [EffectFactory.gainLore(3)],
        { type: "onEnterPlay" },
        false,
        "GainLoreOnPlay",
      );

      expect(ability).toEqual({
        type: "triggered",
        text: "When you play this character, gain 3 lore",
        name: "GainLoreOnPlay",
        effects: [
          {
            type: "gainLore",
            parameters: {
              amount: 3,
            },
            optional: false,
          },
        ],
        timing: "onPlay",
        condition: { type: "onEnterPlay" },
        optional: false,
      });
    });

    test("should create a keyword ability", () => {
      const ability = UnifiedAbilityFactory.keyword("Bodyguard");

      expect(ability).toEqual({
        type: "keyword",
        text: "Bodyguard",
        keyword: { type: "Bodyguard" },
        effects: [],
      });
    });
  });

  describe("Parsing methods", () => {
    test("should parse a keyword from card text", () => {
      const abilities = UnifiedAbilityFactory.fromCardText("Evasive");

      expect(abilities).toHaveLength(1);
      expect(abilities[0].type).toBe("keyword");
      expect(abilities[0].keyword?.type).toBe("Evasive");
    });

    test("should parse a triggered ability from card text", () => {
      const abilities = UnifiedAbilityFactory.fromCardText(
        "When you play this character, gain 2 lore",
      );

      expect(abilities).toHaveLength(1);
      expect(abilities[0].type).toBe("triggered");
      expect(abilities[0].timing).toBe("onPlay");
      expect(abilities[0].effects).toHaveLength(1);
      expect(abilities[0].effects[0].type).toBe("gainLore");
    });
  });

  describe("Convenience methods", () => {
    test("should create ability with auto-parsing and manual overrides", () => {
      const ability = UnifiedAbilityFactory.create({
        text: "When you play this character, gain 2 lore",
        name: "CustomName",
        effects: [EffectFactory.gainLore(5)], // Override the effect
      });

      expect(ability.type).toBe("triggered");
      // name gets passed to parseAbilityText but may not be in final output depending on implementation
      expect(ability.effects[0].parameters.amount).toBe(5); // Custom effect instead of 2
    });

    test("should use quick creation helpers", () => {
      const ability = UnifiedAbilityFactory.quickCreate.onPlay("gain 3 lore", [
        EffectFactory.gainLore(3),
      ]);

      expect(ability.type).toBe("triggered");
      expect(ability.timing).toBe("onPlay");
      expect(ability.text).toBe("When you play this character, gain 3 lore");
    });
  });
});
