/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  banzaiTauntingHyena,
  monstroWhaleOfAWhale,
} from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Banzai - Taunting Hyena", () => {
  it("**HERE KITTY, KITTY, KITTY** When you play this character, you may exert chosen damaged character.", () => {
    const testStore = new TestStore({
      inkwell: banzaiTauntingHyena.cost,
      hand: [banzaiTauntingHyena],
      play: [monstroWhaleOfAWhale],
    });

    const cardUnderTest = testStore.getCard(banzaiTauntingHyena);
    const target = testStore.getCard(monstroWhaleOfAWhale);
    target.updateCardMeta({ damage: 2 });
    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({ targets: [target] });

    expect(target.meta.exerted).toEqual(true);
  });
});
