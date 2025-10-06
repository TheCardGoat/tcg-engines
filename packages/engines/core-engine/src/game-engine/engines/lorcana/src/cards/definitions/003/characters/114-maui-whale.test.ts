/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { mauiWhale } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";

describe("Maui - Whale", () => {
  it.skip("**THIS MISSION IS CURSED** This character doesn’t ready at the start of the turn.", () => {
    const testStore = new TestStore({
      inkwell: mauiWhale.cost,
      play: [mauiWhale],
    });

    const cardUnderTest = testStore.getCard(mauiWhale);
    expect(cardUnderTest.ready).toBe(true);
    cardUnderTest.updateCardMeta({ exerted: true });
    expect(cardUnderTest.ready).toBe(false);
    testStore.passTurn();
    expect(cardUnderTest.ready).toBe(false);
    testStore.passTurn();
    expect(cardUnderTest.ready).toBe(false);
  });
  it.skip("**DON’T WORRY, I’M HERE** 2 {I} - Ready this character, this character can’t quest for the rest of this turn.", () => {
    const testStore = new TestStore({
      inkwell: mauiWhale.cost,
      play: [mauiWhale],
    });

    const cardUnderTest = testStore.getCard(mauiWhale);
    cardUnderTest.updateCardMeta({ exerted: true });
    expect(cardUnderTest.ready).toBe(false);

    cardUnderTest.activate();
    expect(cardUnderTest.ready).toBe(true);
    expect(cardUnderTest.canQuest).toBe(false);
  });
});
