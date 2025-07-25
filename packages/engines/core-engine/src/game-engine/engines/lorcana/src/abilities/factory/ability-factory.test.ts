import { describe, expect, test } from "bun:test";
import { AbilityFactory } from "./ability-factory";
import { EffectFactory } from "./effect-factory";

describe("AbilityFactory", () => {
  describe("Manual creation methods", () => {
    test("should create a triggered ability", () => {
      const ability = AbilityFactory.triggered(
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
      const ability = AbilityFactory.keyword("bodyguard");

      expect(ability).toEqual({
        type: "keyword",
        text: "bodyguard",
        keyword: { type: "bodyguard" },
        effects: [],
      });
    });

    test("should create an activated ability", () => {
      const ability = AbilityFactory.activated(
        "{E}, 2 {I} – Deal 3 damage to chosen character",
        { exert: true, ink: 2 },
        [EffectFactory.dealDamage(3)],
        undefined,
        "DamageDealer",
      );

      expect(ability).toEqual({
        type: "activated",
        text: "{E}, 2 {I} – Deal 3 damage to chosen character",
        name: "DamageDealer",
        cost: { exert: true, ink: 2 },
        effects: [
          {
            type: "dealDamage",
            parameters: {
              amount: 3,
            },
            optional: false,
          },
        ],
      });
    });

    test("should create a static ability", () => {
      const ability = AbilityFactory.static(
        "While this character has no damage, it gets +2 {S}",
        [EffectFactory.modifyStat("strength", 2)],
        { type: "noDamage" },
        "StrengthBoost",
      );

      expect(ability).toEqual({
        type: "static",
        text: "While this character has no damage, it gets +2 {S}",
        name: "StrengthBoost",
        effects: [
          {
            type: "modifyStat",
            parameters: {
              stat: "strength",
              value: 2,
            },
            optional: false,
          },
        ],
        condition: { type: "noDamage" },
      });
    });

    test("should create a replacement ability", () => {
      const ability = AbilityFactory.replacement(
        "If damage would be dealt to this character, prevent 2 of that damage",
        [{ type: "preventDamage", parameters: { amount: 2 } }],
        undefined,
        "DamageReduction",
      );

      expect(ability).toEqual({
        type: "replacement",
        text: "If damage would be dealt to this character, prevent 2 of that damage",
        name: "DamageReduction",
        effects: [
          {
            type: "preventDamage",
            parameters: {
              amount: 2,
            },
          },
        ],
      });
    });
  });

  describe("Parsing methods", () => {
    test("should parse a keyword from card text", () => {
      const abilities = AbilityFactory.fromCardText("Evasive");

      expect(abilities).toHaveLength(1);
      expect(abilities[0].type).toBe("keyword");
      expect(abilities[0].keyword?.type).toBe("evasive");
    });

    test("should parse a keyword with value", () => {
      const abilities = AbilityFactory.fromCardText("Challenger +2");

      expect(abilities).toHaveLength(1);
      expect(abilities[0].type).toBe("keyword");
      expect(abilities[0].keyword?.type).toBe("challenger");
      expect(abilities[0].keyword?.value).toBe(2);
    });

    // Test all simple keywords
    test("should parse all simple keywords", () => {
      const simpleKeywords: Array<{ text: string; expected: string }> = [
        { text: "Bodyguard", expected: "bodyguard" },
        { text: "Evasive", expected: "evasive" },
        { text: "Rush", expected: "rush" },
        { text: "Ward", expected: "ward" },
        { text: "Vanish", expected: "vanish" },
        { text: "Support", expected: "support" },
        { text: "Reckless", expected: "reckless" },
        { text: "Voiceless", expected: "voiceless" },
      ];

      for (const { text, expected } of simpleKeywords) {
        const abilities = AbilityFactory.fromCardText(text);
        expect(abilities).toHaveLength(1);
        expect(abilities[0].type).toBe("keyword");
        expect(abilities[0].keyword?.type).toBe(expected);
        expect(abilities[0].keyword?.value).toBeUndefined();
      }
    });

    // Test all keywords with values
    test("should parse all keywords with values", () => {
      const keywordsWithValues = [
        { text: "Challenger +3", type: "challenger", value: 3 },
        { text: "Resist +2", type: "resist", value: 2 },
        { text: "Singer 5", type: "singer", value: 5 },
        { text: "Shift 4", type: "shift", value: 4 },
        { text: "Sing Together 8", type: "sing-together", value: 8 },
        { text: "Sing-Together 10", type: "sing-together", value: 10 },
      ];

      for (const { text, type, value } of keywordsWithValues) {
        const abilities = AbilityFactory.fromCardText(text);
        expect(abilities).toHaveLength(1);
        expect(abilities[0].type).toBe("keyword");
        expect(abilities[0].keyword?.type).toBe(type);
        expect(abilities[0].keyword?.value).toBe(value);
      }
    });

    test("should parse a triggered ability from card text", () => {
      const abilities = AbilityFactory.fromCardText(
        "When you play this character, gain 2 lore",
      );

      expect(abilities).toHaveLength(1);
      expect(abilities[0].type).toBe("triggered");
      expect(abilities[0].timing).toBe("onPlay");
      expect(abilities[0].effects).toHaveLength(1);
      expect(abilities[0].effects[0].type).toBe("gainLore");
    });

    test("should parse an activated ability from card text", () => {
      const abilities = AbilityFactory.fromCardText(
        "{E} – Deal 2 damage to chosen character",
      );

      expect(abilities).toHaveLength(1);
      expect(abilities[0].type).toBe("activated");
      expect(abilities[0].cost).toEqual({ exert: true });
      expect(abilities[0].effects).toHaveLength(1);
      expect(abilities[0].effects[0].type).toBe("dealDamage");
    });

    test("should parse a static ability from card text", () => {
      const abilities = AbilityFactory.fromCardText(
        "While this character has no damage, it gets +2 {S}",
      );

      expect(abilities).toHaveLength(1);
      expect(abilities[0].type).toBe("static");
      expect(abilities[0].condition).toBeDefined();
      expect(abilities[0].effects).toHaveLength(1);
    });

    test("should parse multiple abilities from card text", () => {
      const abilities = AbilityFactory.fromCardText(
        "Evasive. When you play this character, gain 2 lore.",
      );

      expect(abilities).toHaveLength(2);
      expect(abilities[0].type).toBe("keyword");
      expect(abilities[1].type).toBe("triggered");
    });

    // Test case insensitive keyword parsing
    test("should parse keywords case insensitively", () => {
      const abilities1 = AbilityFactory.fromCardText("BODYGUARD");
      const abilities2 = AbilityFactory.fromCardText("bodyguard");
      const abilities3 = AbilityFactory.fromCardText("Bodyguard");

      expect(abilities1[0].keyword?.type).toBe("bodyguard");
      expect(abilities2[0].keyword?.type).toBe("bodyguard");
      expect(abilities3[0].keyword?.type).toBe("bodyguard");
    });
  });

  describe("Template methods", () => {
    test("should create on-play template ability", () => {
      const ability = AbilityFactory.templateOnPlay(
        "gain 3 lore",
        [EffectFactory.gainLore(3)],
        "GainLoreOnPlay",
      );

      expect(ability.type).toBe("triggered");
      expect(ability.timing).toBe("onPlay");
      expect(ability.text).toBe("When you play this character, gain 3 lore");
      expect(ability.condition).toEqual({ type: "onEnterPlay" });
    });

    test("should create on-quest template ability", () => {
      const ability = AbilityFactory.templateOnQuest(
        "draw a card",
        [EffectFactory.draw(1)],
        "DrawOnQuest",
      );

      expect(ability.type).toBe("triggered");
      expect(ability.timing).toBe("onQuest");
      expect(ability.text).toBe("Whenever this character quests, draw a card");
      expect(ability.condition).toEqual({ type: "onQuest" });
    });

    test("should create exert-activated template ability", () => {
      const ability = AbilityFactory.templateExertActivated(
        "deal 2 damage to chosen character",
        [EffectFactory.dealDamage(2)],
        1,
        "ExertDamageEffect",
      );

      expect(ability.type).toBe("activated");
      expect(ability.cost).toEqual({ exert: true, ink: 1 });
      expect(ability.text).toBe(
        "{E}, 1 {I} – deal 2 damage to chosen character",
      );
    });

    test("should create while-condition template ability", () => {
      const ability = AbilityFactory.templateWhileCondition(
        "this character has no damage",
        "it gets +2 {S}",
        [EffectFactory.modifyStat("strength", 2)],
        { type: "noDamage" },
        "StrengthBoostWhileNoDamage",
      );

      expect(ability.type).toBe("static");
      expect(ability.text).toBe(
        "While this character has no damage, it gets +2 {S}",
      );
      expect(ability.condition).toEqual({ type: "noDamage" });
    });

    test("should create on-banish template ability", () => {
      const ability = AbilityFactory.templateOnBanish(
        "draw a card",
        [EffectFactory.draw(1)],
        "DrawOnBanish",
      );

      expect(ability.type).toBe("triggered");
      expect(ability.timing).toBe("onBanish");
      expect(ability.text).toBe("When this character is banished, draw a card");
      expect(ability.condition).toEqual({ type: "onBanish" });
    });

    test("should create shift template ability", () => {
      const ability = AbilityFactory.templateShift(2, "Mickey Mouse");

      expect(ability.type).toBe("keyword");
      expect(ability.text).toBe(
        "shift 2 (You may pay 2 {I} to play this on top of one of your characters named Mickey Mouse.)",
      );
      expect(ability.keyword).toEqual({ type: "shift", value: 2 });
      expect(ability.shift).toBeDefined();
      expect(ability.shift?.targetName).toBe("Mickey Mouse");
    });
  });

  describe("Convenience methods", () => {
    test("should create ability with auto-parsing and manual overrides", () => {
      const ability = AbilityFactory.create({
        text: "When you play this character, gain 2 lore",
        name: "CustomName",
        effects: [EffectFactory.gainLore(5)], // Override the effect
      });

      expect(ability.type).toBe("triggered");
      // name gets passed to parseAbilityText but may not be in final output depending on implementation
      expect(ability.effects[0].parameters.amount).toBe(5); // Custom effect instead of 2
    });

    test("should use quick creation helpers", () => {
      const ability = AbilityFactory.quickCreate.onPlay("gain 3 lore", [
        EffectFactory.gainLore(3),
      ]);

      expect(ability.type).toBe("triggered");
      expect(ability.timing).toBe("onPlay");
      expect(ability.text).toBe("When you play this character, gain 3 lore");
    });

    test("should use quick creation helper for drawing cards", () => {
      const ability = AbilityFactory.quickCreate.drawCard(2);

      expect(ability.type).toBe("static");
      expect(ability.effects[0].parameters.amount).toBe(2);
    });

    test("should create ability from config object", () => {
      const ability = AbilityFactory.fromConfig({
        type: "triggered",
        text: "When this character is banished, draw 2 cards",
        name: "DrawOnBanish",
        effects: [EffectFactory.draw(2)],
        timing: "onBanish",
        condition: { type: "onBanish" },
      });

      expect(ability.type).toBe("triggered");
      expect(ability.name).toBe("DrawOnBanish");
      expect(ability.timing).toBe("onBanish");
      expect(ability.effects[0].type).toBe("draw");
    });

    test("should create multiple abilities from configurations", () => {
      const configs = [
        {
          text: "Evasive",
        },
        {
          text: "When you play this character, gain 3 lore",
          effects: [EffectFactory.gainLore(3)],
        },
      ];

      const abilities = AbilityFactory.fromConfigs(configs);

      expect(abilities).toHaveLength(2);
      expect(abilities[0].type).toBe("keyword");
      expect(abilities[1].type).toBe("triggered");
    });
  });

  describe("Advanced parsing scenarios", () => {
    test("should parse abilities with optional effects", () => {
      const abilities = AbilityFactory.fromCardText(
        "When you play this character, you may draw a card",
      );

      expect(abilities[0].optional).toBe(true);
    });

    test("should parse abilities with stat modifications", () => {
      const abilities = AbilityFactory.fromCardText(
        "When you play this character, chosen character gets +2 {S} this turn",
      );

      expect(abilities[0].type).toBe("triggered");
      expect(abilities[0].effects[0].type).toBe("modifyStat");
      expect(abilities[0].effects[0].duration).toEqual({ type: "endOfTurn" });
    });

    test("should fallback to generic ability for complex text", () => {
      const abilities = AbilityFactory.fromCardText(
        "This very complex ability with custom game logic should create a generic ability",
      );

      expect(abilities).toHaveLength(1);
      expect(abilities[0].type).toBeDefined(); // At minimum should have a type
      expect(abilities[0].effects).toBeDefined(); // Should have some effects array
    });
  });
});
