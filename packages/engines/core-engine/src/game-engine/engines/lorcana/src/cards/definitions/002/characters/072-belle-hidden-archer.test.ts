import { describe, expect, it } from "bun:test";
import {
  belleHiddenArcher,
  pinocchioStarAttraction,
} from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Belle - Hidden Archer", () => {
  it("Shift", () => {
    const testStore = new TestStore({
      play: [belleHiddenArcher],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      belleHiddenArcher.id,
    );

    expect(cardUnderTest.hasShift()).toBeTruthy();
  });

  describe("**THORNY ARROWS** Whenever this character is challenged, the challenging character’s player discards all cards in their hand.", () => {
    it("as defender, discards all cards in hand", () => {
      const testStore = new TestStore(
        {
          play: [pinocchioStarAttraction],
          hand: 5,
        },
        {
          play: [belleHiddenArcher],
        },
      );

      const cardUnderTest = testStore.getByZoneAndId(
        "play",
        belleHiddenArcher.id,
        "player_two",
      );
      const attacker = testStore.getByZoneAndId(
        "play",
        pinocchioStarAttraction.id,
        "player_one",
      );
      cardUnderTest.updateCardMeta({ exerted: true });
      attacker.challenge(cardUnderTest);

      expect(testStore.getZonesCardCount()).toEqual(
        expect.objectContaining({
          hand: 0,
          discard: 5 + 1, // 5 from hand, 1 from challenge
        }),
      );
    });

    it("as attacker, discards none", () => {
      const testStore = new TestStore(
        {
          play: [belleHiddenArcher],
          hand: 5,
        },
        {
          play: [pinocchioStarAttraction],
        },
      );

      const cardUnderTest = testStore.getByZoneAndId(
        "play",
        belleHiddenArcher.id,
        "player_one",
      );
      const defender = testStore.getByZoneAndId(
        "play",
        pinocchioStarAttraction.id,
        "player_two",
      );
      defender.updateCardMeta({ exerted: true });
      cardUnderTest.challenge(defender);

      expect(testStore.getZonesCardCount()).toEqual(
        expect.objectContaining({
          hand: 5,
          discard: 0,
        }),
      );
    });
  });
});
