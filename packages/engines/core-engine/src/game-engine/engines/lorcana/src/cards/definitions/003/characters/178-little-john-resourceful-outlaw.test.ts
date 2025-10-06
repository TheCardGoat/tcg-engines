/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { littleJohnResourcefulOutlaw } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";

describe("Little John - Resourceful Outlaw", () => {
  it.skip("**Shift** 4 _(You may pay 4 {I} to play this on top of one of your characters named Little John.)_**OKAY, BIG SHOT** While this character is exerted, your characters with **Bodyguard** gain **Resist** +1 and get +1 {L}. _(Damage dealt to them is reduced by 1.)_", () => {
    const testStore = new TestStore({
      play: [littleJohnResourcefulOutlaw],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      littleJohnResourcefulOutlaw.id,
    );
    expect(cardUnderTest.hasShift).toBe(true);
  });
});
