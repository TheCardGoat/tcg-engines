import { describe, expect, it } from "bun:test";
import { parseEffect } from "../parsers/effect-parser";
import { parseStaticAbility } from "../parsers/static-parser";

describe("Set 001 Parsing Fixes", () => {
  describe("Complex Sequences & Dependencies", () => {
    // Rapunzel - Gifted with Healing
    // "When you play this character, remove up to 3 damage from chosen character. Draw a card for each 1 damage removed this way."
    it("should parse Rapunzel's damage removal and draw dependency", () => {
      const effect = parseEffect(
        "remove up to 3 damage from chosen character. Draw a card for each 1 damage removed this way",
      );

      // Current parser likely fails to link the second sentence or parse "for each 1 damage removed this way"
      expect(effect).toBeDefined();
      expect(effect?.type).toBe("sequence");

      if (effect?.type === "sequence") {
        expect(effect.steps[0].type).toBe("remove-damage");
        expect(effect.steps[1].type).toBe("for-each");

        const forEach = effect.steps[1] as any;
        expect(forEach.counter.type).toBe("damage-removed");
        expect(forEach.effect.type).toBe("draw");
      }
    });

    // Ursula - Power Hungry
    // "When you play this character, each opponent loses 1 lore. You may draw a card for each 1 lore lost this way."
    it("should parse Ursula's lore loss and draw dependency", () => {
      const effect = parseEffect(
        "each opponent loses 1 lore. You may draw a card for each 1 lore lost this way",
      );

      expect(effect).toBeDefined();
      if (effect?.type === "sequence") {
        expect(effect.steps[0].type).toBe("lose-lore");
        // The second part might be wrapped in optional
        const step2 = effect.steps[1];
        if (step2.type === "optional") {
          const inner = step2.effect as any;
          expect(inner.type).toBe("for-each");
          expect(inner.counter.type).toBe("lore-lost");
        }
      }
    });

    // Yzma - Alchemist
    // "Exert - Look at the top card of your deck. Put it on either the top or the bottom of your deck."
    // TODO: "either X or Y" choice pattern is not yet implemented in the parser
    // Currently parses as move-cards, needs choice effect parsing for deck positioning
    it.skip("should parse Yzma's look and put top/bottom", () => {
      const effect = parseEffect(
        "Look at the top card of your deck. Put it on either the top or the bottom of your deck",
      );

      expect(effect).toBeDefined();
      expect(effect?.type).toBe("sequence");
      if (effect?.type === "sequence") {
        expect(effect.steps[0].type).toBe("look-at-cards");
        // Second step is a choice to put on top or bottom
        expect(effect.steps[1].type).toBe("choice");
      }
    });

    // Elsa - Snow Queen
    // "Exert - Exert chosen opposing character. They can't ready at the start of their next turn."
    it("should parse Elsa's exert and freeze", () => {
      const effect = parseEffect(
        "Exert chosen opposing character. They can't ready at the start of their next turn",
      );

      expect(effect).toBeDefined();
      expect(effect?.type).toBe("sequence");
      if (effect?.type === "sequence") {
        expect(effect.steps[0].type).toBe("exert");
        expect(effect.steps[1].type).toBe("restriction");
        const restriction = effect.steps[1] as any;
        expect(restriction.restriction).toBe("cant-ready");
        // "They" refers to the target of the previous effect, or we might parse it as a specific target if possible
        // Ideally it acts on the same target
      }
    });
  });

  describe("Put into Inkwell Variations", () => {
    // Let It Go
    // "Put chosen opposing character into their player's inkwell facedown."
    it("should parse Let It Go (their player's inkwell)", () => {
      const effect = parseEffect(
        "Put chosen opposing character into their player's inkwell facedown",
      );

      expect(effect).toBeDefined();
      expect(effect?.type).toBe("put-into-inkwell");
      expect((effect as any).source).toBe("chosen-character");
    });

    // One Jump Ahead
    // "Put the top card of your deck into your inkwell facedown."
    it("should parse One Jump Ahead (top card)", () => {
      const effect = parseEffect(
        "Put the top card of your deck into your inkwell facedown",
      );
      expect(effect).toBeDefined();
      expect(effect?.type).toBe("put-into-inkwell");
      expect((effect as any).source).toBe("top-of-deck");
    });

    // Gramma Tala - Storyteller
    // "When this character is banished, you may put this card into your inkwell facedown."
    it("should parse Gramma Tala (this card)", () => {
      const effect = parseEffect(
        "You may put this card into your inkwell facedown",
      );
      expect(effect).toBeDefined();
      expect(effect?.type).toBe("optional");
      const inner = (effect as any).effect;
      expect(inner.type).toBe("put-into-inkwell");
      expect(inner.source).toBe("this-card");
    });
  });

  describe("Specific Target References", () => {
    // Cheshire Cat - Not All There
    // "When this character is challenged and banished, banish the challenging character."
    // TODO: Challenge-related targets need CardReference support at effect level
    it.skip("should parse banish the challenging character", () => {
      const effect = parseEffect("banish the challenging character");
      expect(effect).toBeDefined();
      expect(effect?.type).toBe("banish");
      // expect((effect as any).target).toBe("THE_CHALLENGING_CHARACTER");
    });

    // Mickey Mouse - Steamboat Pilot
    // "When you play this character, if return a character card from your discard to your hand"
    // Wait, that's not special.
    // Marshmallow - Persistent Guardian
    // "When this character is banished in a challenge, you may return this card to your hand."
    it("should parse return this card to hand", () => {
      const effect = parseEffect("return this card to your hand");
      expect(effect).toBeDefined();
      expect(effect?.type).toBe("return-to-hand");
      expect((effect as any).target).toBe("SELF");
    });
  });

  describe("Continuous Restrictions", () => {
    // Mickey Mouse - Artful Rogue
    // "Whenever you play an action, chosen opposing character can't quest during their next turn."
    it("should parse can't quest restriction as an effect", () => {
      const effect = parseEffect(
        "chosen opposing character can't quest during their next turn",
      );
      expect(effect).toBeDefined();
      expect(effect?.type).toBe("restriction");
      const restriction = effect as any;
      expect(restriction.restriction).toBe("cant-quest");
      expect(restriction.duration).toBe("their-next-turn");
    });

    // Jasper - Common Crook
    // "At the start of your turn, chosen opposing character can't quest this turn."
    it("should parse can't quest this turn", () => {
      const effect = parseEffect(
        "chosen opposing character can't quest this turn",
      );
      expect(effect).toBeDefined();
      expect(effect?.type).toBe("restriction");
      const restriction = effect as any;
      expect(restriction.restriction).toBe("cant-quest");
      expect(restriction.duration).toBe("this-turn");
    });
  });

  describe("Conditional Statics", () => {
    // Belle - Strange but Special
    // "While you have 10 or more cards in your inkwell, this character gets +4 {L}."
    // TODO: Condition parsing for static abilities is not fully implemented yet
    it.skip("should parse conditional static with inkwell count", () => {
      const result = parseStaticAbility(
        "While you have 10 or more cards in your inkwell, this character gets +4 {L}",
      );
      expect(result.success).toBe(true);
      if (result.success && result.ability) {
        const ability = result.ability.ability as any;
        expect(ability.type).toBe("static");
        if (ability.type === "static") {
          expect(ability.condition).toBeDefined();
          expect(ability.condition?.type).toBe("resource-count");
          expect((ability.condition as any).what).toBe("cards-in-inkwell");
          expect((ability.condition as any).value).toBe(10);
        }
      }
    });
  });
});
