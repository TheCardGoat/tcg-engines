import { describe, expect, it } from "bun:test";
import { goofyKnightForADay } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters";
import { healWhatHasBeenHurt } from "~/game-engine/engines/lorcana/src/cards/definitions/003/actions";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Heal What Has Been Hurt", () => {
  it("_(A character with cost 3 or more can {E} to sing this song for free.)_ Remove up to 3 damage from chosen character. Draw a card.", () => {
    const testStore = new TestStore({
      inkwell: healWhatHasBeenHurt.cost,
      hand: [healWhatHasBeenHurt],
      play: [goofyKnightForADay],
      deck: [goofyKnightForADay],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "hand",
      healWhatHasBeenHurt.id,
    );
    const target = testStore.getByZoneAndId("play", goofyKnightForADay.id);

    target.updateCardDamage(5);

    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({ targets: [target] });

    expect(target.meta.damage).toBe(2);
  });
});
