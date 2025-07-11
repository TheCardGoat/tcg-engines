/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { goofyMusketeer } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { mrSmeeBumblingMate } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
import { goofyMusketeerSwordsman } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
import { goofyFlyingFool } from "@lorcanito/lorcana-engine/cards/006";
import { goofyGroundbreakingChef } from "@lorcanito/lorcana-engine/cards/008";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Goofy - Groundbreaking Chef", () => {
  it("PLENTY TO GO AROUND At the end of your turn, you may remove up to 1 damage from each of your other characters. Ready each character you removed damage from this way.", async () => {
    const shouldUntap = [
      goofyMusketeerSwordsman,
      goofyKnightForADay,
      goofyFlyingFool,
    ];
    const shouldNotUntap = [goofyGroundbreakingChef, goofyMusketeer];

    const testEngine = new TestEngine({
      play: [...shouldNotUntap, ...shouldUntap],
    });

    // The effect says your other characters, so Goofy Groundbreaking Chef should not be included
    await testEngine.setCardDamage(goofyGroundbreakingChef, 1);
    for (const card of shouldUntap) {
      await testEngine.setCardDamage(card, 1);
    }

    for (const card of [...shouldUntap, ...shouldNotUntap]) {
      await testEngine.tapCard(card);
    }

    expect(testEngine.store.turnCount).toEqual(0);
    await testEngine.passTurn();
    testEngine.changeActivePlayer("player_one");
    await testEngine.acceptOptionalLayer();
    expect(testEngine.store.turnCount).toEqual(1);

    for (const card of shouldUntap) {
      expect(testEngine.getCardModel(card).damage).toEqual(0);
      expect(testEngine.getCardModel(card).exerted).toEqual(false);
    }

    for (const card of shouldNotUntap) {
      expect(testEngine.getCardModel(card).exerted).toEqual(true);
    }

    expect(testEngine.getCardModel(goofyGroundbreakingChef).damage).toEqual(1);
  });
});

describe("Regression tests for Goofy - Groundbreaking Chef", () => {
  it("Goofy + Mr Smee", async () => {
    const testEngine = new TestEngine({
      play: [goofyGroundbreakingChef, mrSmeeBumblingMate],
    });

    await testEngine.setCardDamage(mrSmeeBumblingMate, 1);
    await testEngine.tapCard(mrSmeeBumblingMate);

    await testEngine.passTurn();
    testEngine.changeActivePlayer("player_one");
    await testEngine.acceptOptionalLayerBySource({
      source: goofyGroundbreakingChef,
    });
    await testEngine.acceptOptionalLayerBySource({
      source: mrSmeeBumblingMate,
    });

    // We should first trigger Goofy Groundbreaking Chef's ability, which will remove 1 damage from Mr Smee and ready Mr Smee
    // Given Mr Smee is ready, his ability should NOT trigger and it won't cause one damage to himself.
    expect(testEngine.getCardModel(mrSmeeBumblingMate).damage).toEqual(0);
    expect(testEngine.stackLayers).toHaveLength(0);
  });
});
