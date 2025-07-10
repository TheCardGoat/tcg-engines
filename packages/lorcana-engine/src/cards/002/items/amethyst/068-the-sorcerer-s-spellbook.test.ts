/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { theSorcerersSpellbook } from "@lorcanito/lorcana-engine/cards/002/items/items";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("The Sorcerer's Spellbook", () => {
  it("**KNOWLEDGE** {E}, 1 {I} − Gain 1 lore.", () => {
    const testStore = new TestStore({
      inkwell: 1,
      play: [theSorcerersSpellbook],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      theSorcerersSpellbook.id,
    );

    cardUnderTest.activate();

    expect(testStore.getPlayerLore()).toEqual(1);
    expect(cardUnderTest.ready).toEqual(false);
  });
});
