/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { arielSingingMermaid } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Ariel - Singing Mermaid", () => {
  it.skip("**Singer** 7 _(This character counts as cost 7 to sing songs.)_", () => {
    const testStore = new TestStore({
      play: [arielSingingMermaid],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      arielSingingMermaid.id,
    );
    expect(cardUnderTest.hasSinger).toBe(true);
  });
});
