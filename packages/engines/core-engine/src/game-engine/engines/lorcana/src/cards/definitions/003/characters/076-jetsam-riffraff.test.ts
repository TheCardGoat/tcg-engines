/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { jetsamRiffraff } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Jetsam - Riffraff", () => {
  it.skip("**Ward** _(Opponents can't choose this character except to challenge.)_**EERIE PAIR** Your characters named Flotsam gain **Ward**.", () => {
    const testStore = new TestStore({
      play: [jetsamRiffraff],
    });

    const cardUnderTest = testStore.getByZoneAndId("play", jetsamRiffraff.id);
    expect(cardUnderTest.hasWard).toBe(true);
  });
});
