/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { mulanFreeSpirit } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Mulan - Free Spirit", () => {
  it.skip("", () => {
    const testStore = new TestStore({
      inkwell: mulanFreeSpirit.cost,

      play: [mulanFreeSpirit],
    });

    const cardUnderTest = testStore.getByZoneAndId("play", mulanFreeSpirit.id);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
