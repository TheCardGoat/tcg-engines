import { describe, expect, it } from "bun:test";
import { simbaProtectiveCub } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { shieldOfVirtue } from "~/game-engine/engines/lorcana/src/cards/definitions/001/items";
import { poorUnfortunateSouls } from "~/game-engine/engines/lorcana/src/cards/definitions/004/actions";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Poor Unfortunate Souls", () => {
  it("_(A character with cost 2 or more can {E} to sing this song for free.)_Return a character, item or location with cost 2 or less to their player's hand.", () => {
    const testStore = new TestStore(
      {
        inkwell: poorUnfortunateSouls.cost,
        hand: [poorUnfortunateSouls],
      },
      {
        play: [simbaProtectiveCub],
      },
    );

    const cardUnderTest = testStore.getByZoneAndId(
      "hand",
      poorUnfortunateSouls.id,
    );
    const target = testStore.getByZoneAndId(
      "play",
      simbaProtectiveCub.id,
      "player_two",
    );

    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({ targets: [target] });

    expect(target.zone).toBe("hand");
    // Character should be returned to their owner's hand
    const returnedCard = testStore.getByZoneAndId(
      "hand",
      simbaProtectiveCub.id,
      "player_two",
    );
    expect(returnedCard).toBeDefined();
  });
});
