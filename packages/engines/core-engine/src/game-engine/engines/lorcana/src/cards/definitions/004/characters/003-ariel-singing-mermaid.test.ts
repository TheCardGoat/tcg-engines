/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { arielSingingMermaid } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
