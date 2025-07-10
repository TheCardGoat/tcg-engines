/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { thaddeusEKlangMetalHead } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Thaddeus E. Klang - Metal Head", () => {
  it.skip("**SHARP JAW** Whenever this character quests while at a location, you may deal 1 damage to chosen character.", () => {
    const testStore = new TestStore({
      inkwell: thaddeusEKlangMetalHead.cost,
      play: [thaddeusEKlangMetalHead],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      thaddeusEKlangMetalHead.id,
    );

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
