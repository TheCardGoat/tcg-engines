import { describe, expect, it } from "bun:test";
import {
  goofyKnightForADay,
  merlinCrab,
  yzmaWithoutBeautySleep,
} from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Merlin - Crab", () => {
  describe("**READY OR NOT!** When you play this character and when he leaves play, chosen character gains **Challenger** +3 this turn. _(They get +3 {S} while challenging.)_", () => {
    it("When you play", () => {
      const testStore = new TestStore({
        inkwell: merlinCrab.cost,
        hand: [merlinCrab],
        play: [yzmaWithoutBeautySleep],
      });

      const cardUnderTest = testStore.getByZoneAndId("hand", merlinCrab.id);
      const target = testStore.getByZoneAndId(
        "play",
        yzmaWithoutBeautySleep.id,
      );

      expect(target.hasChallenger).toEqual(false);

      cardUnderTest.playFromHand();
      testStore.resolveTopOfStack({ targets: [target] });

      expect(target.hasChallenger).toEqual(true);
    });

    it("When he leaves play", () => {
      const testStore = new TestStore(
        {
          play: [merlinCrab],
          deck: 1,
        },
        { play: [goofyKnightForADay] },
      );

      const defender = testStore.getByZoneAndId(
        "play",
        goofyKnightForADay.id,
        "player_two",
      );
      const attacker = testStore.getByZoneAndId("play", merlinCrab.id);

      defender.updateCardMeta({ exerted: true });

      expect(defender.hasChallenger).toEqual(false);

      attacker.challenge(defender);
      testStore.resolveTopOfStack({ targets: [defender] });

      expect(defender.hasChallenger).toEqual(true);
    });
  });
});
