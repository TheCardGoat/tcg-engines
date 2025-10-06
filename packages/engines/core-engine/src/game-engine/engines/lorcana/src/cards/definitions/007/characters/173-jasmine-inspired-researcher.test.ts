/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  genieOnTheJob,
  jetsamUrsulaSpy,
  maximusPalaceHorse,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { jasmineInspiredResearcher } from "~/game-engine/engines/lorcana/src/cards/definitions/007";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Jasmine - Inspired Researcher", () => {
  it("EXTRA ASSISTANCE Whenever this character quests, if you have no cards in your hand, draw a card for each Ally character you have in play.", async () => {
    const characterCards = [maximusPalaceHorse, genieOnTheJob];
    const testEngine = new TestEngine(
      {
        deck: 10,
        play: [jasmineInspiredResearcher, ...characterCards],
      },
      {
        play: [jetsamUrsulaSpy],
      },
    );

    await testEngine.questCard(jasmineInspiredResearcher);

    expect(testEngine.getZonesCardCount("player_one").hand).toBe(
      characterCards.length,
    );
  });

  it("EXTRA ASSISTANCE Whenever this character quests, if you have no cards in your hand, draw a card for each Ally character you have in play.", async () => {
    const characterCards = [maximusPalaceHorse, genieOnTheJob];
    const testEngine = new TestEngine({
      deck: 10,
      play: [jasmineInspiredResearcher, jetsamUrsulaSpy],
    });

    await testEngine.questCard(jasmineInspiredResearcher);

    expect(testEngine.getZonesCardCount("player_one")).toEqual(
      expect.objectContaining({
        hand: 1,
        deck: 9,
      }),
    );
  });
});
