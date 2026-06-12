import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { mrSmeeCaptainOfTheJollyRoger } from "./176-mr-smee-captain-of-the-jolly-roger";

const pirateCharacter = createMockCharacter({
  id: "ms-cjr-pirate",
  name: "Pirate Crew",
  cost: 1,
  strength: 1,
  willpower: 1,
  classifications: ["Pirate"],
});

const targetCharacter = createMockCharacter({
  id: "ms-cjr-target",
  name: "Target Character",
  cost: 3,
  strength: 3,
  willpower: 6,
});

describe("Mr. Smee - Captain of the Jolly Roger", () => {
  it("has Shift keyword", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [mrSmeeCaptainOfTheJollyRoger],
    });

    expect(testEngine.asPlayerOne().hasKeyword(mrSmeeCaptainOfTheJollyRoger, "Shift")).toBe(true);
  });

  describe("RAISE THE COLORS - When you play this character, you may deal damage to chosen character equal to the number of your other Pirate characters in play.", () => {
    it("deals damage equal to the number of other Pirate characters in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [mrSmeeCaptainOfTheJollyRoger],
          play: [pirateCharacter, pirateCharacter, targetCharacter],
          inkwell: mrSmeeCaptainOfTheJollyRoger.cost,
          deck: 3,
        },
        {
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(mrSmeeCaptainOfTheJollyRoger),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolveOnlyBag({ targets: [targetCharacter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getDamage(targetCharacter)).toBe(2);
    });

    it("deals 1 damage with 1 other Pirate in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [mrSmeeCaptainOfTheJollyRoger],
          play: [pirateCharacter, targetCharacter],
          inkwell: mrSmeeCaptainOfTheJollyRoger.cost,
          deck: 3,
        },
        {
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(mrSmeeCaptainOfTheJollyRoger),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolveOnlyBag({ targets: [targetCharacter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getDamage(targetCharacter)).toBe(1);
    });

    it("deals 0 damage with no other Pirate characters in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [mrSmeeCaptainOfTheJollyRoger],
          play: [targetCharacter],
          inkwell: mrSmeeCaptainOfTheJollyRoger.cost,
          deck: 3,
        },
        {
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(mrSmeeCaptainOfTheJollyRoger),
      ).toBeSuccessfulCommand();

      const bagCount = testEngine.asPlayerOne().getBagCount();
      if (bagCount > 0) {
        expect(
          testEngine.asPlayerOne().resolveOnlyBag({ targets: [targetCharacter] }),
        ).toBeSuccessfulCommand();
      }

      expect(testEngine.asPlayerOne().getDamage(targetCharacter)).toBe(0);
    });
  });
});
