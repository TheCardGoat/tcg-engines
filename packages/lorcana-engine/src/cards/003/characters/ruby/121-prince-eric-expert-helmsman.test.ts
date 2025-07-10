/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { princeEricExpertHelmsman } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Prince Eric - Expert Helmsman", () => {
  it.skip("**SURPRISE MANEUVER** When this character is banished, you may banish chosen character.", () => {
    const testStore = new TestStore({
      inkwell: princeEricExpertHelmsman.cost,
      play: [princeEricExpertHelmsman],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      princeEricExpertHelmsman.id,
    );

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
