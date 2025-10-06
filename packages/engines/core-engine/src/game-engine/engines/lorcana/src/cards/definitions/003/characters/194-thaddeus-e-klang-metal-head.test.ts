/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { thaddeusEKlangMetalHead } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
