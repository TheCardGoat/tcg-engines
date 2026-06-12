import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { daleMischievousRanger } from "./018-dale-mischievous-ranger";

const chosenCharacter = createMockCharacter({
  id: "dale-mischievous-ranger-target",
  name: "Chosen Character",
  cost: 3,
  strength: 5,
  willpower: 5,
});

describe("Dale - Mischievous Ranger", () => {
  describe("NUTS ABOUT PRANKS - When you play this character, you may put the top 3 cards of your deck into your discard to give chosen character -3 {S} until the start of your next turn.", () => {
    it("mills 3 cards and gives the chosen character -3 strength until your next turn when accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [daleMischievousRanger],
          inkwell: daleMischievousRanger.cost,
          deck: 3,
        },
        {
          play: [chosenCharacter],
          deck: 3,
        },
      );

      const chosenCharacterId = testEngine.findCardInstanceId(
        chosenCharacter,
        "play",
        "player_two",
      );
      const baseStrength = testEngine.asPlayerTwo().getCardStrength(chosenCharacter);

      expect(testEngine.asPlayerOne().playCard(daleMischievousRanger)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(daleMischievousRanger, { resolveOptional: true }),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [chosenCharacterId] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getZonesCardCount()).toMatchObject({
        deck: 0,
        discard: 3,
        hand: 0,
        play: 1,
      });
      expect(testEngine.asPlayerTwo().getCardStrength(chosenCharacter)).toBe(baseStrength - 3);
    });

    it("does nothing when the optional ability is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [daleMischievousRanger],
          inkwell: daleMischievousRanger.cost,
          deck: 3,
        },
        {
          play: [chosenCharacter],
          deck: 3,
        },
      );

      const baseStrength = testEngine.asPlayerTwo().getCardStrength(chosenCharacter);

      expect(testEngine.asPlayerOne().playCard(daleMischievousRanger)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(daleMischievousRanger, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getZonesCardCount()).toMatchObject({
        deck: 3,
        discard: 0,
        hand: 0,
        play: 1,
      });
      expect(testEngine.asPlayerTwo().getCardStrength(chosenCharacter)).toBe(baseStrength);
    });
  });
});
