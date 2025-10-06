/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { beastSelflessProtector } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/characters";

describe("Beast - Selfless Protector", () => {
  it("**SHIELD ANOTHER** Whenever one of your other characters would be dealt damage, put that many damage counters on this character instead.", () => {
    const testStore = new TestStore({
      play: [beastSelflessProtector],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      beastSelflessProtector.id,
    );

    expect(cardUnderTest.hasProtector).toEqual(true);
  });
});
