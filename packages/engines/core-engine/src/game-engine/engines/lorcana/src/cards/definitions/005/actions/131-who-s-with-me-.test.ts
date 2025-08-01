import { describe, expect, it } from "bun:test";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { whosWithMe } from "~/game-engine/engines/lorcana/src/cards/definitions/005/actions";

describe("Who's With Me?", () => {
  it.skip("Your characters get +2 {S} this turn.", () => {
    const testStore = new TestStore({
      inkwell: whosWithMe.cost,
      hand: [whosWithMe],
    });

    const cardUnderTest = testStore.getCard(whosWithMe);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });

  it.skip("Whenever one of your characters with **Reckless** challenges another character this turn, gain 2 lore.", () => {
    const testStore = new TestStore({
      inkwell: whosWithMe.cost,
      hand: [whosWithMe],
    });

    const cardUnderTest = testStore.getCard(whosWithMe);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
