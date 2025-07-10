/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { mauisPlaceOfExileHiddenIsland } from "@lorcanito/lorcana-engine/cards/003/locations/locations";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

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
