import { describe, it } from "bun:test";
import { rayaUnstoppableForce } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Raya - Unstoppable Force", () => {
  it.skip("**Challenger +2** _(While challenging, this character gets +2 {S}.)_**Resist +2** _(Damage dealt to this character is reduced by 2.)_**YOU GAVE IT YOUR BEST** During your turn, whenever this character banishes another character in a challenge, you may draw a card.", () => {
    const testStore = new TestStore({
      inkwell: rayaUnstoppableForce.cost,
      play: [rayaUnstoppableForce],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      rayaUnstoppableForce.id,
    );

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
