import { describe, expect, it } from "bun:test";
import {
  antonioMadrigalFriendToAll,
  antoniosJaguarFaithfulCompanion,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Antonio's Jaguar - Faithful Companion", () => {
  it("YOU WANT TO GO WHERE? When you play this character, if you have a character in play named Antonio Madrigal, gain 1 lore.", async () => {
    const testEngine = new TestEngine({
      inkwell: antoniosJaguarFaithfulCompanion.cost,
      hand: [antoniosJaguarFaithfulCompanion],
      play: [antonioMadrigalFriendToAll],
    });

    await testEngine.playCard(antoniosJaguarFaithfulCompanion);

    expect(testEngine.getLoreForPlayer("player_one")).toEqual(1);
    //await testEngine.resolveTopOfStack({});
  });
  it("YOU WANT TO GO WHERE? When you play this character, if you have a character in play named Antonio Madrigal, gain 1 lore.", async () => {
    const testEngine = new TestEngine({
      inkwell: antoniosJaguarFaithfulCompanion.cost,
      hand: [antoniosJaguarFaithfulCompanion],
    });

    await testEngine.playCard(antoniosJaguarFaithfulCompanion);

    expect(testEngine.getLoreForPlayer("player_one")).toEqual(0);
    //await testEngine.resolveTopOfStack({});
  });
});
