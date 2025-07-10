/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { slightlyLostBoy } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Slightly - Lost Boy", () => {
  it.skip("**THE FOX** If you have a character named Peter Pan in play, you pay 1 {I} less to play this character.**Evasive** _(Only characters with Evasive can challenge this character.)_", () => {
    const testStore = new TestStore({
      inkwell: slightlyLostBoy.cost,
      play: [slightlyLostBoy],
    });

    const cardUnderTest = testStore.getByZoneAndId("play", slightlyLostBoy.id);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
