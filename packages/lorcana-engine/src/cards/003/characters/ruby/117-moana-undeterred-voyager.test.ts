/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { moanaUndeterredVoyager } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Moana - Undeterred Voyager", () => {
  it.skip("**Evasive** _(Only characters with Evasive can challenge this character.)_", () => {
    const testStore = new TestStore({
      play: [moanaUndeterredVoyager],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      moanaUndeterredVoyager.id,
    );
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
