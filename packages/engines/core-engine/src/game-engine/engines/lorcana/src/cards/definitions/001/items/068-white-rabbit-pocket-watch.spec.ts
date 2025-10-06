/**
 * @jest-environment node
 */
import { describe, expect, it } from "@jest/globals";
import { moanaOfMotunui } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/characters";
import { whiteRabbitPocketWatch } from "~/game-engine/engines/lorcana/src/cards/definitions/001/items/items";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("White Rabbit's Pocket Watch", () => {
  it("I'm late - Chosen character gains **Rush** this turn.", () => {
    const testStore = new TestStore({
      inkwell: 1,
      play: [whiteRabbitPocketWatch, moanaOfMotunui],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      whiteRabbitPocketWatch.id,
    );
    const target = testStore.getByZoneAndId("play", moanaOfMotunui.id);

    cardUnderTest.activate();
    testStore.resolveTopOfStack({ targetId: target.instanceId });

    expect(target.hasRush).toEqual(true);
  });
});
