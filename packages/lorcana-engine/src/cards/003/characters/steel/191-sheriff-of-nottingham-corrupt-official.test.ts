/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { suddenChill } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
import {
  robinHoodBelovedOutlaw,
  sheriffOfNottinghamCorruptOfficial,
} from "@lorcanito/lorcana-engine/cards/003/characters/characters";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Sheriff of Nottingham - Corrupt Official", () => {
  it.skip("**TAXES SHOULD HURT** Whenever you discard a card, you may deal 1 damage to chosen opposing character.", () => {
    const testEngine = new TestEngine({
      inkwell: sheriffOfNottinghamCorruptOfficial.cost,
      play: [sheriffOfNottinghamCorruptOfficial],
    });
  });
});

describe("regression test", () => {
  it("should not trigger if opponent discards", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: suddenChill.cost,
        play: [sheriffOfNottinghamCorruptOfficial],
        hand: [suddenChill],
      },
      {
        hand: [robinHoodBelovedOutlaw],
      },
    );

    await testEngine.playCard(suddenChill);

    testEngine.changeActivePlayer("player_two");
    await testEngine.resolveTopOfStack({ targets: [robinHoodBelovedOutlaw] });
    testEngine.changeActivePlayer("player_one");

    expect(testEngine.stackLayers).toHaveLength(0);
  });
});
