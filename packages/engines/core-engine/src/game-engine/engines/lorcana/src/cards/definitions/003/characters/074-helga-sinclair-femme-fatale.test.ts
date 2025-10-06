/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { helgaSinclairFemmeFatale } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";

describe("Helga Sinclair - Femme Fatale", () => {
  it.skip("**Shift** 3 _(You may pay 3 {I} to play this on top of one of your characters named Helga Sinclair.)_**THIS CHANGES EVERYTHING** Whenever this character quests, you may deal 3 damage to chosen damaged character.", () => {
    const testStore = new TestStore({
      play: [helgaSinclairFemmeFatale],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      helgaSinclairFemmeFatale.id,
    );
    expect(cardUnderTest.hasShift).toBe(true);
  });
});
