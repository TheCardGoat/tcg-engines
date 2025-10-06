/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { moanaUndeterredVoyager } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";

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
