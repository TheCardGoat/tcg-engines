/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { sirHissAggravatingAsp } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Sir Hiss - Aggravating Asp", () => {
  it.skip("**Evasive** _(Only characters with Evasive can challenge this character.)_", () => {
    const testStore = new TestStore({
      play: [sirHissAggravatingAsp],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      sirHissAggravatingAsp.id,
    );
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
