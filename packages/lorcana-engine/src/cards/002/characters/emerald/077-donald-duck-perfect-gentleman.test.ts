/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { donaldDuckPerfectGentleman } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Donald Duck - Perfect Gentleman", () => {
  it("Shifts", () => {
    const testStore = new TestStore({
      play: [donaldDuckPerfectGentleman],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      donaldDuckPerfectGentleman.id,
    );

    expect(cardUnderTest.hasShift).toEqual(true);
  });

  it("**ALLOW ME** At the start of your turn, each player may draw a card.", async () => {
    const testStore = new TestStore(
      { deck: 3 },
      {
        play: [donaldDuckPerfectGentleman],
        deck: 3,
      },
    );

    testStore.passTurn();

    // Card owner's effect
    testStore.changePlayer("player_two");
    testStore.resolveOptionalAbility();
    expect(testStore.getZonesCardCount("player_one")).toEqual(
      expect.objectContaining({
        deck: 2,
        hand: 1,
      }),
    );

    // Card owner's opponent's effect
    testStore.changePlayer("player_one");
    testStore.changePlayer().resolveOptionalAbility();
    expect(testStore.getZonesCardCount("player_two")).toEqual(
      expect.objectContaining({
        deck: 2,
        hand: 1,
      }),
    );

    expect(testStore.stackLayers).toHaveLength(0);
    testStore.passTurn();

    expect(testStore.getZonesCardCount("player_one")).toEqual(
      expect.objectContaining({
        deck: 1,
        hand: 2,
      }),
    );
  });
});
