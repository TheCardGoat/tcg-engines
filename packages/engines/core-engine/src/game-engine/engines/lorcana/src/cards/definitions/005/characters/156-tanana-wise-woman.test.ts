/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  monstroWhaleOfAWhale,
  tananaWiseWoman,
} from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Tanana - Wise Woman", () => {
  it("**YOUR BROTHERS NEED GUIDANCE** When you play this character, you may remove up to 1 damage from chosen character or location.", () => {
    const testStore = new TestStore(
      {
        inkwell: tananaWiseWoman.cost,
        hand: [tananaWiseWoman],
      },
      {
        play: [monstroWhaleOfAWhale],
      },
    );

    const cardUnderTest = testStore.getCard(tananaWiseWoman);
    const monstro = testStore.getCard(monstroWhaleOfAWhale);
    monstro.updateCardDamage(1);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({ targets: [monstro] });

    expect(monstro.damage).toBe(0);
  });
});
