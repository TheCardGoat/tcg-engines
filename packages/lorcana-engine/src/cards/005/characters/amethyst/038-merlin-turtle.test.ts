/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { merlinTurtle } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

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
