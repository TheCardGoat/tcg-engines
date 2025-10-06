/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import {
  genieOnTheJob,
  jetsamUrsulaSpy,
  maximusPalaceHorse,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/characters";
import { jasmineInspiredResearcher } from "~/game-engine/engines/lorcana/src/cards/definitions/007";

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
