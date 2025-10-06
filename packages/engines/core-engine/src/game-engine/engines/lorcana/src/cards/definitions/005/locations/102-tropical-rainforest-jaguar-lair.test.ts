/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { tropicalRainforestJaguarLair } from "~/game-engine/engines/lorcana/src/cards/definitions/005/locations/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Tropical Rainforest - Jaguar Lair", () => {
  it.skip("**SNACK TIME** Opposing damaged characters gain **Reckless**. _(They can’t quest and must challenge if able.)_", () => {
    const testStore = new TestStore({
      inkwell: tropicalRainforestJaguarLair.cost,
      play: [tropicalRainforestJaguarLair],
    });

    const cardUnderTest = testStore.getCard(tropicalRainforestJaguarLair);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
