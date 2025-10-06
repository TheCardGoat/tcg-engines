/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { luckyRuntOfTheLitter } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";

describe("Lucky - Runt of the Litter", () => {
  it.skip("FOLLOW MY VOICE Whenever this character quests, look at the top 2 cards of your deck. You may reveal any number of Puppy character cards and put them in your hand. Put the rest on the bottom of your deck in any order.", async () => {
    const testEngine = new TestEngine({
      inkwell: luckyRuntOfTheLitter.cost,
      play: [luckyRuntOfTheLitter],
      hand: [luckyRuntOfTheLitter],
    });

    await testEngine.playCard(luckyRuntOfTheLitter);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
