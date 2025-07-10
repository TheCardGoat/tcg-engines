/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  banzaiTauntingHyena,
  monstroWhaleOfAWhale,
} from "@lorcanito/lorcana-engine/cards/005/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

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
