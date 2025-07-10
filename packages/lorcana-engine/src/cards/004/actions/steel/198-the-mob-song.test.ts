/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { theMobSong } from "@lorcanito/lorcana-engine/cards/004/actions/actions";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("The Mob Song", () => {
  it.skip("**Sing Together** 10 _(Any number of your of your teammates' characters with total cost 10 or more may {E} to sing this song for free.)_Deal 3 damage to up to 3 chosen characters and/or locations.", () => {
    const testStore = new TestStore({
      inkwell: theMobSong.cost,
      hand: [theMobSong],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", theMobSong.id);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
