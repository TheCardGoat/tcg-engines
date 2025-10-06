/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { olafFriendlySnowman } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { chernabogEvildoer } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters";
import {
  merlinIntellectualVisionary,
  minnieMouseCompassionateFriend,
  minnieMouseDrumMajor,
} from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Minnie Mouse - Drum Major", () => {
  it("**PARADE ORDER** When you play this character, if you used **Shift** to play her, you may search your deck for a character card and reveal that card to all players. Shuffle your deck and put that card on top of it.", () => {
    const testStore = new TestStore({
      inkwell: minnieMouseDrumMajor.cost,
      hand: [minnieMouseDrumMajor],
      play: [minnieMouseCompassionateFriend],
      deck: [
        merlinIntellectualVisionary,
        chernabogEvildoer,
        olafFriendlySnowman,
      ],
    });

    const cardUnderTest = testStore.getCard(minnieMouseDrumMajor);
    const cardToShift = testStore.getCard(minnieMouseCompassionateFriend);
    const target = testStore.getCard(olafFriendlySnowman);

    cardUnderTest.shift(cardToShift);

    testStore.resolveTopOfStack({ targets: [target] });

    const topDeck = testStore.store.topDeckCard("player_one");

    expect(topDeck?.instanceId).toEqual(target.instanceId);
  });
});
