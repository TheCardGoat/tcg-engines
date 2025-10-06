/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { mulanFreeSpirit } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/characters";

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
