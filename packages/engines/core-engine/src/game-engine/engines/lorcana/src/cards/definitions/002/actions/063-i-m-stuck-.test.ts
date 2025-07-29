import { describe, expect, it } from "bun:test";
import { imStuck } from "~/game-engine/engines/lorcana/src/cards/definitions/002/actions";
import { cheshireCatAlwaysGrinning } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
