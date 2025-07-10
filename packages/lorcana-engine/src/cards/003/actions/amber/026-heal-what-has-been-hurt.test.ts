/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { healWhatHasBeenHurt } from "@lorcanito/lorcana-engine/cards/003/actions/actions";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Heal What Has Been Hurt", () => {
  it.skip("_(A character with cost 3 or more can {E} to sing this song for free.)_ Remove up to 3 damage from chosen character. Draw a card.", () => {
    const testStore = new TestStore({
      inkwell: healWhatHasBeenHurt.cost,
      hand: [healWhatHasBeenHurt],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "hand",
      healWhatHasBeenHurt.id,
    );

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
