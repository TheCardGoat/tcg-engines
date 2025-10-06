/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { moanaOfMotunui } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { scepterOfArendelle } from "~/game-engine/engines/lorcana/src/cards/definitions/001/items/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Scepter Of Arendelle", () => {
  it("Command - Chosen character gains **Support** this turn.", () => {
    const testStore = new TestStore({
      play: [scepterOfArendelle, moanaOfMotunui],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      scepterOfArendelle.id,
    );
    const target = testStore.getByZoneAndId("play", moanaOfMotunui.id);

    cardUnderTest.activate();

    testStore.resolveTopOfStack({ targetId: target.instanceId });

    expect(target.hasSupport).toEqual(true);
  });
});
