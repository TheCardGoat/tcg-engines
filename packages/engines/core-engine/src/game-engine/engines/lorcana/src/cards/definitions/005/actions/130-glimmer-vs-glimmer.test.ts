import { describe, expect, it } from "bun:test";
import { glimmerVsGlimmer } from "~/game-engine/engines/lorcana/src/cards/definitions/005/actions";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Glimmer VS Glimmer", () => {
  it.skip("Banish chosen character of yours to banish chosen character.", () => {
    const testStore = new TestStore({
      inkwell: glimmerVsGlimmer.cost,
      hand: [glimmerVsGlimmer],
    });

    const cardUnderTest = testStore.getCard(glimmerVsGlimmer);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
