/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { donKarnagePiratePrince } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Don Karnage - Pirate Prince", () => {
  it.skip("**Evasive** _(Only characters with Evasive can challenge this character.)_", () => {
    const testStore = new TestStore({
      play: [donKarnagePiratePrince],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      donKarnagePiratePrince.id,
    );
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
