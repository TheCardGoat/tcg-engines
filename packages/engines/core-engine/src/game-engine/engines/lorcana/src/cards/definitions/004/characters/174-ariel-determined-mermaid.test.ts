import { describe, expect, it } from "bun:test";
import { youHaveForgottenMe } from "~/game-engine/engines/lorcana/src/cards/definitions/001/actions";
import {
  aWholeNewWorld,
  grabYourSword,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/songs";
import { arielDeterminedMermaid } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Ariel - Determined Mermaid", () => {
  it("**I WANT MORE** Whenever you play a song, you may draw a card, then choose and discard a card.", () => {
    const testStore = new TestStore({
      inkwell: grabYourSword.cost,
      play: [arielDeterminedMermaid],
      hand: [grabYourSword, aWholeNewWorld, youHaveForgottenMe],
      deck: [aWholeNewWorld],
    });

    const song = testStore.getCard(grabYourSword);
    const cardToDiscard = testStore.getCard(youHaveForgottenMe);

    song.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({ targets: [cardToDiscard] });

    expect(testStore.getZonesCardCount().hand).toEqual(2);
    expect(testStore.getZonesCardCount().discard).toEqual(2);
    expect(cardToDiscard.zone).toEqual("discard");
  });
});
