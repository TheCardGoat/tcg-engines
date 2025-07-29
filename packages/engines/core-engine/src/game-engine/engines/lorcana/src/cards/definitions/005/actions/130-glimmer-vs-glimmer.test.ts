/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { glimmerVsGlimmer } from "~/game-engine/engines/lorcana/src/cards/definitions/005/actions";

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
