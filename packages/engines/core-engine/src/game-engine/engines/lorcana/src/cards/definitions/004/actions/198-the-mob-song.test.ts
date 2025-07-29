import { describe, expect, it } from "bun:test";
import {
  mickeyBraveLittleTailor,
  simbaProtectiveCub,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { theMobSong } from "~/game-engine/engines/lorcana/src/cards/definitions/004/actions";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("The Mob Song", () => {
  it("**Sing Together** 10 _(Any number of your of your teammates' characters with total cost 10 or more may {E} to sing this song for free.)_Deal 3 damage to up to 3 chosen characters and/or locations.", () => {
    const testStore = new TestStore(
      {
        inkwell: theMobSong.cost,
        hand: [theMobSong],
      },
      {
        play: [mickeyBraveLittleTailor, simbaProtectiveCub],
      },
    );

    const cardUnderTest = testStore.getByZoneAndId("hand", theMobSong.id);
    const target1 = testStore.getByZoneAndId(
      "play",
      mickeyBraveLittleTailor.id,
      "player_two",
    );
    const target2 = testStore.getByZoneAndId(
      "play",
      simbaProtectiveCub.id,
      "player_two",
    );

    expect(target1.damage).toBe(0);
    expect(target2.damage).toBe(0);

    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({ targets: [target1, target2] });

    // Test that 3 damage was dealt to both targets
    expect(target1.damage).toBe(3);
    expect(target2.damage).toBe(3);
    expect(testStore.getZonesCardCount().discard).toBe(1); // The Mob Song goes to discard
  });
});
