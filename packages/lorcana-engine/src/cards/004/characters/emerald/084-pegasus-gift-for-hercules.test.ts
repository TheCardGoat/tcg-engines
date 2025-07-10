/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { pegasusGiftForHercules } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Pegasus - Gift for Hercules", () => {
  it.skip("**Evasive** _(Only characters with Evasive can challenge this character.)_", () => {
    const testStore = new TestStore({
      play: [pegasusGiftForHercules],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      pegasusGiftForHercules.id,
    );
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
