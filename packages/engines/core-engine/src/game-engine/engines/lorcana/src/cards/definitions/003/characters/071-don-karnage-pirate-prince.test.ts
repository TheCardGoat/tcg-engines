/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { donKarnagePiratePrince } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";

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
