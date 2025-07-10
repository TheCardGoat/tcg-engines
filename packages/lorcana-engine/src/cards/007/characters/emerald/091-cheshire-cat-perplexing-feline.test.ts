/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { letTheStormRageOn } from "@lorcanito/lorcana-engine/cards/002/actions/actions";
import { beastTragicHero } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { cheshireCatPerplexingFeline } from "@lorcanito/lorcana-engine/cards/007/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

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
