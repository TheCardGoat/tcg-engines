/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { annaBravingTheStorm } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
import { elsaTrustedSister } from "@lorcanito/lorcana-engine/cards/007/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Elsa - Trusted Sister", () => {
  it("WHAT DO WE DO NOW? Whenever this character quests, if you have a character named Anna in play, gain 1 lore.", async () => {
    const testEngine = new TestEngine({
      inkwell: 10,
      play: [elsaTrustedSister, annaBravingTheStorm],
      hand: [],
      lore: 0,
    });

    await testEngine.questCard(elsaTrustedSister);

    expect(testEngine.getLoreForPlayer("player_one")).toBe(2);
  });
});
