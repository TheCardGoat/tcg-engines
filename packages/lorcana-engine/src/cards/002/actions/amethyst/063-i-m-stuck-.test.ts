/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { imStuck } from "@lorcanito/lorcana-engine/cards/002/actions/actions";
import { cheshireCatAlwaysGrinning } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("I'm Stuck!", () => {
  it("Chosen exerted character can't ready at the start of their next turn.", () => {
    const testStore = new TestStore(
      {
        inkwell: imStuck.cost,
        hand: [imStuck],
      },
      {
        play: [cheshireCatAlwaysGrinning],
        deck: 1,
      },
    );

    const cardUnderTest = testStore.getByZoneAndId("hand", imStuck.id);
    const target = testStore.getByZoneAndId(
      "play",
      cheshireCatAlwaysGrinning.id,
      "player_two",
    );

    target.updateCardMeta({ exerted: true });

    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({ targets: [target] });

    testStore.passTurn();

    expect(target.ready).toBeFalsy();
  });
});
