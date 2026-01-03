/**
 * Tests for static ability patterns (Task Group 2.6)
 *
 * Tests the new static ability patterns:
 * - Restriction patterns (can't be challenged, cannot challenge, enters play exerted)
 * - Grant patterns (Your X gain Y, Your X get +{d} {S})
 * - Location patterns (Characters gain X while here)
 * - Special ability grants (can challenge ready characters)
 *
 * @group parser
 * @group static
 */

import { describe, expect, it } from "bun:test";
import { D_PLACEHOLDER } from "../effects/atomic/stat-mod-effect";
import { parseAbilityText } from "../index";

describe("Static Ability Patterns - Restrictions", () => {
  it("should parse 'can't be challenged' restriction", () => {
    const result = parseAbilityText(
      "HIDDEN AWAY This character can't be challenged.",
    );

    expect(result.success).toBe(true);
    const staticAbility = result.ability?.ability as any;
    expect(staticAbility.type).toBe("static");
    expect(staticAbility.effect.type).toBe("restriction");
    expect(staticAbility.effect.restriction).toBe("cant-be-challenged");
    expect(staticAbility.effect.target).toBe("SELF");
    expect(staticAbility.name).toBe("HIDDEN AWAY");
  });

  it("should parse 'cannot challenge' restriction", () => {
    const result = parseAbilityText(
      "WAR WOUND This character cannot challenge.",
    );

    expect(result.success).toBe(true);
    const staticAbility = result.ability?.ability as any;
    expect(staticAbility.type).toBe("static");
    expect(staticAbility.effect.type).toBe("restriction");
    expect(staticAbility.effect.restriction).toBe("cant-challenge");
    expect(staticAbility.effect.target).toBe("SELF");
    expect(staticAbility.name).toBe("WAR WOUND");
  });

  it("should parse 'enters play exerted' pattern", () => {
    const result = parseAbilityText("ASLEEP This item enters play exerted.");

    expect(result.success).toBe(true);
    const staticAbility = result.ability?.ability as any;
    expect(staticAbility.type).toBe("static");
    expect(staticAbility.effect.type).toBe("restriction");
    expect(staticAbility.effect.restriction).toBe("enters-play-exerted");
    expect(staticAbility.effect.target).toBe("SELF");
    expect(staticAbility.name).toBe("ASLEEP");
  });

  it("should parse 'can't be challenged' without named ability", () => {
    const result = parseAbilityText("This character can't be challenged.");

    expect(result.success).toBe(true);
    const staticAbility = result.ability?.ability as any;
    expect(staticAbility.type).toBe("static");
    expect(staticAbility.effect.type).toBe("restriction");
    expect(staticAbility.effect.restriction).toBe("cant-be-challenged");
  });
});

describe("Static Ability Patterns - Grant Patterns", () => {
  it("should parse 'Your characters gain Ward'", () => {
    const result = parseAbilityText("Your characters gain Ward.");

    expect(result.success).toBe(true);
    const staticAbility = result.ability?.ability as any;
    expect(staticAbility.type).toBe("static");
    expect(staticAbility.effect.type).toBe("gain-keyword");
    expect(staticAbility.effect.keyword).toBe("Ward");
    expect(staticAbility.effect.target).toBe("YOUR_CHARACTERS");
  });

  it("should parse 'Your characters gain Evasive'", () => {
    const result = parseAbilityText("Your characters gain Evasive.");

    expect(result.success).toBe(true);
    const staticAbility = result.ability?.ability as any;
    expect(staticAbility.type).toBe("static");
    expect(staticAbility.effect.type).toBe("gain-keyword");
    expect(staticAbility.effect.keyword).toBe("Evasive");
    expect(staticAbility.effect.target).toBe("YOUR_CHARACTERS");
  });

  it("should parse 'Your characters gain Challenger +{d}'", () => {
    const result = parseAbilityText("Your characters gain Challenger +{d}.");

    expect(result.success).toBe(true);
    const staticAbility = result.ability?.ability as any;
    expect(staticAbility.type).toBe("static");
    expect(staticAbility.effect.type).toBe("gain-keyword");
    expect(staticAbility.effect.keyword).toBe("Challenger");
    expect(staticAbility.effect.value).toBe(D_PLACEHOLDER); // {d} placeholder
    expect(staticAbility.effect.target).toBe("YOUR_CHARACTERS");
  });

  it("should parse 'Your characters gain Resist +2'", () => {
    const result = parseAbilityText("Your characters gain Resist +2.");

    expect(result.success).toBe(true);
    const staticAbility = result.ability?.ability as any;
    expect(staticAbility.type).toBe("static");
    expect(staticAbility.effect.type).toBe("gain-keyword");
    expect(staticAbility.effect.keyword).toBe("Resist");
    expect(staticAbility.effect.value).toBe(2);
    expect(staticAbility.effect.target).toBe("YOUR_CHARACTERS");
  });
});

describe("Static Ability Patterns - Stat Modifiers", () => {
  it("should parse 'Your characters get +1 {S}'", () => {
    const result = parseAbilityText("Your characters get +1 {S}.");

    expect(result.success).toBe(true);
    const staticAbility = result.ability?.ability as any;
    expect(staticAbility.type).toBe("static");
    expect(staticAbility.effect.type).toBe("modify-stat");
    expect(staticAbility.effect.stat).toBe("strength");
    expect(staticAbility.effect.modifier).toBe(1);
    expect(staticAbility.effect.target).toBe("YOUR_CHARACTERS");
  });

  it("should parse 'Your characters get +{d} {L}'", () => {
    const result = parseAbilityText("Your characters get +{d} {L}.");

    expect(result.success).toBe(true);
    const staticAbility = result.ability?.ability as any;
    expect(staticAbility.type).toBe("static");
    expect(staticAbility.effect.type).toBe("modify-stat");
    expect(staticAbility.effect.stat).toBe("lore");
    expect(staticAbility.effect.modifier).toBe(D_PLACEHOLDER); // {d} placeholder
    expect(staticAbility.effect.target).toBe("YOUR_CHARACTERS");
  });

  it("should parse 'Your characters get +2 {W}'", () => {
    const result = parseAbilityText("Your characters get +2 {W}.");

    expect(result.success).toBe(true);
    const staticAbility = result.ability?.ability as any;
    expect(staticAbility.type).toBe("static");
    expect(staticAbility.effect.type).toBe("modify-stat");
    expect(staticAbility.effect.stat).toBe("willpower");
    expect(staticAbility.effect.modifier).toBe(2);
    expect(staticAbility.effect.target).toBe("YOUR_CHARACTERS");
  });
});

describe("Static Ability Patterns - Location Effects", () => {
  it("should parse 'Characters gain Resist +{d} while here'", () => {
    const result = parseAbilityText(
      "ISOLATED Characters gain Resist +{d} while here.",
    );

    expect(result.success).toBe(true);
    const staticAbility = result.ability?.ability as any;
    expect(staticAbility.type).toBe("static");
    expect(staticAbility.effect.type).toBe("gain-keyword");
    expect(staticAbility.effect.keyword).toBe("Resist");
    expect(staticAbility.effect.value).toBe(D_PLACEHOLDER); // {d} placeholder
    expect(staticAbility.effect.target).toBe("CHARACTERS_HERE");
    expect(staticAbility.name).toBe("ISOLATED");
  });

  it("should parse 'Characters gain Ward while here'", () => {
    const result = parseAbilityText("Characters gain Ward while here.");

    expect(result.success).toBe(true);
    const staticAbility = result.ability?.ability as any;
    expect(staticAbility.type).toBe("static");
    expect(staticAbility.effect.type).toBe("gain-keyword");
    expect(staticAbility.effect.keyword).toBe("Ward");
    expect(staticAbility.effect.target).toBe("CHARACTERS_HERE");
  });

  it("should parse 'Characters get +1 {L} while here'", () => {
    const result = parseAbilityText("Characters get +1 {L} while here.");

    expect(result.success).toBe(true);
    const staticAbility = result.ability?.ability as any;
    expect(staticAbility.type).toBe("static");
    expect(staticAbility.effect.type).toBe("modify-stat");
    expect(staticAbility.effect.stat).toBe("lore");
    expect(staticAbility.effect.modifier).toBe(1);
    expect(staticAbility.effect.target).toBe("CHARACTERS_HERE");
  });

  it("should parse 'Characters get +{d} {S} while here'", () => {
    const result = parseAbilityText("Characters get +{d} {S} while here.");

    expect(result.success).toBe(true);
    const staticAbility = result.ability?.ability as any;
    expect(staticAbility.type).toBe("static");
    expect(staticAbility.effect.type).toBe("modify-stat");
    expect(staticAbility.effect.stat).toBe("strength");
    expect(staticAbility.effect.modifier).toBe(D_PLACEHOLDER); // {d} placeholder
    expect(staticAbility.effect.target).toBe("CHARACTERS_HERE");
  });
});

describe("Static Ability Patterns - Special Ability Grants", () => {
  it("should parse 'can challenge ready characters'", () => {
    const result = parseAbilityText(
      "This character can challenge ready characters.",
    );

    expect(result.success).toBe(true);
    const staticAbility = result.ability?.ability as any;
    expect(staticAbility.type).toBe("static");
    expect(staticAbility.effect.type).toBe("grant-ability");
    expect(staticAbility.effect.ability).toBe("can-challenge-ready");
    expect(staticAbility.effect.target).toBe("SELF");
  });

  it("should parse 'can challenge ready characters' with named ability", () => {
    const result = parseAbilityText(
      "RECKLESS ASSAULT This character can challenge ready characters.",
    );

    expect(result.success).toBe(true);
    const staticAbility = result.ability?.ability as any;
    expect(staticAbility.type).toBe("static");
    expect(staticAbility.effect.type).toBe("grant-ability");
    expect(staticAbility.effect.ability).toBe("can-challenge-ready");
    expect(staticAbility.effect.target).toBe("SELF");
    expect(staticAbility.name).toBe("RECKLESS ASSAULT");
  });
});

describe("Static Ability Patterns - Edge Cases", () => {
  it("should handle 'can't' with apostrophe", () => {
    const result = parseAbilityText("This character can't be challenged.");

    expect(result.success).toBe(true);
    const staticAbility = result.ability?.ability as any;
    expect(staticAbility.effect.restriction).toBe("cant-be-challenged");
  });

  it("should handle 'cannot' spelling variant", () => {
    const result = parseAbilityText("This character cannot challenge.");

    expect(result.success).toBe(true);
    const staticAbility = result.ability?.ability as any;
    expect(staticAbility.effect.restriction).toBe("cant-challenge");
  });

  it("should parse 'Your Hero characters gain Ward'", () => {
    const result = parseAbilityText("Your Hero characters gain Ward.");

    expect(result.success).toBe(true);
    const staticAbility = result.ability?.ability as any;
    expect(staticAbility.type).toBe("static");
    expect(staticAbility.effect.type).toBe("gain-keyword");
    expect(staticAbility.effect.keyword).toBe("Ward");
    expect(staticAbility.effect.target).toBe("YOUR_CHARACTERS");
  });

  it("should parse 'Your items gain Rush'", () => {
    const result = parseAbilityText("Your items gain Rush.");

    expect(result.success).toBe(true);
    const staticAbility = result.ability?.ability as any;
    expect(staticAbility.type).toBe("static");
    expect(staticAbility.effect.type).toBe("gain-keyword");
    expect(staticAbility.effect.keyword).toBe("Rush");
    expect(staticAbility.effect.target).toBe("YOUR_ITEMS");
  });
});
