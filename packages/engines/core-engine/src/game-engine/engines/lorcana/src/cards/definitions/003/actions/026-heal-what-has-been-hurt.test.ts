/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/characters.ts";
import { healWhatHasBeenHurt } from "@lorcanito/lorcana-engine/cards/003/actions/actions.ts";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore.ts";

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
