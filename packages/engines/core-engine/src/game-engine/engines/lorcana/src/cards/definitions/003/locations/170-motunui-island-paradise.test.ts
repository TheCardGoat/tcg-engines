/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { motunuiIslandParadise } from "~/game-engine/engines/lorcana/src/cards/definitions/003/locations/indext";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
