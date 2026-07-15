import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { camiloMadrigalFamilyCopycat } from "./058-camilo-madrigal-family-copycat";

const otherCharacter = createMockCharacter({
  id: "other-char",
  name: "Other Character",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 3,
});

describe("Camilo Madrigal - Family Copycat", () => {
  describe("IMITATE - Whenever this character quests, you may gain lore equal to the {L} of chosen other character of yours. Return that character to your hand.", () => {
    it("should gain lore equal to the {L} of chosen other character of yours and return that character to hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: camiloMadrigalFamilyCopycat, isDrying: false }, otherCharacter],
        deck: 3,
      });

      expect(testEngine.getLore(PLAYER_ONE)).toBe(0);

      // Quest with Camilo
      expect(testEngine.asPlayerOne().quest(camiloMadrigalFamilyCopycat)).toBeSuccessfulCommand();

      // Resolve the optional triggered ability, choosing the other character
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(camiloMadrigalFamilyCopycat, { targets: [otherCharacter] }),
      ).toBeSuccessfulCommand();

      // Should gain Camilo's own lore (from questing) + other character's lore (from ability)
      expect(testEngine.getLore(PLAYER_ONE)).toBe(
        camiloMadrigalFamilyCopycat.lore + otherCharacter.lore,
      );

      // The other character should be returned to hand
      expect(testEngine.asPlayerOne().getCardZone(otherCharacter)).toBe("hand");
    });

    it("should NOT gain extra lore if there's not another character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: camiloMadrigalFamilyCopycat, isDrying: false }],
        deck: 3,
      });

      expect(testEngine.getLore(PLAYER_ONE)).toBe(0);

      // Quest with Camilo - no other character available
      expect(testEngine.asPlayerOne().quest(camiloMadrigalFamilyCopycat)).toBeSuccessfulCommand();

      // The optional ability bag may still be queued, but resolving should fizzle
      // since there are no valid targets for "another chosen character of yours"
      if (testEngine.asPlayerOne().getBagCount() > 0) {
        testEngine.asPlayerOne().resolvePendingByCard(camiloMadrigalFamilyCopycat);
      }

      // Should only gain Camilo's own lore from questing
      expect(testEngine.getLore(PLAYER_ONE)).toBe(camiloMadrigalFamilyCopycat.lore);
    });

    it("should allow declining the optional ability", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: camiloMadrigalFamilyCopycat, isDrying: false }, otherCharacter],
        deck: 3,
      });

      expect(testEngine.getLore(PLAYER_ONE)).toBe(0);

      // Quest with Camilo
      expect(testEngine.asPlayerOne().quest(camiloMadrigalFamilyCopycat)).toBeSuccessfulCommand();

      // Decline the optional ability
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(camiloMadrigalFamilyCopycat, { resolveOptional: false });

      // Should only gain Camilo's own lore from questing
      expect(testEngine.getLore(PLAYER_ONE)).toBe(camiloMadrigalFamilyCopycat.lore);

      // The other character should still be in play
      expect(testEngine.asPlayerOne().getCardZone(otherCharacter)).toBe("play");
    });
  });
});
