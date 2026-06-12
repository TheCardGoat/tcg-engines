import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { luisaMadrigalNoPressure } from "./151-luisa-madrigal-no-pressure";

const friendlyCharacter = createMockCharacter({
  id: "luisa-np-friendly",
  name: "Friendly Character",
  cost: 2,
  strength: 2,
  willpower: 5,
  lore: 1,
});

const opposingCharacter = createMockCharacter({
  id: "luisa-np-opposing",
  name: "Opposing Character",
  cost: 3,
  strength: 3,
  willpower: 6,
  lore: 1,
});

describe("Luisa Madrigal - No Pressure", () => {
  describe("SHOULDER THE BURDEN - Whenever this character quests, you may move up to 3 damage from chosen character to this character.", () => {
    it("moves up to 3 damage from a chosen friendly character to Luisa on quest", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: luisaMadrigalNoPressure, isDrying: false },
            { card: friendlyCharacter, damage: 3 },
          ],
          deck: 5,
        },
        {
          play: [opposingCharacter],
          deck: 5,
        },
      );

      const friendlyId = testEngine.findCardInstanceId(friendlyCharacter, "play");

      expect(testEngine.asPlayerOne().quest(luisaMadrigalNoPressure)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(luisaMadrigalNoPressure, {
          resolveOptional: true,
          targets: [friendlyId],
          amount: 3,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getDamage(friendlyCharacter)).toBe(0);
      expect(testEngine.asPlayerOne().getDamage(luisaMadrigalNoPressure)).toBe(3);
    });

    it("can move damage from a chosen opposing character to Luisa", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: luisaMadrigalNoPressure, isDrying: false }],
          deck: 5,
        },
        {
          play: [{ card: opposingCharacter, damage: 3 }],
          deck: 5,
        },
      );

      const opposingId = testEngine.findCardInstanceId(opposingCharacter, "play", "player_two");

      expect(testEngine.asPlayerOne().quest(luisaMadrigalNoPressure)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(luisaMadrigalNoPressure, {
          resolveOptional: true,
          targets: [opposingId],
          amount: 3,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getDamage(opposingCharacter)).toBe(0);
      expect(testEngine.asPlayerOne().getDamage(luisaMadrigalNoPressure)).toBe(3);
    });
  });
});
