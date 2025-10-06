/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { slightlyLostBoy } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
