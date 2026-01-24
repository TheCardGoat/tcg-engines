/**
 * Tests for multi-ability text splitting
 *
 * Many Lorcana cards have multiple abilities separated by newlines.
 * The parser should split these and parse each ability individually.
 *
 * @group parser
 * @group multi-ability
 */

import { describe, expect, it } from "bun:test";
import { parseAbilityTextMulti } from "../parser";

describe("Multi-Ability Text Splitting", () => {
  describe("newline-separated abilities", () => {
    it("should split abilities by newline and parse first ability", () => {
      const text =
        "HOLD... YOUR HORSES This character enters play exerted.\nDEEP RESEARCH Whenever this character quests, you may give chosen Detective character +2 {S} this turn.";

      const result = parseAbilityTextMulti(text);

      expect(result.success).toBe(true);
      // At least 1 ability should parse (the "enters play exerted" one)
      expect(result.abilities.length).toBeGreaterThanOrEqual(1);

      const firstAbility = result.abilities[0]?.ability as any;
      expect(firstAbility?.type).toBe("static");
      expect(firstAbility?.effect?.type).toBe("restriction");
      expect(firstAbility?.effect?.restriction).toBe("enters-play-exerted");
    });

    it("should parse keyword abilities separated by newline", () => {
      // Using simpler text without parentheticals
      const text = "Bodyguard\nSupport";

      const result = parseAbilityTextMulti(text);

      expect(result.success).toBe(true);
      expect(result.abilities.length).toBe(2);

      const ability1 = result.abilities[0]?.ability as any;
      const ability2 = result.abilities[1]?.ability as any;

      expect(ability1?.type).toBe("keyword");
      expect(ability1?.keyword).toBe("Bodyguard");

      expect(ability2?.type).toBe("keyword");
      expect(ability2?.keyword).toBe("Support");
    });

    it("should handle Boost keyword parsing", () => {
      const text = "Boost 2 {I}";

      const result = parseAbilityTextMulti(text);

      expect(result.success).toBe(true);
      expect(result.abilities.length).toBe(1);

      const ability1 = result.abilities[0]?.ability as any;
      expect(ability1?.type).toBe("keyword");
      expect(ability1?.keyword).toBe("Boost");
      expect(ability1?.value).toBe(2);
    });

    it("should handle Shift keyword parsing", () => {
      const text = "Shift 4 {I}";

      const result = parseAbilityTextMulti(text);

      expect(result.success).toBe(true);
      expect(result.abilities.length).toBe(1);

      const ability1 = result.abilities[0]?.ability as any;
      expect(ability1?.type).toBe("keyword");
      expect(ability1?.keyword).toBe("Shift");
    });

    it("should return single ability for non-newline text", () => {
      const text = "Evasive";

      const result = parseAbilityTextMulti(text);

      expect(result.success).toBe(true);
      expect(result.abilities.length).toBe(1);
    });

    it("should handle partial success when only some abilities parse", () => {
      // This tests that we get warnings for unparseable abilities but still succeed
      // if at least one ability parses
      const text =
        "Rush\nSOME COMPLEX ABILITY THAT WONT PARSE YET with nested conditionals and multiple clauses that are too complex";

      const result = parseAbilityTextMulti(text);

      // Should still succeed with partial results
      expect(result.success).toBe(true);
      expect(result.abilities.length).toBeGreaterThanOrEqual(1);
      expect(result.warnings).toBeDefined();
      expect(result.warnings?.length).toBeGreaterThanOrEqual(1);

      const ability1 = result.abilities[0]?.ability as any;
      expect(ability1?.type).toBe("keyword");
      expect(ability1?.keyword).toBe("Rush");
    });
  });

  describe("edge cases", () => {
    it("should handle empty lines between abilities", () => {
      const text = "Evasive\n\nRush";

      const result = parseAbilityTextMulti(text);

      expect(result.success).toBe(true);
      expect(result.abilities.length).toBe(2);
    });

    it("should handle trailing newline", () => {
      const text = "Bodyguard\n";

      const result = parseAbilityTextMulti(text);

      expect(result.success).toBe(true);
      expect(result.abilities.length).toBe(1);
    });

    it("should handle leading newline", () => {
      const text = "\nWard";

      const result = parseAbilityTextMulti(text);

      expect(result.success).toBe(true);
      expect(result.abilities.length).toBe(1);
    });
  });

  describe("static abilities - enters play exerted", () => {
    it("should parse named 'enters play exerted' ability", () => {
      const text = "ASLEEP This item enters play exerted.";

      const result = parseAbilityTextMulti(text);

      expect(result.success).toBe(true);
      expect(result.abilities.length).toBe(1);

      const ability = result.abilities[0]?.ability as any;
      expect(ability?.type).toBe("static");
      expect(ability?.effect?.type).toBe("restriction");
      expect(ability?.effect?.restriction).toBe("enters-play-exerted");
      expect(ability?.name).toBe("ASLEEP");
    });

    it("should parse 'This character enters play exerted' without name", () => {
      const text = "This character enters play exerted.";

      const result = parseAbilityTextMulti(text);

      expect(result.success).toBe(true);
      expect(result.abilities.length).toBe(1);

      const ability = result.abilities[0]?.ability as any;
      expect(ability?.type).toBe("static");
      expect(ability?.effect?.type).toBe("restriction");
      expect(ability?.effect?.restriction).toBe("enters-play-exerted");
    });
  });
});
