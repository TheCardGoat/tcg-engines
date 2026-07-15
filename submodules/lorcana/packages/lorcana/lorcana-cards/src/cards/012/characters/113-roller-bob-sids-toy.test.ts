import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { rollerBobSidsToy } from "./113-roller-bob-sids-toy";

const discardOne = createMockCharacter({
  id: "roller-bob-discard-1",
  name: "Discard One",
  cost: 1,
  strength: 1,
  willpower: 1,
});

const discardTwo = createMockCharacter({
  id: "roller-bob-discard-2",
  name: "Discard Two",
  cost: 1,
  strength: 1,
  willpower: 1,
});

const opponentCharacter = createMockCharacter({
  id: "roller-bob-opponent",
  name: "Opponent Character",
  cost: 2,
  strength: 2,
  willpower: 3,
});

describe("Roller Bob - Sid's Toy", () => {
  describe("TIME TO MOVE - When you play this character, you may put 2 character cards from your discard on the bottom of your deck to give this character Rush this turn.", () => {
    it("grants Rush this turn when 2 character cards are put on the bottom of the deck", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [rollerBobSidsToy],
          discard: [discardOne, discardTwo],
          inkwell: rollerBobSidsToy.cost,
          deck: 3,
        },
        {
          play: [{ card: opponentCharacter, exerted: true }],
          deck: 3,
        },
      );

      expect(testEngine.asPlayerOne().playCard(rollerBobSidsToy)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(rollerBobSidsToy, {
          targets: [discardOne, discardTwo],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(discardOne)).toBe("deck");
      expect(testEngine.asPlayerOne().getCardZone(discardTwo)).toBe("deck");

      expect(testEngine.asPlayerOne().hasKeyword(rollerBobSidsToy, "Rush")).toBe(true);
      expect(testEngine.asPlayerOne().canChallenge(rollerBobSidsToy, opponentCharacter)).toBe(true);
    });

    it("auto-declines and creates no pending effect when discard has fewer than 2 character cards", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [rollerBobSidsToy],
          discard: [discardOne],
          inkwell: rollerBobSidsToy.cost,
          deck: 3,
        },
        {
          play: [{ card: opponentCharacter, exerted: true }],
          deck: 3,
        },
      );

      expect(testEngine.asPlayerOne().playCard(rollerBobSidsToy)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagEffects()).toHaveLength(0);
      expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(0);

      expect(testEngine.asPlayerOne().hasKeyword(rollerBobSidsToy, "Rush")).toBe(false);
    });

    it("auto-declines and creates no pending effect when discard is empty", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [rollerBobSidsToy],
          discard: [],
          inkwell: rollerBobSidsToy.cost,
          deck: 3,
        },
        {
          play: [{ card: opponentCharacter, exerted: true }],
          deck: 3,
        },
      );

      expect(testEngine.asPlayerOne().playCard(rollerBobSidsToy)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagEffects()).toHaveLength(0);
      expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(0);

      expect(testEngine.asPlayerOne().hasKeyword(rollerBobSidsToy, "Rush")).toBe(false);
    });

    it("does not grant Rush when the optional ability is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [rollerBobSidsToy],
          discard: [discardOne, discardTwo],
          inkwell: rollerBobSidsToy.cost,
          deck: 3,
        },
        {
          play: [{ card: opponentCharacter, exerted: true }],
          deck: 3,
        },
      );

      expect(testEngine.asPlayerOne().playCard(rollerBobSidsToy)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(rollerBobSidsToy, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(discardOne)).toBe("discard");
      expect(testEngine.asPlayerOne().getCardZone(discardTwo)).toBe("discard");

      expect(testEngine.asPlayerOne().hasKeyword(rollerBobSidsToy, "Rush")).toBe(false);
      expect(testEngine.asPlayerOne().canChallenge(rollerBobSidsToy, opponentCharacter)).toBe(
        false,
      );
    });
  });
});
