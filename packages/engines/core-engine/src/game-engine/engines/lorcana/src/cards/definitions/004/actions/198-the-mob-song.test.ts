/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import {
  mickeyBraveLittleTailor,
  simbaProtectiveCub,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters.ts";
import { theMobSong } from "@lorcanito/lorcana-engine/cards/004/actions/actions.ts";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore.ts";

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
