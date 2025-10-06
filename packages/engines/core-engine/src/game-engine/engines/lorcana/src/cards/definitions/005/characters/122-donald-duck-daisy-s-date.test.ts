/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import {
  donaldDuckDaisysDate,
  monstroWhaleOfAWhale,
} from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/characters";

describe("Donald Duck - Daisy's Date", () => {
  it("**PLUCKY PLAY** Whenever this character challenges another character, each opponent loses 1 lore.", () => {
    const testStore = new TestStore(
      {
        inkwell: donaldDuckDaisysDate.cost,
        play: [donaldDuckDaisysDate],
      },
      {
        play: [monstroWhaleOfAWhale],
      },
    );

    testStore.store.tableStore.getTable("player_two").lore = 5;

    const cardUnderTest = testStore.getCard(donaldDuckDaisysDate);
    const defender = testStore.getCard(monstroWhaleOfAWhale);

    defender.updateCardMeta({ exerted: true });

    cardUnderTest.challenge(defender);

    expect(testStore.store.tableStore.getTable("player_two").lore).toBe(4);
  });
});
