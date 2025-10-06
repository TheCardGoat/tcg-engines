/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { mauisPlaceOfExileHiddenIsland } from "~/game-engine/engines/lorcana/src/cards/definitions/003/locations/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Maui's Place of Exile - Hidden Island", () => {
  it.skip("**ISOLATED** Characters gain **Resist** +1 while here. _(Damage dealt to them is reduced by 1.)_", () => {
    const testStore = new TestStore({
      inkwell: mauisPlaceOfExileHiddenIsland.cost,
      play: [mauisPlaceOfExileHiddenIsland],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      mauisPlaceOfExileHiddenIsland.id,
    );

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
