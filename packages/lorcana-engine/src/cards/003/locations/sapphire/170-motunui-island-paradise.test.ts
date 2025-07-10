/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { motunuiIslandParadise } from "@lorcanito/lorcana-engine/cards/003/locations/locations";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Motunui - Island Paradise", () => {
  it.skip("**REINCARNATION** Whenever a character is banished while here, you may put that card into your inkwell facedown and exerted.", () => {
    const testStore = new TestStore({
      inkwell: motunuiIslandParadise.cost,
      play: [motunuiIslandParadise],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      motunuiIslandParadise.id,
    );

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
