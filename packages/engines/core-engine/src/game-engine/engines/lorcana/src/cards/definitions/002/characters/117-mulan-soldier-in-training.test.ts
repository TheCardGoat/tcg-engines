import { describe, it } from "bun:test";
import { mulanSoldierInTraining } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Mulan - Soldier in Training", () => {
  it.skip("", () => {
    const testStore = new TestStore({
      inkwell: mulanSoldierInTraining.cost,

      play: [mulanSoldierInTraining],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      mulanSoldierInTraining.id,
    );

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
