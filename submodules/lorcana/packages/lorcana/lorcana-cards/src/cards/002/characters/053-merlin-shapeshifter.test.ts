import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { merlinShapeshifter } from "./053-merlin-shapeshifter";
import { madamMimFox } from "./046-madam-mim-fox";
import { createMockCharacter } from "@tcg/lorcana-engine/testing";

const returnFromDiscardCharacter = createMockCharacter({
  id: "merlin-return-from-discard",
  name: "Return From Discard",
  cost: 3,
  strength: 2,
  willpower: 3,
  abilities: [
    {
      id: "merlin-return-from-discard-ability",
      type: "triggered",
      name: "RETURN FROM DISCARD",
      text: "When you play this character, you may return a character from your discard to your hand.",
      trigger: { event: "play", on: "SELF", timing: "when" },
      effect: {
        chooser: "CONTROLLER" as const,
        effect: {
          target: "CONTROLLER" as const,
          type: "return-from-discard" as const,
          cardType: "character" as const,
        },
        type: "optional" as const,
      },
    },
  ],
});

const otherCharacter = createMockCharacter({
  id: "test_other_char",
  name: "Test Character",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
});

describe("Merlin - Shapeshifter", () => {
  describe("BATTLE OF WITS", () => {
    it("should have the correct trigger event and subject", () => {
      const abilities = merlinShapeshifter.abilities ?? [];
      const battleOfWits = abilities.find(
        (a) => a.type === "triggered" && "name" in a && a.name === "BATTLE OF WITS",
      );

      expect(battleOfWits).toBeDefined();
      expect(battleOfWits?.type).toBe("triggered");

      if (battleOfWits?.type === "triggered") {
        expect(battleOfWits.trigger.event).toBe("return-to-hand");
        expect(battleOfWits.trigger.on).toBe("YOUR_OTHER_CHARACTERS");
      }
    });

    it("should have a modify-stat lore +1 effect targeting SELF for this-turn duration", () => {
      const abilities = merlinShapeshifter.abilities ?? [];
      const battleOfWits = abilities.find(
        (a) => a.type === "triggered" && "name" in a && a.name === "BATTLE OF WITS",
      );

      expect(battleOfWits?.type).toBe("triggered");

      if (battleOfWits?.type === "triggered") {
        const effect = battleOfWits.effect;
        expect(effect.type).toBe("modify-stat");

        if (effect.type === "modify-stat") {
          expect(effect.stat).toBe("lore");
          expect(effect.modifier).toBe(1);
          expect(effect.target).toBe("SELF");
          expect(effect.duration).toBe("this-turn");
        }
      }
    });

    it("gains +1 lore when another character is returned to hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: madamMimFox.cost,
          hand: [madamMimFox],
          play: [merlinShapeshifter, otherCharacter],
        },
        { deck: 1 },
      );

      const loreBefore = testEngine.asPlayerOne().getCard(merlinShapeshifter).lore;
      expect(loreBefore).toBe(merlinShapeshifter.lore);

      expect(testEngine.asPlayerOne().playCard(madamMimFox)).toBeSuccessfulCommand();

      testEngine.asPlayerOne().resolvePendingByCard(madamMimFox);
      expect(
        testEngine.asPlayerOne().resolveNextPending({ choiceIndex: 1, targets: [otherCharacter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(otherCharacter)).toBe("hand");

      const loreAfter = testEngine.asPlayerOne().getCard(merlinShapeshifter).lore;
      expect(loreAfter).toBe(merlinShapeshifter.lore + 1);
    });

    it("effect lasts until end of turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: madamMimFox.cost,
          hand: [madamMimFox],
          play: [merlinShapeshifter, otherCharacter],
        },
        { deck: 1 },
      );

      expect(testEngine.asPlayerOne().playCard(madamMimFox)).toBeSuccessfulCommand();

      testEngine.asPlayerOne().resolvePendingByCard(madamMimFox);
      expect(
        testEngine.asPlayerOne().resolveNextPending({ choiceIndex: 1, targets: [otherCharacter] }),
      ).toBeSuccessfulCommand();

      const loreDuringTurn = testEngine.asPlayerOne().getCard(merlinShapeshifter).lore;
      expect(loreDuringTurn).toBe(merlinShapeshifter.lore + 1);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      const loreAfterTurn = testEngine.asPlayerOne().getCard(merlinShapeshifter).lore;
      expect(loreAfterTurn).toBe(merlinShapeshifter.lore);
    });

    it("does NOT gain +1 lore when another character is returned from discard to hand (not from play)", () => {
      const characterInDiscard = createMockCharacter({
        id: "test_char_in_discard",
        name: "Character In Discard",
        cost: 2,
        strength: 2,
        willpower: 2,
        lore: 1,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: returnFromDiscardCharacter.cost,
          hand: [returnFromDiscardCharacter],
          play: [merlinShapeshifter],
          discard: [{ card: characterInDiscard }],
          deck: 5,
        },
        { deck: 1 },
      );

      const loreBefore = testEngine.asPlayerOne().getCard(merlinShapeshifter).lore;
      expect(loreBefore).toBe(merlinShapeshifter.lore);

      expect(testEngine.asPlayerOne().playCard(returnFromDiscardCharacter)).toBeSuccessfulCommand();

      // Resolve the return-from-discard ability
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(returnFromDiscardCharacter, {
          resolveOptional: true,
          targets: [characterInDiscard],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(characterInDiscard)).toBe("hand");

      // Merlin should NOT gain lore — the character came from discard, not from play
      const loreAfter = testEngine.asPlayerOne().getCard(merlinShapeshifter).lore;
      expect(loreAfter).toBe(merlinShapeshifter.lore);
    });

    it("accumulates bonuses when multiple characters are returned to hand", () => {
      const otherCharacter2 = createMockCharacter({
        id: "test_other_char2",
        name: "Test Character 2",
        cost: 2,
        strength: 2,
        willpower: 2,
        lore: 1,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: madamMimFox.cost * 2,
          hand: [madamMimFox],
          play: [merlinShapeshifter, otherCharacter, otherCharacter2],
        },
        { deck: 10 },
      );

      expect(testEngine.asPlayerOne().playCard(madamMimFox)).toBeSuccessfulCommand();

      testEngine.asPlayerOne().resolvePendingByCard(madamMimFox);
      expect(
        testEngine.asPlayerOne().resolveNextPending({ choiceIndex: 1, targets: [otherCharacter] }),
      ).toBeSuccessfulCommand();

      const loreAfterFirst = testEngine.asPlayerOne().getCard(merlinShapeshifter).lore;
      expect(loreAfterFirst).toBe(merlinShapeshifter.lore + 1);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCard(otherCharacter).zone).toBe("hand");
      expect(testEngine.asPlayerOne().playCard(otherCharacter)).toBeSuccessfulCommand();

      const otherCharacter3 = createMockCharacter({
        id: "test_other_char3",
        name: "Test Character 3",
        cost: 2,
        strength: 2,
        willpower: 2,
        lore: 1,
      });

      const createReturnCard = (id: string) =>
        createMockCharacter({
          id,
          name: "Return Card",
          cost: 3,
          strength: 2,
          willpower: 2,
          lore: 1,
          abilities: [
            {
              id: "return-ability",
              type: "triggered",
              name: "Return Ability",
              text: "When you play this character, return another chosen character of yours to your hand.",
              trigger: { event: "play", on: "SELF", timing: "when" },
              effect: {
                type: "return-to-hand",
                target: {
                  cardTypes: ["character"],
                  count: 1,
                  excludeSelf: true,
                  owner: "you",
                  selector: "chosen",
                  zones: ["play"],
                },
              },
            },
          ],
        });

      const returnCard1 = createReturnCard("return_card_1");
      const returnCard2 = createReturnCard("return_card_2");

      const testEngine2 = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: 10,
          hand: [returnCard1, returnCard2],
          play: [merlinShapeshifter, otherCharacter, otherCharacter3],
        },
        { deck: 10 },
      );

      expect(testEngine2.asPlayerOne().playCard(returnCard1)).toBeSuccessfulCommand();

      const bagEffects1 = testEngine2.asPlayerOne().getBagEffects();
      expect(
        testEngine2.asPlayerOne().resolvePendingByCard(returnCard1, { targets: [otherCharacter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine2.asPlayerOne().getCardZone(otherCharacter)).toBe("hand");
      expect(testEngine2.asPlayerOne().getCard(merlinShapeshifter).lore).toBe(
        merlinShapeshifter.lore + 1,
      );

      expect(testEngine2.asPlayerOne().playCard(returnCard2)).toBeSuccessfulCommand();

      const bagEffects2 = testEngine2.asPlayerOne().getBagEffects();
      expect(
        testEngine2.asPlayerOne().resolvePendingByCard(returnCard2, { targets: [otherCharacter3] }),
      ).toBeSuccessfulCommand();

      expect(testEngine2.asPlayerOne().getCardZone(otherCharacter3)).toBe("hand");
      expect(testEngine2.asPlayerOne().getCard(merlinShapeshifter).lore).toBe(
        merlinShapeshifter.lore + 2,
      );
    });
  });
});
