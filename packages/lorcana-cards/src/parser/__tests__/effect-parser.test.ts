/**
 * Tests for Effect, Target, and Condition Parsers
 *
 * Tests parsing of effects, targets, and conditions from ability text.
 */

import { describe, expect, it } from "bun:test";
import { parseCondition } from "../parsers/condition-parser";
import { parseEffect } from "../parsers/effect-parser";
import {
  parseCharacterTarget,
  parsePlayerTarget,
} from "../parsers/target-parser";

describe("Effect Parser", () => {
  describe("Draw Effects", () => {
    it("should parse draw 2 cards", () => {
      const effect = parseEffect("draw 2 cards");

      expect(effect).toEqual({
        type: "draw",
        amount: 2,
        target: "CONTROLLER",
      });
    });

    it("should parse draw a card", () => {
      const effect = parseEffect("draw a card");

      expect(effect).toEqual({
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      });
    });

    it("should parse draw an card", () => {
      const effect = parseEffect("draw an card");

      expect(effect).toEqual({
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      });
    });

    it("should parse optional draw", () => {
      const effect = parseEffect("you may draw a card");

      expect(effect).toEqual({
        type: "optional",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      });
    });
  });

  describe("Damage Effects", () => {
    it("should parse deal 3 damage to chosen character", () => {
      const effect = parseEffect("deal 3 damage to chosen character");

      expect(effect).toEqual({
        type: "deal-damage",
        amount: 3,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      });
    });

    it("should parse remove up to 3 damage", () => {
      const effect = parseEffect("remove up to 3 damage from chosen character");

      expect(effect).toEqual({
        type: "remove-damage",
        amount: 3,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        upTo: true,
      });
    });
  });

  describe("Lore Effects", () => {
    it("should parse gain 2 lore", () => {
      const effect = parseEffect("gain 2 lore");

      expect(effect).toEqual({
        type: "gain-lore",
        amount: 2,
      });
    });
  });

  describe("Exert/Ready Effects", () => {
    it("should parse exert chosen character", () => {
      const effect = parseEffect("exert chosen character");

      expect(effect).toEqual({
        type: "exert",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      });
    });

    it("should parse ready chosen character", () => {
      const effect = parseEffect("ready chosen character");

      expect(effect).toEqual({
        type: "ready",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      });
    });
  });

  describe("Stat Modification Effects", () => {
    it("should parse gets +2 strength this turn", () => {
      const effect = parseEffect("chosen character gets +2 {S} this turn");

      expect(effect).toEqual({
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        duration: "this-turn",
      });
    });

    it("should parse negative stat modifier", () => {
      const effect = parseEffect("chosen character gets -1 {S} this turn");

      expect(effect).toEqual({
        type: "modify-stat",
        stat: "strength",
        modifier: -1,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        duration: "this-turn",
      });
    });
  });

  describe("Search Deck Effects", () => {
    it("should parse search deck for character", () => {
      const effect = parseEffect("search your deck for a character");

      expect(effect).toEqual({
        type: "search-deck",
        cardType: "character",
        putInto: "hand",
        shuffle: false,
      });
    });

    it("should parse search deck and add to hand", () => {
      const effect = parseEffect(
        "search your deck for a song and add it to your hand",
      );

      expect(effect).toEqual({
        type: "search-deck",
        cardType: "song",
        putInto: "hand",
        shuffle: false,
      });
    });

    it("should parse search deck with shuffle pattern", () => {
      const effect = parseEffect(
        "search your deck for a character and add it to your hand then shuffle",
      );

      expect(effect).toEqual({
        type: "search-deck",
        cardType: "character",
        putInto: "hand",
        shuffle: true,
      });
    });

    it("should parse search deck into play", () => {
      const effect = parseEffect(
        "search your deck for a character and put it into play",
      );

      expect(effect).toEqual({
        type: "search-deck",
        cardType: "character",
        putInto: "play",
        shuffle: false,
      });
    });
  });

  describe("Look At Cards Effects", () => {
    it("should parse look at top 3 cards", () => {
      const effect = parseEffect("look at the top 3 cards of your deck");

      expect(effect).toEqual({
        type: "look-at-cards",
        amount: 3,
        from: "top-of-deck",
        target: "CONTROLLER",
      });
    });

    it("should parse look at top 4 with sequences", () => {
      const effect = parseEffect("look at the top 4 cards of your deck");

      // This should just parse as a basic look-at-cards effect
      expect(effect?.type).toBe("look-at-cards");
      if (effect?.type === "look-at-cards") {
        expect(effect.amount).toBe(4);
        expect(effect.from).toBe("top-of-deck");
      }
    });
  });

  describe("Put Into Inkwell Effects", () => {
    it("should parse put top card into inkwell", () => {
      const effect = parseEffect(
        "put the top card of your deck into your inkwell",
      );

      expect(effect).toEqual({
        type: "put-into-inkwell",
        source: "top-of-deck",
        target: "CONTROLLER",
      });
    });

    it("should parse put into inkwell facedown", () => {
      const effect = parseEffect(
        "put the top card of your deck into your inkwell facedown",
      );

      // Note: Parser outputs facedown but PutIntoInkwellEffect type doesn't have facedown property
      // This is a type limitation, the parser behavior is correct
      expect(effect?.type).toBe("put-into-inkwell");
      expect((effect as any).source).toBe("top-of-deck");
      expect((effect as any).target).toBe("CONTROLLER");
      expect((effect as any).facedown).toBe(true);
    });

    it("should parse optional put into inkwell", () => {
      const effect = parseEffect(
        "you may put a card from your hand into your inkwell",
      );

      // This gets wrapped in optional
      expect(effect?.type).toBe("optional");
      if (effect?.type === "optional") {
        expect(effect.effect).toEqual({
          type: "put-into-inkwell",
          source: "hand",
          target: "CONTROLLER",
        });
      }
    });
  });

  describe("Shuffle Into Deck Effects", () => {
    it("should parse shuffle character into deck", () => {
      const effect = parseEffect(
        "shuffle chosen character into their player's deck",
      );

      expect(effect).toEqual({
        type: "shuffle-into-deck",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        intoDeck: "owner",
      });
    });
  });

  describe("Return From Discard Effects", () => {
    it("should parse return action from discard", () => {
      const effect = parseEffect(
        "return an action card from your discard to your hand",
      );

      expect(effect).toEqual({
        type: "return-from-discard",
        cardType: "action",
        target: "CONTROLLER",
      });
    });

    it("should parse return character from discard", () => {
      const effect = parseEffect(
        "return a character from your discard to your hand",
      );

      expect(effect).toEqual({
        type: "return-from-discard",
        cardType: "character",
        target: "CONTROLLER",
      });
    });
  });

  describe("Move To Location Effects", () => {
    it("should parse move character to location", () => {
      const effect = parseEffect(
        "move one of your characters to this location",
      );

      // This parses "your characters" as target
      expect(effect?.type).toBe("move-to-location");
      if (effect?.type === "move-to-location") {
        expect(effect.cost).toBe("normal");
      }
    });

    it("should parse move character to location for free", () => {
      const effect = parseEffect(
        "move a character of yours to a location for free",
      );

      expect(effect?.type).toBe("move-to-location");
      if (effect?.type === "move-to-location") {
        expect(effect.cost).toBe("free");
      }
    });
  });

  describe("Put Under Effects", () => {
    it("should parse put top card under this character", () => {
      const effect = parseEffect(
        "put the top card of your deck under this character",
      );

      expect(effect).toEqual({
        type: "put-under",
        source: "top-of-deck",
        under: "self",
      });
    });

    it("should parse put card from hand under chosen character", () => {
      const effect = parseEffect(
        "put a card from your hand under chosen character",
      );

      expect(effect).toEqual({
        type: "put-under",
        source: "hand",
        under: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      });
    });
  });

  describe("Composite Effects", () => {
    it("should parse sequence with 'then' separator", () => {
      const effect = parseEffect(
        "Draw 2 cards, then choose and discard a card",
      );

      expect(effect).toBeDefined();
      expect(effect?.type).toBe("sequence");
      if (effect?.type === "sequence") {
        expect(effect.steps).toHaveLength(2);
        expect(effect.steps[0]).toEqual({
          type: "draw",
          amount: 2,
          target: "CONTROLLER",
        });
        expect(effect.steps[1]).toEqual({
          type: "discard",
          amount: 1,
          target: "CONTROLLER",
          chosen: true,
        });
      }
    });

    it("should parse sequence with period separator", () => {
      const effect = parseEffect("Draw a card. Gain 1 lore.");

      expect(effect).toBeDefined();
      expect(effect?.type).toBe("sequence");
      if (effect?.type === "sequence") {
        expect(effect.steps).toHaveLength(2);
        expect(effect.steps[0].type).toBe("draw");
        expect(effect.steps[1].type).toBe("gain-lore");
      }
    });

    it("should parse sequence with 'and' separator", () => {
      const effect = parseEffect("Draw a card and gain 1 lore");

      expect(effect).toBeDefined();
      expect(effect?.type).toBe("sequence");
      if (effect?.type === "sequence") {
        expect(effect.steps).toHaveLength(2);
        expect(effect.steps[0].type).toBe("draw");
        expect(effect.steps[1].type).toBe("gain-lore");
      }
    });
  });
});

describe("Target Parser", () => {
  describe("Character Targets", () => {
    it("should parse chosen character", () => {
      const target = parseCharacterTarget("deal 3 damage to chosen character");
      expect(target).toEqual({
        selector: "chosen",
        count: 1,
        owner: "any",
        zones: ["play"],
        cardTypes: ["character"],
      });
    });

    it("should parse chosen opposing character", () => {
      const target = parseCharacterTarget("exert chosen opposing character");
      expect(target).toEqual({
        selector: "chosen",
        count: 1,
        owner: "opponent",
        zones: ["play"],
        cardTypes: ["character"],
      });
    });

    it("should parse your characters", () => {
      const target = parseCharacterTarget("your characters get +1 {S}");
      expect(target).toEqual({
        selector: "all",
        count: "all",
        owner: "you",
        zones: ["play"],
        cardTypes: ["character"],
      });
    });

    it("should parse all opposing characters", () => {
      const target = parseCharacterTarget(
        "deal 2 damage to all opposing characters",
      );
      expect(target).toEqual({
        selector: "all",
        count: "all",
        owner: "opponent",
        zones: ["play"],
        cardTypes: ["character"],
      });
    });

    it("should parse self reference", () => {
      const target = parseCharacterTarget("this character gets +2 {S}");
      expect(target).toBe("SELF");
    });
  });

  describe("Player Targets", () => {
    it("should parse you (controller)", () => {
      const target = parsePlayerTarget("you draw 2 cards");
      expect(target).toBe("CONTROLLER");
    });

    it("should parse opponent", () => {
      const target = parsePlayerTarget("opponent discards a card");
      expect(target).toBe("OPPONENT");
    });
  });
});

describe("Condition Parser", () => {
  describe("Named Character Conditions", () => {
    it("should parse named character condition", () => {
      const condition = parseCondition("if you have a character named Elsa");

      expect(condition).toEqual({
        type: "has-named-character",
        name: "Elsa",
        controller: "you",
      });
    });
  });

  describe("Resource Conditions", () => {
    it("should parse no cards in hand", () => {
      const condition = parseCondition("if you have no cards in your hand");

      expect(condition).toEqual({
        type: "resource-count",
        what: "cards-in-hand",
        controller: "you",
        comparison: "equal",
        value: 0,
      });
    });

    it("should parse 3 or more characters", () => {
      const condition = parseCondition(
        "if you have 3 or more characters in play",
      );

      expect(condition).toEqual({
        type: "resource-count",
        what: "characters",
        controller: "you",
        comparison: "greater-or-equal",
        value: 3,
      });
    });
  });

  describe("State Conditions", () => {
    it("should parse while damaged", () => {
      const condition = parseCondition("while this character has damage");

      expect(condition).toEqual({
        type: "has-any-damage",
      });
    });

    it("should parse while no damage", () => {
      const condition = parseCondition("while this character has no damage");

      expect(condition).toEqual({
        type: "no-damage",
      });
    });
  });

  describe("Contextual Conditions", () => {
    it("should parse while challenging", () => {
      const condition = parseCondition("while challenging");

      expect(condition).toEqual({
        type: "in-challenge",
      });
    });

    it("should parse while questing", () => {
      const condition = parseCondition("while questing");

      expect(condition).toEqual({
        type: "in-challenge",
      });
    });
  });

  describe("Optional Effect Conditions", () => {
    it("should parse you may", () => {
      const condition = parseCondition("you may draw a card");

      expect(condition).toEqual({
        type: "player-choice",
      });
    });
  });
});
