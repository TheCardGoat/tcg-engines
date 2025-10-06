/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { donaldDuck } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/characters";
import { donaldDuckPieSlinger } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/characters";

describe("Donald Duck - Pie Slinger", () => {
  it("**HUMBLE PIE** When you play this character, if you used **Shift** to play him, each opponent loses 2 lore.", () => {
    const testStore = new TestStore({
      inkwell: donaldDuckPieSlinger.cost,
      hand: [donaldDuckPieSlinger],
      play: [donaldDuck],
    });

    testStore.store.tableStore.getTable("player_two").updateLore(5);

    const cardUnderTest = testStore.getCard(donaldDuckPieSlinger);
    const target = testStore.getCard(donaldDuck);

    cardUnderTest.shift(target);

    expect(testStore.store.tableStore.getTable("player_two").lore).toBe(3);
  });

  it("**RAGING DUCK** While an opponent has 10 or more lore, this character gets +6 {S}.", () => {
    const testStore = new TestStore({
      play: [donaldDuckPieSlinger],
    });

    const cardUnderTest = testStore.getCard(donaldDuckPieSlinger);

    expect(cardUnderTest.strength).toBe(donaldDuckPieSlinger.strength);

    testStore.store.tableStore.getTable("player_two").updateLore(10);

    expect(testStore.store.tableStore.getTable("player_two").lore).toBe(10);
    expect(cardUnderTest.strength).toBe(donaldDuckPieSlinger.strength + 6);
  });
});
