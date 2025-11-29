/**
 * Action Parser Tests
 *
 * Tests parsing of standalone action card effects that don't have
 * triggers, costs, or static conditions.
 */

import { describe, expect, it } from "bun:test";
import type { ActionAbility } from "../../cards/abilities/types/ability-types";
import { parseAbilityText } from "../parser";

describe("Action Parser", () => {
  describe("Simple Draw Effects", () => {
    it("should parse 'Draw 2 cards'", () => {
      const result = parseAbilityText("Draw 2 cards");
      expect(result.success).toBe(true);
      expect(result.ability?.ability.type).toBe("action");

      const action = result.ability?.ability as ActionAbility;
      expect(action.effect.type).toBe("draw");
      if (action.effect.type === "draw") {
        expect(action.effect.amount).toBe(2);
        expect(action.effect.target).toBe("CONTROLLER");
      }
    });

    it("should parse 'Draw a card'", () => {
      const result = parseAbilityText("Draw a card");
      expect(result.success).toBe(true);
      expect(result.ability?.ability.type).toBe("action");

      const action = result.ability?.ability as ActionAbility;
      expect(action.effect.type).toBe("draw");
      if (action.effect.type === "draw") {
        expect(action.effect.amount).toBe(1);
      }
    });

    it("should parse 'Each player draws a card'", () => {
      const result = parseAbilityText("Each player draws a card");
      expect(result.success).toBe(true);
      expect(result.ability?.ability.type).toBe("action");

      const action = result.ability?.ability as ActionAbility;
      expect(action.effect.type).toBe("draw");
      if (action.effect.type === "draw") {
        expect(action.effect.amount).toBe(1);
        expect(action.effect.target).toBe("EACH_PLAYER");
      }
    });

    it("should parse 'Each player draws 2 cards'", () => {
      const result = parseAbilityText("Each player draws 2 cards");
      expect(result.success).toBe(true);
      expect(result.ability?.ability.type).toBe("action");

      const action = result.ability?.ability as ActionAbility;
      expect(action.effect.type).toBe("draw");
      if (action.effect.type === "draw") {
        expect(action.effect.amount).toBe(2);
        expect(action.effect.target).toBe("EACH_PLAYER");
      }
    });
  });

  describe("Damage Effects", () => {
    it("should parse 'Deal 3 damage to chosen character'", () => {
      const result = parseAbilityText("Deal 3 damage to chosen character");
      expect(result.success).toBe(true);
      expect(result.ability?.ability.type).toBe("action");

      const action = result.ability?.ability as ActionAbility;
      expect(action.effect.type).toBe("deal-damage");
      if (action.effect.type === "deal-damage") {
        expect(action.effect.amount).toBe(3);
        expect(action.effect.target).toBe("CHOSEN_CHARACTER");
      }
    });

    it("should parse 'Deal 2 damage to each opposing character'", () => {
      const result = parseAbilityText(
        "Deal 2 damage to each opposing character",
      );
      expect(result.success).toBe(true);
      expect(result.ability?.ability.type).toBe("action");

      const action = result.ability?.ability as ActionAbility;
      expect(action.effect.type).toBe("deal-damage");
      if (action.effect.type === "deal-damage") {
        expect(action.effect.amount).toBe(2);
        expect(action.effect.target).toBe("ALL_OPPOSING_CHARACTERS");
      }
    });
  });

  describe("Banish Effects", () => {
    it("should parse 'Banish all items'", () => {
      const result = parseAbilityText("Banish all items");
      expect(result.success).toBe(true);
      expect(result.ability?.ability.type).toBe("action");

      const action = result.ability?.ability as ActionAbility;
      expect(action.effect.type).toBe("banish");
    });

    it("should parse 'Banish chosen character'", () => {
      const result = parseAbilityText("Banish chosen character");
      expect(result.success).toBe(true);
      expect(result.ability?.ability.type).toBe("action");

      const action = result.ability?.ability as ActionAbility;
      expect(action.effect.type).toBe("banish");
      if (action.effect.type === "banish") {
        expect(action.effect.target).toBe("CHOSEN_CHARACTER");
      }
    });

    it("should parse 'Banish all characters'", () => {
      const result = parseAbilityText("Banish all characters");
      expect(result.success).toBe(true);
      expect(result.ability?.ability.type).toBe("action");

      const action = result.ability?.ability as ActionAbility;
      expect(action.effect.type).toBe("banish");
    });

    it("should parse 'Banish all opposing items'", () => {
      const result = parseAbilityText("Banish all opposing items");
      expect(result.success).toBe(true);
      expect(result.ability?.ability.type).toBe("action");

      const action = result.ability?.ability as ActionAbility;
      expect(action.effect.type).toBe("banish");
    });
  });

  describe("Lore Effects", () => {
    it("should parse 'Gain 2 lore'", () => {
      const result = parseAbilityText("Gain 2 lore");
      expect(result.success).toBe(true);
      expect(result.ability?.ability.type).toBe("action");

      const action = result.ability?.ability as ActionAbility;
      expect(action.effect.type).toBe("gain-lore");
      if (action.effect.type === "gain-lore") {
        expect(action.effect.amount).toBe(2);
      }
    });

    it("should parse 'Each opponent loses 2 lore'", () => {
      const result = parseAbilityText("Each opponent loses 2 lore");
      expect(result.success).toBe(true);
      expect(result.ability?.ability.type).toBe("action");

      const action = result.ability?.ability as ActionAbility;
      expect(action.effect.type).toBe("lose-lore");
      if (action.effect.type === "lose-lore") {
        expect(action.effect.amount).toBe(2);
        expect(action.effect.target).toBe("EACH_OPPONENT");
      }
    });
  });

  describe("Ready/Exert Effects", () => {
    it("should parse 'Ready chosen character'", () => {
      const result = parseAbilityText("Ready chosen character");
      expect(result.success).toBe(true);
      expect(result.ability?.ability.type).toBe("action");

      const action = result.ability?.ability as ActionAbility;
      expect(action.effect.type).toBe("ready");
      if (action.effect.type === "ready") {
        expect(action.effect.target).toBe("CHOSEN_CHARACTER");
      }
    });

    it("should parse 'Ready chosen item'", () => {
      const result = parseAbilityText("Ready chosen item");
      expect(result.success).toBe(true);
      expect(result.ability?.ability.type).toBe("action");

      const action = result.ability?.ability as ActionAbility;
      expect(action.effect.type).toBe("ready");
    });

    it("should parse 'Exert chosen opposing character'", () => {
      const result = parseAbilityText("Exert chosen opposing character");
      expect(result.success).toBe(true);
      expect(result.ability?.ability.type).toBe("action");

      const action = result.ability?.ability as ActionAbility;
      expect(action.effect.type).toBe("exert");
      if (action.effect.type === "exert") {
        expect(action.effect.target).toBe("CHOSEN_OPPOSING_CHARACTER");
      }
    });
  });

  describe("Return to Hand Effects", () => {
    it("should parse 'Return chosen character to their player's hand'", () => {
      const result = parseAbilityText(
        "Return chosen character to their player's hand",
      );
      expect(result.success).toBe(true);
      expect(result.ability?.ability.type).toBe("action");

      const action = result.ability?.ability as ActionAbility;
      expect(action.effect.type).toBe("return-to-hand");
      if (action.effect.type === "return-to-hand") {
        expect(action.effect.target).toBe("CHOSEN_CHARACTER");
      }
    });
  });

  describe("Discard Effects", () => {
    it("should parse 'Each player chooses and discards a card'", () => {
      const result = parseAbilityText(
        "Each player chooses and discards a card",
      );
      expect(result.success).toBe(true);
      expect(result.ability?.ability.type).toBe("action");

      const action = result.ability?.ability as ActionAbility;
      expect(action.effect.type).toBe("discard");
      if (action.effect.type === "discard") {
        expect(action.effect.amount).toBe(1);
        expect(action.effect.target).toBe("EACH_PLAYER");
        expect(action.effect.chosen).toBe(true);
      }
    });

    it("should parse 'Each opponent chooses and discards a card'", () => {
      const result = parseAbilityText(
        "Each opponent chooses and discards a card",
      );
      expect(result.success).toBe(true);
      expect(result.ability?.ability.type).toBe("action");

      const action = result.ability?.ability as ActionAbility;
      expect(action.effect.type).toBe("discard");
      if (action.effect.type === "discard") {
        expect(action.effect.amount).toBe(1);
        expect(action.effect.target).toBe("EACH_OPPONENT");
        expect(action.effect.chosen).toBe(true);
      }
    });
  });

  describe("Composite Effects", () => {
    it("should successfully parse composite effects (though may only parse first part)", () => {
      const result = parseAbilityText("Gain 2 lore. Draw a card.");
      // Composite effects are not fully implemented yet, but shouldn't fail
      expect(result.success).toBe(true);
      expect(result.ability?.ability.type).toBe("action");
    });

    it("should successfully parse multi-part effects (though may only parse first part)", () => {
      const result = parseAbilityText("Banish chosen item. Draw a card.");
      expect(result.success).toBe(true);
      expect(result.ability?.ability.type).toBe("action");
    });
  });

  describe("Negative Cases - Should NOT be parsed as actions", () => {
    it("should NOT parse triggered abilities as actions", () => {
      const result = parseAbilityText(
        "When you play this character, draw 2 cards",
      );
      expect(result.success).toBe(true);
      expect(result.ability?.ability.type).not.toBe("action");
      expect(result.ability?.ability.type).toBe("triggered");
    });

    it("should NOT parse activated abilities as actions", () => {
      const result = parseAbilityText("{E} - Draw a card");
      expect(result.success).toBe(true);
      expect(result.ability?.ability.type).not.toBe("action");
      expect(result.ability?.ability.type).toBe("activated");
    });

    it("should NOT parse static abilities as actions", () => {
      const result = parseAbilityText("Your characters gain Ward");
      expect(result.success).toBe(true);
      expect(result.ability?.ability.type).not.toBe("action");
      expect(result.ability?.ability.type).toBe("static");
    });

    it("should NOT parse keywords as actions", () => {
      const result = parseAbilityText("Rush");
      expect(result.success).toBe(true);
      expect(result.ability?.ability.type).not.toBe("action");
      expect(result.ability?.ability.type).toBe("keyword");
    });
  });
});
