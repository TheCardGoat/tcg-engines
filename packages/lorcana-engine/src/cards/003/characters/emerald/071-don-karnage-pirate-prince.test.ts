/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { donKarnagePiratePrince } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

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
