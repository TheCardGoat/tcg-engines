/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { plutoDeterminedDefender } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";

describe("Pluto - Determined Defender", () => {
  it.skip("**Shift** 5 _(You may pay 5 {I} to play this on top of one of your characters named Pluto.)_**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_**GUARD DOG** At the start of your turn, remove up to 3 damage from this character.", () => {
    const testStore = new TestStore({
      play: [plutoDeterminedDefender],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      plutoDeterminedDefender.id,
    );
    expect(cardUnderTest.hasShift).toBe(true);
  });
});
