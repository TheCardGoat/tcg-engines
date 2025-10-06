/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { pegasusGiftForHercules } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
