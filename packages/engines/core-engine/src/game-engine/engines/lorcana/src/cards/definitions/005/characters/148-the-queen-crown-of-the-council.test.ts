import { describe, expect, it } from "bun:test";
import { theQueenDiviner } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters";
import {
  theQueenCrownOfTheCouncil,
  theQueenCruelestOfAll,
  theQueenFairestOfAll,
} from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
