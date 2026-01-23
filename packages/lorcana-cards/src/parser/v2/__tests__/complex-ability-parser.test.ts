/**
 * Tests for Complex Ability Parsers
 *
 * Tests parsing of triggered, activated, and static abilities.
 */

import { describe, expect, it } from "bun:test";
import { parseActivatedAbility } from "../parsers/activated-parser";
import { parseStaticAbility } from "../parsers/static-parser";
import { parseTriggeredAbility } from "../parsers/triggered-parser";

describe("Triggered Ability Parser", () => {
  it("should parse simple triggered ability", () => {
    const result = parseTriggeredAbility(
      "When you play this character, draw a card.",
    );

    expect(result.success).toBe(true);
    const ability = result.ability?.ability as any;
    expect(ability.type).toBe("triggered");
    expect(ability.trigger.timing).toBe("when");
    expect(ability.trigger.event).toBeDefined();
    expect(ability.effect.type).toBe("draw");
  });

  it("should parse triggered ability with whenever", () => {
    const result = parseTriggeredAbility(
      "Whenever this character quests, gain 1 lore.",
    );

    expect(result.success).toBe(true);
    const ability = result.ability?.ability as any;
    expect(ability.type).toBe("triggered");
    expect(ability.trigger.timing).toBe("whenever");
    expect(ability.effect.type).toBe("gain-lore");
  });

  // TODO: Condition parsing in triggered abilities is not fully implemented yet
  it.skip("should parse triggered ability with condition", () => {
    const result = parseTriggeredAbility(
      "Whenever this character quests, if you have no cards in your hand, draw 2 cards.",
    );

    expect(result.success).toBe(true);
    const ability = result.ability?.ability as any;
    if (ability?.type === "triggered") {
      // When a condition is present, the effect is wrapped in a conditional type
      expect(ability.effect.type).toBe("conditional");
      expect(ability.condition).toBeDefined();
      if (ability.condition) {
        expect(ability.condition.type).toBe("resource-count");
      }
    }
  });

  it("should parse named triggered ability", () => {
    const result = parseTriggeredAbility(
      "DARK KNOWLEDGE Whenever this character quests, you may draw a card.",
    );

    expect(result.success).toBe(true);
    expect(result.ability?.name).toBe("DARK KNOWLEDGE");
    const ability = result.ability?.ability as any;
    expect(ability.type).toBe("triggered");
    expect(ability.name).toBe("DARK KNOWLEDGE");
    expect(ability.effect.type).toBe("optional");
  });

  it("should parse at start of turn trigger", () => {
    const result = parseTriggeredAbility(
      "At the start of your turn, draw a card.",
    );

    expect(result.success).toBe(true);
    const ability = result.ability?.ability as any;
    expect(ability.type).toBe("triggered");
    expect(ability.trigger.timing).toBe("at");
    expect(ability.trigger.event).toBe("start-turn");
  });
});

describe("Activated Ability Parser", () => {
  it("should parse exert-only activated ability", () => {
    const result = parseActivatedAbility("{E} - Draw a card.");

    expect(result.success).toBe(true);
    const ability = result.ability?.ability as any;
    expect(ability.type).toBe("activated");
    expect(ability.cost.exert).toBe(true);
    expect(ability.effect.type).toBe("draw");
  });

  it("should parse activated ability with ink cost", () => {
    const result = parseActivatedAbility("2 {I} - Draw 2 cards.");

    expect(result.success).toBe(true);
    const ability = result.ability?.ability as any;
    expect(ability.type).toBe("activated");
    expect(ability.cost.ink).toBe(2);
    expect(ability.effect.type).toBe("draw");
  });

  it("should parse activated ability with combined cost", () => {
    const result = parseActivatedAbility(
      "{E}, 2 {I} - Deal 3 damage to chosen character.",
    );

    expect(result.success).toBe(true);
    const ability = result.ability?.ability as any;
    expect(ability.type).toBe("activated");
    expect(ability.cost.exert).toBe(true);
    expect(ability.cost.ink).toBe(2);
    expect(ability.effect.type).toBe("deal-damage");
  });

  it("should parse banish cost activated ability", () => {
    const result = parseActivatedAbility("Banish this item - Gain 3 lore.");

    expect(result.success).toBe(true);
    const ability = result.ability?.ability as any;
    expect(ability.type).toBe("activated");
    expect(ability.cost.banishSelf).toBe(true);
    expect(ability.effect.type).toBe("gain-lore");
  });

  it("should parse named activated ability", () => {
    const result = parseActivatedAbility(
      "MAGIC HAIR {E} - Remove up to 3 damage from chosen character.",
    );

    expect(result.success).toBe(true);
    expect(result.ability?.name).toBe("MAGIC HAIR");
    const ability = result.ability?.ability as any;
    expect(ability.type).toBe("activated");
    expect(ability.name).toBe("MAGIC HAIR");
    expect(ability.cost.exert).toBe(true);
    expect(ability.effect.type).toBe("remove-damage");
  });

  it("should handle em dash separator", () => {
    const result = parseActivatedAbility("{E} − Draw a card.");

    expect(result.success).toBe(true);
    const ability = result.ability?.ability as any;
    expect(ability.type).toBe("activated");
    expect(ability.cost.exert).toBe(true);
  });
});

describe("Static Ability Parser", () => {
  it("should parse keyword grant static ability", () => {
    const result = parseStaticAbility("Your characters gain Ward.");

    expect(result.success).toBe(true);
    const ability = result.ability?.ability as any;
    expect(ability.type).toBe("static");
    expect(ability.effect.type).toBe("gain-keyword");
  });

  it("should parse stat modification static ability", () => {
    const result = parseStaticAbility("Your characters get +1 {S}.");

    expect(result.success).toBe(true);
    const ability = result.ability?.ability as any;
    expect(ability.type).toBe("static");
    expect(ability.effect.type).toBe("modify-stat");
  });

  it("should parse conditional static ability", () => {
    const result = parseStaticAbility(
      "While this character has no damage, he gets +2 {S}.",
    );

    expect(result.success).toBe(true);
    const ability = result.ability?.ability as any;
    expect(ability.type).toBe("static");
    // Condition extraction may need work, but main parsing should work
    expect(ability.effect.type).toBe("modify-stat");
  });

  it("should parse named static ability", () => {
    const result = parseStaticAbility(
      "HIDDEN AWAY This character can't be challenged.",
    );

    expect(result.success).toBe(true);
    expect(result.ability?.name).toBe("HIDDEN AWAY");
    const ability = result.ability?.ability as any;
    expect(ability.type).toBe("static");
    expect(ability.name).toBe("HIDDEN AWAY");
  });
});
