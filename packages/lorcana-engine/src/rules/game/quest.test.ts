/**
 * @jest-environment node
 */

import { expect, it } from "@jest/globals";
import { liloMakingAWish } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import {
  beastForbiddingRecluse,
  beastTragicHero,
} from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

it.skip("Quest with all characters at once", async () => {
  const testEngine = new TestEngine({
    inkwell: 3,
    play: [beastForbiddingRecluse, liloMakingAWish],
    hand: [beastTragicHero],
  });

  await testEngine.shiftCard({
    shifted: beastForbiddingRecluse,
    shifter: beastTragicHero,
  });

  await testEngine.questWithAll("player_one");

  expect(testEngine.getLoreForPlayer()).toEqual(100);
});
