import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { almaMadrigalHeartOfTheFamily } from "./045-alma-madrigal-heart-of-the-family";

const friendlyCharacter = createMockCharacter({
  id: "alma-test-friendly",
  name: "Friendly Character",
  cost: 2,
  strength: 2,
  willpower: 5,
  lore: 1,
});

const opposingCharacter = createMockCharacter({
  id: "alma-test-opposing",
  name: "Opposing Character",
  cost: 3,
  strength: 3,
  willpower: 6,
  lore: 1,
});

describe("Alma Madrigal - Heart of the Family", () => {
  describe("FIND A WAY - Whenever this character quests, move up to 1 damage from chosen character of yours to chosen opposing character.", () => {
    it("moves 1 damage from a friendly character to an opposing character when questing", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: almaMadrigalHeartOfTheFamily, isDrying: false },
            { card: friendlyCharacter, damage: 2 },
          ],
          deck: 5,
        },
        {
          play: [opposingCharacter],
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().quest(almaMadrigalHeartOfTheFamily)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(almaMadrigalHeartOfTheFamily, {
          targets: [friendlyCharacter, opposingCharacter],
        }),
      ).toBeSuccessfulCommand();

      // 1 damage moved from friendly to opposing
      expect(testEngine.asPlayerOne().getDamage(friendlyCharacter)).toBe(1);
      expect(testEngine.asPlayerTwo().getDamage(opposingCharacter)).toBe(1);
    });

    it("moves 1 damage even if friendly source has only 1 damage", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: almaMadrigalHeartOfTheFamily, isDrying: false },
            { card: friendlyCharacter, damage: 1 },
          ],
          deck: 5,
        },
        {
          play: [opposingCharacter],
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().quest(almaMadrigalHeartOfTheFamily)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(almaMadrigalHeartOfTheFamily, {
          targets: [friendlyCharacter, opposingCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getDamage(friendlyCharacter)).toBe(0);
      expect(testEngine.asPlayerTwo().getDamage(opposingCharacter)).toBe(1);
    });

    it("moves damage using the slotted move-damage API (from/to)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: almaMadrigalHeartOfTheFamily, isDrying: false },
            { card: friendlyCharacter, damage: 2 },
          ],
          deck: 5,
        },
        {
          play: [opposingCharacter],
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().quest(almaMadrigalHeartOfTheFamily)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // With the slotted API the order of the ids in the move payload is no
      // longer load-bearing: `from` / `to` are explicit, so the UI can submit
      // them in whichever order the player picked.
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(almaMadrigalHeartOfTheFamily, {
          targets: {
            kind: "move-damage",
            from: [friendlyCharacter],
            to: [opposingCharacter],
          },
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getDamage(friendlyCharacter)).toBe(1);
      expect(testEngine.asPlayerTwo().getDamage(opposingCharacter)).toBe(1);
    });

    it("triggers the ability whenever this character quests", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: almaMadrigalHeartOfTheFamily, isDrying: false },
            { card: friendlyCharacter, damage: 2 },
          ],
          deck: 5,
        },
        {
          play: [opposingCharacter],
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

      expect(testEngine.asPlayerOne().quest(almaMadrigalHeartOfTheFamily)).toBeSuccessfulCommand();

      // The triggered ability should be added to the bag on quest
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    });
  });
});
