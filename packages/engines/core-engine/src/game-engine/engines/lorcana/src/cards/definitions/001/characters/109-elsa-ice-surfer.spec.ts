/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  annaHeirToArendelle,
  elsaIceSurfer,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Elsa Ice Surfer", () => {
  it("THAT'S NO BLIZZARD effect - Whenever you play a character named Anna, ready this character. This character can't quest for the rest of this turn.", () => {
    const testStore = new TestStore({
      inkwell: annaHeirToArendelle.cost,
      play: [elsaIceSurfer],
      hand: [annaHeirToArendelle],
    });

    const cardUnderTest = testStore.getByZoneAndId("play", elsaIceSurfer.id);
    const targetTrigger = testStore.getByZoneAndId(
      "hand",
      annaHeirToArendelle.id,
    );
    cardUnderTest.updateCardMeta({ exerted: true });

    targetTrigger.playFromHand();

    expect(cardUnderTest.meta).toEqual(
      expect.objectContaining({ exerted: false }),
    );
  });
});
