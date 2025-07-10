/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { mauiDemiGod } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { pickAFight } from "@lorcanito/lorcana-engine/cards/002/actions/actions";
import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

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
