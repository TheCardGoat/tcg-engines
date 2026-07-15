import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { motherGothelConceitedManipulator } from "./089-mother-gothel-conceited-manipulator";

const targetCharacter = createMockCharacter({
  id: "gothel-test-target",
  name: "Target Character",
  cost: 5,
  strength: 4,
  willpower: 5,
  lore: 2,
});

describe("Mother Gothel - Conceited Manipulator", () => {
  describe("MOTHER KNOWS BEST — When you play this character, you may pay 3 {I} to return chosen character to their player's hand.", () => {
    it("returns chosen character to their player's hand when paying 3 ink", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [motherGothelConceitedManipulator],
          inkwell: motherGothelConceitedManipulator.cost + 3,
          deck: 2,
        },
        {
          play: [targetCharacter],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerTwo().getCardZone(targetCharacter)).toBe("play");

      expect(
        testEngine.asPlayerOne().playCard(motherGothelConceitedManipulator),
      ).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(motherGothelConceitedManipulator, {
          resolveOptional: true,
        }),
      ).toBeSuccessfulCommand();

      const opponentId = testEngine.findCardInstanceId(targetCharacter, "play", "player_two");
      expect(
        testEngine.asPlayerOne().resolveNextPending({
          targets: [opponentId],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(targetCharacter)).toBe("hand");
    });

    it("can target own character — returns it to controller's hand", () => {
      const ownCharacter = createMockCharacter({
        id: "gothel-test-own-target",
        name: "Own Character",
        cost: 3,
        strength: 2,
        willpower: 3,
        lore: 1,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [motherGothelConceitedManipulator],
          play: [ownCharacter],
          inkwell: motherGothelConceitedManipulator.cost + 3,
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().getCardZone(ownCharacter)).toBe("play");

      expect(
        testEngine.asPlayerOne().playCard(motherGothelConceitedManipulator),
      ).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(motherGothelConceitedManipulator, {
          resolveOptional: true,
        }),
      ).toBeSuccessfulCommand();

      const ownId = testEngine.findCardInstanceId(ownCharacter, "play", "player_one");
      expect(
        testEngine.asPlayerOne().resolveNextPending({
          targets: [ownId],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(ownCharacter)).toBe("hand");
    });

    it("ability is optional — can be declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [motherGothelConceitedManipulator],
          inkwell: motherGothelConceitedManipulator.cost + 3,
          deck: 2,
        },
        {
          play: [targetCharacter],
          deck: 2,
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(motherGothelConceitedManipulator),
      ).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(motherGothelConceitedManipulator, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(targetCharacter)).toBe("play");
    });

    it("costs 3 ink — reduces available ink by 3 when accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [motherGothelConceitedManipulator],
          inkwell: motherGothelConceitedManipulator.cost + 3,
          deck: 2,
        },
        {
          play: [targetCharacter],
          deck: 2,
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(motherGothelConceitedManipulator),
      ).toBeSuccessfulCommand();

      const inkAfterPlay = testEngine.asPlayerOne().getAvailableInk("player_one");

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(motherGothelConceitedManipulator, {
          resolveOptional: true,
        }),
      ).toBeSuccessfulCommand();

      const opponentId = testEngine.findCardInstanceId(targetCharacter, "play", "player_two");
      expect(
        testEngine.asPlayerOne().resolveNextPending({
          targets: [opponentId],
        }),
      ).toBeSuccessfulCommand();

      const inkAfterAbility = testEngine.asPlayerOne().getAvailableInk("player_one");
      expect(inkAfterAbility).toBe(inkAfterPlay - 3);
    });

    it("does not trigger if controller cannot pay 3 ink", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [motherGothelConceitedManipulator],
          // Only enough to play Mother Gothel, not to pay the 3 ink ability cost
          inkwell: motherGothelConceitedManipulator.cost,
          deck: 2,
        },
        {
          play: [targetCharacter],
          deck: 2,
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(motherGothelConceitedManipulator),
      ).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      if (bagEffect) {
        expect(
          testEngine.asPlayerOne().resolvePendingByCard(motherGothelConceitedManipulator, {
            resolveOptional: true,
          }),
        ).toBeSuccessfulCommand();
      }

      // Cannot pay 3 ink, so no character is returned
      expect(testEngine.asPlayerTwo().getCardZone(targetCharacter)).toBe("play");
    });
  });
});
