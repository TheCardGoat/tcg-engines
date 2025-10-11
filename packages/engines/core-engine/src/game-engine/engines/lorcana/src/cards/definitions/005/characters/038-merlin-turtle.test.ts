import { describe, it } from "bun:test";
import { merlinTurtle } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Merlin - Turtle", () => {
  it.skip("**GIVE ME TIME TO THINK** When you play this character and when he leaves play, look at the top 2 cards of your deck. Put one on the top of your deck and the other on the bottom.", () => {
    const testStore = new TestStore({
      inkwell: merlinTurtle.cost,
      hand: [merlinTurtle],
    });

    const cardUnderTest = testStore.getCard(merlinTurtle);
    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
