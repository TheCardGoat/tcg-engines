/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { theNokkWaterSpirit } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("The Nokk - Water Spirit", () => {
  it("has ward", () => {
    const testStore = new TestStore({
      play: [theNokkWaterSpirit],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      theNokkWaterSpirit.id,
    );

    expect(cardUnderTest.hasWard).toEqual(true);
  });
});
