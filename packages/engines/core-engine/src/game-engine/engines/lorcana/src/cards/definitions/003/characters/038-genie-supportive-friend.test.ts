/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { genieSupportiveFriend } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Genie - Supportive Friend", () => {
  it("**THREE WISHES** Whenever this character quests, you may shuffle this card into your deck to draw 3 cards.", () => {
    const testStore = new TestStore({
      play: [genieSupportiveFriend],
      deck: [
        genieSupportiveFriend,
        genieSupportiveFriend,
        genieSupportiveFriend,
        genieSupportiveFriend,
      ],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      genieSupportiveFriend.id,
    );

    // Quest with the genie
    cardUnderTest.quest();

    // Accept and resolve the optional ability
    testStore.resolveOptionalAbility();

    // resolve the remaining effects (draw cards)
    testStore.resolveTopOfStack({});

    const zoneCount = testStore.getZonesCardCount();

    // Check to make sure that the genie has been shuffled into the deck
    expect(zoneCount.deck).toEqual(2);

    // Check to make sure that 3 cards have been drawn
    expect(zoneCount.hand).toEqual(3);

    // Check to make sure that there are no cards left in play
    expect(zoneCount.play).toEqual(0);
  });
});
