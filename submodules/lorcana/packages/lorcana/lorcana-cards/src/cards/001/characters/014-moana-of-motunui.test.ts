import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { moanaOfMotunui } from "./014-moana-of-motunui";

const princessAlly = createMockCharacter({
  id: "moana-test-princess-ally",
  name: "Princess Ally",
  cost: 2,
  willpower: 3,
  lore: 1,
  classifications: ["Storyborn", "Princess"],
});

const anotherPrincessAlly = createMockCharacter({
  id: "moana-test-another-princess-ally",
  name: "Another Princess Ally",
  cost: 2,
  willpower: 3,
  lore: 1,
  classifications: ["Storyborn", "Princess"],
});

const nonPrincessAlly = createMockCharacter({
  id: "moana-test-non-princess-ally",
  name: "Non Princess Ally",
  cost: 2,
  willpower: 3,
  lore: 1,
  classifications: ["Storyborn", "Hero"],
});

describe("Moana - Of Motunui", () => {
  describe("WE CAN FIX IT - Whenever this character quests, you may ready your other Princess characters. They can't quest for the rest of this turn.", () => {
    it("readies all other exerted Princess characters when questing and ability is accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        deck: 2,
        play: [
          { card: moanaOfMotunui, isDrying: false },
          { card: princessAlly, isDrying: false, exerted: true },
          { card: anotherPrincessAlly, isDrying: false, exerted: true },
        ],
      });

      expect(testEngine.asPlayerOne().quest(moanaOfMotunui)).toBeSuccessfulCommand();

      // Optional triggered ability - accept it
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(moanaOfMotunui, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // Both princess allies should be readied
      expect(testEngine.asPlayerOne().isExerted(princessAlly)).toBe(false);
      expect(testEngine.asPlayerOne().isExerted(anotherPrincessAlly)).toBe(false);

      // Moana herself should be exerted (she just quested)
      expect(testEngine.asPlayerOne().isExerted(moanaOfMotunui)).toBe(true);
    });

    it("does not ready non-Princess characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        deck: 2,
        play: [
          { card: moanaOfMotunui, isDrying: false },
          { card: princessAlly, isDrying: false, exerted: true },
          { card: nonPrincessAlly, isDrying: false, exerted: true },
        ],
      });

      expect(testEngine.asPlayerOne().quest(moanaOfMotunui)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(moanaOfMotunui, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // Princess ally should be readied
      expect(testEngine.asPlayerOne().isExerted(princessAlly)).toBe(false);

      // Non-princess ally should remain exerted
      expect(testEngine.asPlayerOne().isExerted(nonPrincessAlly)).toBe(true);
    });

    it("readied princesses cannot quest for the rest of the turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        deck: 2,
        play: [
          { card: moanaOfMotunui, isDrying: false },
          { card: princessAlly, isDrying: false, exerted: true },
        ],
      });

      expect(testEngine.asPlayerOne().quest(moanaOfMotunui)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(moanaOfMotunui, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // Princess ally should be readied
      expect(testEngine.asPlayerOne().isExerted(princessAlly)).toBe(false);

      // But she should not be able to quest this turn
      const questResult = testEngine.asPlayerOne().quest(princessAlly);
      expect(questResult.success).toBe(false);
    });

    it("optional — no effect when declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        deck: 2,
        play: [
          { card: moanaOfMotunui, isDrying: false },
          { card: princessAlly, isDrying: false, exerted: true },
        ],
      });

      expect(testEngine.asPlayerOne().quest(moanaOfMotunui)).toBeSuccessfulCommand();

      // Decline the optional ability
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(moanaOfMotunui, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // Princess ally should remain exerted
      expect(testEngine.asPlayerOne().isExerted(princessAlly)).toBe(true);
    });
  });
});
