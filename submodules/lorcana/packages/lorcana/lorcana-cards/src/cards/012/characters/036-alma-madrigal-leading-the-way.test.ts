import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { almaMadrigalLeadingTheWay } from "./036-alma-madrigal-leading-the-way";

const madrigalAlly = createMockCharacter({
  id: "alma-madrigal-ally",
  name: "Madrigal Ally",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  classifications: ["Storyborn", "Madrigal"],
});

const nonMadrigalAlly = createMockCharacter({
  id: "alma-non-madrigal-ally",
  name: "Non-Madrigal Ally",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  classifications: ["Storyborn", "Hero"],
});

const opposingCharacter = createMockCharacter({
  id: "alma-opposing-character",
  name: "Opposing Character",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
});

describe("Alma Madrigal - Leading the Way", () => {
  describe("PROTECTING THE FAMILY - When you play this character, if you have another Madrigal character in play, you may exert chosen opposing character.", () => {
    it("exerts chosen opposing character when another Madrigal is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [almaMadrigalLeadingTheWay],
          play: [madrigalAlly],
          inkwell: almaMadrigalLeadingTheWay.cost,
        },
        {
          play: [opposingCharacter],
        },
      );

      expect(testEngine.isExerted(opposingCharacter)).toBe(false);

      expect(testEngine.asPlayerOne().playCard(almaMadrigalLeadingTheWay)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(almaMadrigalLeadingTheWay, {
          resolveOptional: true,
          targets: [opposingCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.isExerted(opposingCharacter)).toBe(true);
    });

    it("does not trigger when no other Madrigal character is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [almaMadrigalLeadingTheWay],
          play: [nonMadrigalAlly],
          inkwell: almaMadrigalLeadingTheWay.cost,
        },
        {
          play: [opposingCharacter],
        },
      );

      expect(testEngine.asPlayerOne().playCard(almaMadrigalLeadingTheWay)).toBeSuccessfulCommand();

      // Condition fails at resolution; if queued, it resolves without effect.
      if (testEngine.asPlayerOne().getBagCount() > 0) {
        expect(
          testEngine.asPlayerOne().resolvePendingByCard(almaMadrigalLeadingTheWay),
        ).toBeSuccessfulCommand();
      }

      expect(testEngine.isExerted(opposingCharacter)).toBe(false);
    });

    it("can decline the optional trigger", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [almaMadrigalLeadingTheWay],
          play: [madrigalAlly],
          inkwell: almaMadrigalLeadingTheWay.cost,
        },
        {
          play: [opposingCharacter],
        },
      );

      expect(testEngine.asPlayerOne().playCard(almaMadrigalLeadingTheWay)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(almaMadrigalLeadingTheWay, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.isExerted(opposingCharacter)).toBe(false);
    });
  });
});
