/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { queenOfHeartsWonderlandEmpress } from "~/game-engine/engines/lorcana/src/cards/definitions/009/index";

describe("Queen of Hearts - Wonderland Empress", () => {
  it.skip("**ALL WAYS HERE ARE MY WAYS** Whenever this character quests, your other Villain characters get +1 {L} this turn.", async () => {
    const testEngine = new TestEngine({
      inkwell: queenOfHeartsWonderlandEmpress.cost,
      play: [queenOfHeartsWonderlandEmpress],
      hand: [queenOfHeartsWonderlandEmpress],
    });

    await testEngine.playCard(queenOfHeartsWonderlandEmpress);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
