/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { dingleHopper } from "~/game-engine/engines/lorcana/src/cards/definitions/001/items/items";
import { pachaEmperorsGuide } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/characters";
import { rapunzelsTowerSecludedPrison } from "~/game-engine/engines/lorcana/src/cards/definitions/005/locations/locations";

describe("Pacha - Emperor's Guide", () => {
  it("**HELPFUL SUPPLIES** At the start of your turn, if you have an item in play, gain 1 lore.", () => {
    const testStore = new TestStore({
      inkwell: pachaEmperorsGuide.cost,
      play: [pachaEmperorsGuide, dingleHopper],
    });

    testStore.passTurn();
    expect(testStore.store.turnCount).toBe(1);
    testStore.passTurn();
    testStore.resolveTopOfStack({}, true);
    testStore.resolveTopOfStack({}, true);
    expect(testStore.store.turnCount).toBe(2);

    expect(testStore.stackLayers).toHaveLength(0);
    expect(testStore.getPlayerLore()).toBe(1);
  });

  it("**PERFECT DIRECTIONS** At the start of your turn, if you have a location in play, gain 1 lore.", () => {
    const testStore = new TestStore(
      {
        play: [pachaEmperorsGuide, rapunzelsTowerSecludedPrison],
        deck: 2,
      },
      { deck: 2 },
    );

    testStore.passTurn();
    expect(testStore.store.turnCount).toBe(1);
    testStore.passTurn();
    expect(testStore.store.turnCount).toBe(2);
    testStore.resolveTopOfStack({}, true);
    testStore.resolveTopOfStack({}, true);

    expect(testStore.stackLayers).toHaveLength(0);
    expect(testStore.getPlayerLore()).toBe(1);
  });

  it("Having both", () => {
    const testStore = new TestStore(
      {
        play: [pachaEmperorsGuide, rapunzelsTowerSecludedPrison, dingleHopper],
        deck: 2,
      },
      { deck: 2 },
    );

    testStore.passTurn();
    expect(testStore.store.turnCount).toBe(1);
    testStore.passTurn();
    testStore.resolveTopOfStack({}, true);
    testStore.resolveTopOfStack({}, true);

    expect(testStore.stackLayers).toHaveLength(0);
    expect(testStore.store.turnCount).toBe(2);
    expect(testStore.getPlayerLore()).toBe(2);
  });

  it("Having none", () => {
    const testStore = new TestStore(
      {
        play: [pachaEmperorsGuide],
        deck: 2,
      },
      { deck: 2 },
    );

    testStore.passTurn();
    expect(testStore.store.turnCount).toBe(1);
    testStore.passTurn();
    expect(testStore.store.turnCount).toBe(2);

    expect(testStore.stackLayers).toHaveLength(0);
    expect(testStore.getPlayerLore()).toBe(0);
  });
});

describe("Regression", () => {
  it("should let opponent pass turn when there's no valid target", () => {
    const testStore = new TestStore(
      { deck: 2 },
      {
        play: [pachaEmperorsGuide],
        deck: 2,
      },
    );

    const moveResponse = testStore.passTurn();
    expect(moveResponse.success).toBe(true);
    expect(testStore.store.turnCount).toBe(1);

    const secondMoveResponse = testStore.passTurn();
    expect(secondMoveResponse.success).toBe(true);
    expect(testStore.store.turnCount).toBe(2);

    expect(testStore.stackLayers).toHaveLength(0);
    expect(testStore.getPlayerLore()).toBe(0);
  });
});
