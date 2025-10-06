/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { donaldDuckPerfectGentleman } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
    const testEngine = new TestEngine(
      { deck: 3 },
      {
        play: [donaldDuckPerfectGentleman],
        deck: 3,
      },
    );

    await testEngine.passTurn();

    // This happen before draw step
    expect(testEngine.getZonesCardCount("player_two")).toEqual(
      expect.objectContaining({
        deck: 3,
        hand: 0,
      }),
    );

    // Card owner's effect
    testEngine.changeActivePlayer("player_two");
    await testEngine.resolveOptionalAbility();
    expect(testEngine.getZonesCardCount("player_two")).toEqual(
      expect.objectContaining({
        deck: 2,
        hand: 1,
      }),
    );

    // Card owner's opponent's effect
    // await testEngine.resolveOptionalAbility();
    testEngine.changeActivePlayer("player_one");
    await testEngine.resolveOptionalAbility();
    expect(testEngine.getZonesCardCount("player_one")).toEqual(
      expect.objectContaining({
        deck: 2,
        hand: 1,
      }),
    );

    expect(testEngine.stackLayers).toHaveLength(0);
  });
});
