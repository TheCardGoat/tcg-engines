import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
import { roquefortLockExpert } from "./172-roquefort-lock-expert";
import { atlanteanCrystal } from "../items/180-atlantean-crystal";

describe("Roquefort - Lock Expert", () => {
  describe("SAFEKEEPING - Whenever this character quests, you may put chosen item into its player's inkwell facedown and exerted.", () => {
    it("puts a chosen item into its player's inkwell when the ability resolves", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: roquefortLockExpert, isDrying: false }, atlanteanCrystal],
        },
        {
          deck: 1,
        },
      );

      const itemId = testEngine.findCardInstanceId(atlanteanCrystal, "play", "player_one");

      expect(testEngine.asPlayerOne().quest(roquefortLockExpert)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(roquefortLockExpert, {
          resolveOptional: true,
          targets: [itemId],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(itemId)).toBe("inkwell");
      expect(testEngine.asServer().getCard(itemId)).toEqual(
        expect.objectContaining({ zone: "inkwell", exerted: true }),
      );
    });

    it("puts opponent's item into opponent's inkwell", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: roquefortLockExpert, isDrying: false }],
        },
        {
          play: [atlanteanCrystal],
          deck: 1,
        },
      );

      const itemId = testEngine.findCardInstanceId(atlanteanCrystal, "play", PLAYER_TWO);

      expect(testEngine.asPlayerOne().quest(roquefortLockExpert)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(roquefortLockExpert, {
          resolveOptional: true,
          targets: [itemId],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(itemId)).toBe("inkwell");
      expect(testEngine.asServer().getCard(itemId)).toEqual(
        expect.objectContaining({ zone: "inkwell", exerted: true }),
      );
    });

    it("does not move the item when the ability is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: roquefortLockExpert, isDrying: false }, atlanteanCrystal],
        },
        {
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().quest(roquefortLockExpert)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(roquefortLockExpert, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getZonesCardCount()).toMatchObject({
        play: 2,
        inkwell: 0,
      });
    });
  });
});
