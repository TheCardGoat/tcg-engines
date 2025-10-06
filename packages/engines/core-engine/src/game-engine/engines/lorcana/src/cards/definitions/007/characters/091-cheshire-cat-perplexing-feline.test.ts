/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { letTheStormRageOn } from "~/game-engine/engines/lorcana/src/cards/definitions/002/actions";
import { beastTragicHero } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/characters";
import { cheshireCatPerplexingFeline } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("MAD GRIN When you play this character, you may deal 2 damage to chosen damaged character.", () => {
  it.skip("should deal 2 damage to chosend damaged character, when played", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: 10,
        hand: [cheshireCatPerplexingFeline, letTheStormRageOn],
      },
      {
        play: [beastTragicHero],
      },
    );

    await testEngine.playCard(cheshireCatPerplexingFeline);
    const cardTarget = testEngine.getCardModel(beastTragicHero);
    expect(cardTarget.damage).toEqual(0);
    await testEngine.playCard(
      letTheStormRageOn,
      {
        targets: [beastTragicHero],
      },
      true,
    );
    expect(cardTarget.damage).toEqual(2);
    await testEngine.playCard(
      beastTragicHero,
      {
        targets: [beastTragicHero],
      },
      true,
    );
    expect(cardTarget.damage).toEqual(2);
  });
});
