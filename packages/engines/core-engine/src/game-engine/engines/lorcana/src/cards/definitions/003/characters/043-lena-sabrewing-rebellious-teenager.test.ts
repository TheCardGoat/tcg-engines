/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { lenaSabrewingRebelliousTeenager } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";

describe("Lena Sabrewing - Rebellious Teenager", () => {
  it.skip("**Rush** _(This character can challenge the turn they're played.)_", () => {
    const testStore = new TestStore({
      play: [lenaSabrewingRebelliousTeenager],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      lenaSabrewingRebelliousTeenager.id,
    );
    expect(cardUnderTest.hasRush).toBe(true);
  });
});
