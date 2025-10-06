/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { mulanFreeSpirit } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
