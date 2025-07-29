import { describe, expect, it } from "bun:test";
import { teethAndAmbitions } from "~/game-engine/engines/lorcana/src/cards/definitions/002/actions";
import {
  donaldDuckNotAgain,
  goofyKnightForADay,
} from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Teeth and Ambitions", () => {
  it("Deal 2 damage to chosen character of yours to deal 2 damage to another chosen character.", () => {
    const testStore = new TestStore(
      {
        inkwell: teethAndAmbitions.cost,
        hand: [teethAndAmbitions],
        play: [goofyKnightForADay],
      },
      { play: [donaldDuckNotAgain] },
    );

    const cardUnderTest = testStore.getByZoneAndId(
      "hand",
      teethAndAmbitions.id,
    );
    const targetOfYour = testStore.getByZoneAndId(
      "play",
      goofyKnightForADay.id,
    );
    const targetOfOpponent = testStore.getByZoneAndId(
      "play",
      donaldDuckNotAgain.id,
      "player_two",
    );

    cardUnderTest.playFromHand();

    testStore.resolveTopOfStack({ targets: [targetOfYour] }, true);
    expect(targetOfYour.meta.damage).toBe(2);

    testStore.resolveTopOfStack({ targets: [targetOfOpponent] });
    expect(targetOfOpponent.meta.damage).toBe(2);
  });
});
