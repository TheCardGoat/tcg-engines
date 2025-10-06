/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { motunuiIslandParadise } from "~/game-engine/engines/lorcana/src/cards/definitions/003/locations/locations";

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
