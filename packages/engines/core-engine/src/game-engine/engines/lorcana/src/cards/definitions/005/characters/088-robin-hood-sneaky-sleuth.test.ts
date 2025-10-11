import { describe, it } from "bun:test";
import { robinHoodSneakySleuth } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Robin Hood - Sneaky Sleuth", () => {
  it.skip("", () => {
    const testStore = new TestStore({
      inkwell: robinHoodSneakySleuth.cost,
      play: [robinHoodSneakySleuth],
    });

    const cardUnderTest = testStore.getCard(robinHoodSneakySleuth);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });

  it.skip("**CLEVER PLAN** This character gets +1 {L} for each opposing damaged character in play._ **", () => {
    const testStore = new TestStore({
      inkwell: robinHoodSneakySleuth.cost,
      play: [robinHoodSneakySleuth],
    });

    const cardUnderTest = testStore.getCard(robinHoodSneakySleuth);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
