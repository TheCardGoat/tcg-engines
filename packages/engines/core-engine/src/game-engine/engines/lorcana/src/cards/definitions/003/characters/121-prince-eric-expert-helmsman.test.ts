/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { princeEricExpertHelmsman } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";

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
