/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { annaBravingTheStorm } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/characters";
import { elsaTrustedSister } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
