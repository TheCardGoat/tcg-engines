/**
 * Action Parser Tests
 *
 * Tests parsing of standalone action card effects that don't have
 * triggers, costs, or static conditions.
 */

import { describe, expect, it } from "bun:test";
import { parseAbilityText } from "../parser";

describe("Action Parser", () => {
  describe("Simple Draw Effects", () => {
    it("should parse 'Draw 2 cards'", () => {
      const result = parseAbilityText("Draw 2 cards");

      expect(result).toMatchObject({
        success: true,
        ability: {
          ability: {
            type: "action",
            effect: { type: "draw", amount: 2, target: "CONTROLLER" },
          },
        },
      });
    });

    it("should parse 'Draw a card'", () => {
      const result = parseAbilityText("Draw a card");

      expect(result).toMatchObject({
        success: true,
        ability: {
          ability: {
            type: "action",
            effect: { type: "draw", amount: 1 },
          },
        },
      });
    });

    it("should parse 'Each player draws a card'", () => {
      const result = parseAbilityText("Each player draws a card");

      expect(result).toMatchObject({
        success: true,
        ability: {
          ability: {
            type: "action",
            effect: { type: "draw", amount: 1, target: "EACH_PLAYER" },
          },
        },
      });
    });

    it("should parse 'Each player draws 2 cards'", () => {
      const result = parseAbilityText("Each player draws 2 cards");

      expect(result).toMatchObject({
        success: true,
        ability: {
          ability: {
            type: "action",
            effect: { type: "draw", amount: 2, target: "EACH_PLAYER" },
          },
        },
      });
    });
  });

  describe("Damage Effects", () => {
    it("should parse 'Deal 3 damage to chosen character'", () => {
      const result = parseAbilityText("Deal 3 damage to chosen character");

      expect(result).toMatchObject({
        success: true,
        ability: {
          ability: {
            type: "action",
            effect: {
              type: "deal-damage",
              amount: 3,
              target: {
                selector: "chosen",
                count: 1,
                owner: "any",
                zones: ["play"],
                cardTypes: ["character"],
              },
            },
          },
        },
      });
    });

    it("should parse 'Deal 2 damage to each opposing character'", () => {
      const result = parseAbilityText(
        "Deal 2 damage to each opposing character",
      );

      expect(result).toMatchObject({
        success: true,
        ability: {
          ability: {
            type: "action",
            effect: {
              type: "deal-damage",
              amount: 2,
              target: {
                selector: "all",
                count: "all",
                owner: "opponent",
                zones: ["play"],
                cardTypes: ["character"],
              },
            },
          },
        },
      });
    });
  });

  describe("Banish Effects", () => {
    it("should parse 'Banish all items'", () => {
      const result = parseAbilityText("Banish all items");

      expect(result).toMatchObject({
        success: true,
        ability: {
          ability: {
            type: "action",
            effect: {
              type: "banish",
              target: {
                selector: "all",
                count: "all",
                owner: "any",
                zones: ["play"],
                cardTypes: ["item"],
              },
            },
          },
        },
      });
    });

    it("should parse 'Banish chosen character'", () => {
      const result = parseAbilityText("Banish chosen character");

      expect(result).toMatchObject({
        success: true,
        ability: {
          ability: {
            type: "action",
            effect: {
              type: "banish",
              target: {
                selector: "chosen",
                count: 1,
                owner: "any",
                zones: ["play"],
                cardTypes: ["character"],
              },
            },
          },
        },
      });
    });

    it("should parse 'Banish all characters'", () => {
      const result = parseAbilityText("Banish all characters");

      expect(result).toMatchObject({
        success: true,
        ability: {
          ability: {
            type: "action",
            effect: {
              type: "banish",
              target: {
                selector: "all",
                count: "all",
                owner: "any",
                zones: ["play"],
                cardTypes: ["character"],
              },
            },
          },
        },
      });
    });

    it("should parse 'Banish all opposing items'", () => {
      const result = parseAbilityText("Banish all opposing items");

      expect(result).toMatchObject({
        success: true,
        ability: {
          ability: {
            type: "action",
            effect: {
              type: "banish",
              target: {
                selector: "all",
                count: "all",
                owner: "opponent",
                zones: ["play"],
                cardTypes: ["item"],
              },
            },
          },
        },
      });
    });
  });

  describe("Lore Effects", () => {
    it("should parse 'Gain 2 lore'", () => {
      const result = parseAbilityText("Gain 2 lore");

      expect(result).toMatchObject({
        success: true,
        ability: {
          ability: {
            type: "action",
            effect: { type: "gain-lore", amount: 2 },
          },
        },
      });
    });

    it("should parse 'Each opponent loses 2 lore'", () => {
      const result = parseAbilityText("Each opponent loses 2 lore");

      expect(result).toMatchObject({
        success: true,
        ability: {
          ability: {
            type: "action",
            effect: { type: "lose-lore", amount: 2, target: "EACH_OPPONENT" },
          },
        },
      });
    });
  });

  describe("Ready/Exert Effects", () => {
    it("should parse 'Ready chosen character'", () => {
      const result = parseAbilityText("Ready chosen character");

      expect(result).toMatchObject({
        success: true,
        ability: {
          ability: {
            type: "action",
            effect: {
              type: "ready",
              target: {
                selector: "chosen",
                count: 1,
                owner: "any",
                zones: ["play"],
                cardTypes: ["character"],
              },
            },
          },
        },
      });
    });

    it("should parse 'Ready chosen item'", () => {
      const result = parseAbilityText("Ready chosen item");

      expect(result).toMatchObject({
        success: true,
        ability: {
          ability: {
            type: "action",
            effect: { type: "ready" },
          },
        },
      });
    });

    it("should parse 'Exert chosen opposing character'", () => {
      const result = parseAbilityText("Exert chosen opposing character");

      expect(result).toMatchObject({
        success: true,
        ability: {
          ability: {
            type: "action",
            effect: {
              type: "exert",
              target: {
                selector: "chosen",
                count: 1,
                owner: "opponent",
                zones: ["play"],
                cardTypes: ["character"],
              },
            },
          },
        },
      });
    });
  });

  describe("Return to Hand Effects", () => {
    it("should parse 'Return chosen character to their player's hand'", () => {
      const result = parseAbilityText(
        "Return chosen character to their player's hand",
      );

      expect(result).toMatchObject({
        success: true,
        ability: {
          ability: {
            type: "action",
            effect: {
              type: "return-to-hand",
              target: {
                selector: "chosen",
                count: 1,
                owner: "any",
                zones: ["play"],
                cardTypes: ["character"],
              },
            },
          },
        },
      });
    });
  });

  describe("Discard Effects", () => {
    it("should parse 'Each player chooses and discards a card'", () => {
      const result = parseAbilityText(
        "Each player chooses and discards a card",
      );

      expect(result).toMatchObject({
        success: true,
        ability: {
          ability: {
            type: "action",
            effect: {
              type: "discard",
              amount: 1,
              target: "EACH_PLAYER",
              chosen: true,
            },
          },
        },
      });
    });

    it("should parse 'Each opponent chooses and discards a card'", () => {
      const result = parseAbilityText(
        "Each opponent chooses and discards a card",
      );

      expect(result).toMatchObject({
        success: true,
        ability: {
          ability: {
            type: "action",
            effect: {
              type: "discard",
              amount: 1,
              target: "EACH_OPPONENT",
              chosen: true,
            },
          },
        },
      });
    });
  });

  describe("Composite Effects", () => {
    it("should successfully parse composite effects (though may only parse first part)", () => {
      const result = parseAbilityText("Gain 2 lore. Draw a card.");

      expect(result).toMatchObject({
        success: true,
        ability: { ability: { type: "action" } },
      });
    });

    it("should successfully parse multi-part effects (though may only parse first part)", () => {
      const result = parseAbilityText("Banish chosen item. Draw a card.");

      expect(result).toMatchObject({
        success: true,
        ability: { ability: { type: "action" } },
      });
    });
  });

  describe("Negative Cases - Should NOT be parsed as actions", () => {
    it("should NOT parse triggered abilities as actions", () => {
      const result = parseAbilityText(
        "When you play this character, draw 2 cards",
      );

      expect(result).toMatchObject({
        success: true,
        ability: { ability: { type: "triggered" } },
      });
    });

    it("should NOT parse activated abilities as actions", () => {
      const result = parseAbilityText("{E} - Draw a card");

      expect(result).toMatchObject({
        success: true,
        ability: { ability: { type: "activated" } },
      });
    });

    it("should NOT parse static abilities as actions", () => {
      const result = parseAbilityText("Your characters gain Ward");

      expect(result).toMatchObject({
        success: true,
        ability: { ability: { type: "static" } },
      });
    });

    it("should NOT parse keywords as actions", () => {
      const result = parseAbilityText("Rush");

      expect(result).toMatchObject({
        success: true,
        ability: { ability: { type: "keyword" } },
      });
    });
  });
});
