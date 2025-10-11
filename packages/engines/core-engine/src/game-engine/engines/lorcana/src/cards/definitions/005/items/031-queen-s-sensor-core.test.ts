import { describe, it } from "bun:test";
import { queensSensorCoreItem } from "~/game-engine/engines/lorcana/src/cards/definitions/005/items/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Queen's Sensor Core", () => {
  it.skip("SYMBOL OF NOBILITY", () => {
    const testStore = new TestStore({
      inkwell: queensSensorCoreItem.cost,
      play: [queensSensorCoreItem],
    });

    const cardUnderTest = testStore.getCard(queensSensorCoreItem);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });

  it.skip("Royal Search", () => {
    const testStore = new TestStore({
      inkwell: queensSensorCoreItem.cost,
      play: [queensSensorCoreItem],
    });

    const cardUnderTest = testStore.getCard(queensSensorCoreItem);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
