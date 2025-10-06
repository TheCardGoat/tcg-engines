/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { theSorcerersSpellbook } from "~/game-engine/engines/lorcana/src/cards/definitions/002/items/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
