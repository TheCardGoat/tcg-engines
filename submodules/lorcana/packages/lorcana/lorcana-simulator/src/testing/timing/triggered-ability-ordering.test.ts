import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import {
  heiheiBoatSnack,
  liloMakingAWish,
  starkeyHooksHenchman,
  tinkerBellGiantFairy,
} from "@tcg/lorcana-cards/cards/001";
import { mushuMajesticDragon } from "@tcg/lorcana-cards/cards/007";

const weakDefender = createMockCharacter({
  id: "ordering-weak-defender",
  name: "Weak Defender",
  cost: 1,
  strength: 1,
  willpower: 1,
});

describe("Timing: Triggered Ability Ordering", () => {
  describe("Multiple simultaneous triggers from different cards", () => {
    it("should resolve same-event triggers from different cards", () => {
      // Tinker Bell (Puny Pirate) and Mushu (Guardian of Lost Souls) both trigger
      // when a character is banished in a challenge
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [tinkerBellGiantFairy, mushuMajesticDragon],
          lore: 0,
        },
        {
          play: [{ card: weakDefender, exerted: true }, liloMakingAWish],
        },
      );

      expect(testEngine.getLore(PLAYER_ONE)).toBe(0);

      // Tinker Bell banishes weak defender in a challenge
      expect(
        testEngine.asPlayerOne().challenge(tinkerBellGiantFairy, weakDefender),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(weakDefender)).toBe("discard");

      // Both Tinker Bell's and Mushu's triggers should fire
      const bagCount = testEngine.asPlayerOne().getBagCount();
      expect(bagCount).toBeGreaterThanOrEqual(1);

      // Resolve all bag effects (some may need targets, others auto-resolve)
      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      for (const bag of bagEffects) {
        testEngine.asPlayerOne().resolvePendingByCard(bag.sourceId, { resolveOptional: false });
      }

      // Mushu's lore gain should have happened
      expect(testEngine.getLore(PLAYER_ONE)).toBe(2);
    });
  });

  describe("Optional triggers can be declined", () => {
    it("should allow optional triggers to be declined without affecting other triggers", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [tinkerBellGiantFairy, mushuMajesticDragon],
          lore: 0,
        },
        {
          play: [{ card: weakDefender, exerted: true }, liloMakingAWish],
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(tinkerBellGiantFairy, weakDefender),
      ).toBeSuccessfulCommand();

      // Multiple bag effects pending. Resolve all of them.
      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      for (const bag of bagEffects) {
        testEngine.asPlayerOne().resolvePendingByCard(bag.sourceId, { resolveOptional: false });
      }

      // Mushu's lore gain should have happened independently (auto-resolved since it's mandatory)
      expect(testEngine.getLore(PLAYER_ONE)).toBe(2);
    });
  });

  describe("Nested trigger: trigger inside a trigger resolution", () => {
    it("should queue nested triggers after the current batch", () => {
      // When Tinker Bell banishes in challenge, Puny Pirate fires.
      // If the Puny Pirate damage banishes ANOTHER character, that banish
      // should NOT re-trigger Puny Pirate (not a challenge banish)
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [tinkerBellGiantFairy],
        },
        {
          play: [
            { card: heiheiBoatSnack, exerted: true },
            liloMakingAWish, // 1 wp, will be banished by Puny Pirate's 2 damage
          ],
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(tinkerBellGiantFairy, heiheiBoatSnack),
      ).toBeSuccessfulCommand();

      // Puny Pirate triggers (deal 2 damage to chosen opp character)
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(testEngine.asPlayerOne().getBagEffects()[0]!.sourceId, {
            targets: [liloMakingAWish],
          }),
      ).toBeSuccessfulCommand();

      // Lilo should be banished by the 2 damage
      expect(testEngine.asPlayerOne().getCardZone(liloMakingAWish)).toBe("discard");

      // Puny Pirate should NOT re-trigger (Lilo was banished by effect, not challenge)
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });
  });
});
