/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { calhounHardnosedLeader } from "@lorcanito/lorcana-engine/cards/008/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Calhoun - Hard-Nosed Leader", () => {
  it("Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)", async () => {
    const testEngine = new TestEngine({
      play: [calhounHardnosedLeader],
    });

    const cardUnderTest = testEngine.getCardModel(calhounHardnosedLeader);
    expect(cardUnderTest.hasBodyguard).toBe(true);
  });

  it("LOOT DROP When this character is banished, gain 1 lore.", async () => {
    const testEngine = new TestEngine({
      play: [calhounHardnosedLeader],
    });

    const cardToTest = await testEngine.getCardModel(calhounHardnosedLeader);

    await cardToTest.banish();

    expect(cardToTest.zone).toEqual("discard");
    expect(testEngine.getLoreForPlayer("player_one")).toEqual(1);
  });
});
