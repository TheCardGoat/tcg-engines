/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { princePhillipVanquisherOfFoes } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Prince Phillip - Vanquisher of Foes", () => {
  it.skip("**Shift** 6 _You may pay 6 {I} to play this on top of one of your characters named Prince Phillip.)_**Evasive** _(Only characters with Evasive can challenge this character.)_**STRIKE TO THE HEART** When you play this character, banish all opposing characters with at least 1 damage counter.", () => {
    const testStore = new TestStore({
      play: [princePhillipVanquisherOfFoes],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      princePhillipVanquisherOfFoes.id,
    );
    expect(cardUnderTest.hasShift).toBe(true);
  });
});
