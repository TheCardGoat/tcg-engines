import { describe, expect, it } from "bun:test";
import { mauiDemiGod } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { pickAFight } from "~/game-engine/engines/lorcana/src/cards/definitions/002/actions";
import { goofyKnightForADay } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Pick a Fight", () => {
  it("Chosen character can challenge ready characters this turn.", () => {
    const testStore = new TestStore(
      {
        inkwell: pickAFight.cost,
        hand: [pickAFight],
        play: [goofyKnightForADay],
      },
      { play: [mauiDemiGod], deck: 1 },
    );

    const cardUnderTest = testStore.getByZoneAndId("hand", pickAFight.id);
    const target = testStore.getByZoneAndId("play", goofyKnightForADay.id);
    const defender = testStore.getByZoneAndId(
      "play",
      mauiDemiGod.id,
      "player_two",
    );

    expect(target.canChallenge(defender)).toEqual(false);

    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({ targets: [target] });

    expect(target.canChallenge(defender)).toEqual(true);

    testStore.passTurn();

    expect(target.canChallenge(defender)).toEqual(false);
  });
});
