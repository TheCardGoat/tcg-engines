/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { pegasusFlyingSteed } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/characters";

describe("Pegasus - Flying Steed", () => {
  it.skip("**Evasive** _(Only characters with Evasive can challenge this character.)_", () => {
    const testStore = new TestStore({
      play: [pegasusFlyingSteed],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      pegasusFlyingSteed.id,
    );
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
