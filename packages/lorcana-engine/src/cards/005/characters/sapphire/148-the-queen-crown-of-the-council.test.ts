/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { theQueenDiviner } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
import {
  theQueenCrownOfTheCouncil,
  theQueenCruelestOfAll,
  theQueenFairestOfAll,
} from "@lorcanito/lorcana-engine/cards/005/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("The Queen - Crown of the Council", () => {
  it("When you play this character, look at the top 3 cards of your deck. You may reveal any number of character cards named The Queen and put them into your hand. Put the rest on the bottom of your deck in any order.", () => {
    const testStore = new TestStore({
      inkwell: theQueenCrownOfTheCouncil.cost,
      hand: [theQueenCrownOfTheCouncil],
      deck: [theQueenFairestOfAll, theQueenCruelestOfAll, theQueenDiviner],
    });

    const cardUnderTest = testStore.getCard(theQueenCrownOfTheCouncil);
    const hand = [
      testStore.getCard(theQueenFairestOfAll),
      testStore.getCard(theQueenCruelestOfAll),
      testStore.getCard(theQueenDiviner),
    ];

    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({ scry: { bottom: [], hand } });
    expect(hand.every((card) => card.zone === "hand")).toBe(true);
  });
});
