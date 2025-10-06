/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { naniCaringSister } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/characters";

describe("Nani - Caring Sister", () => {
  it.skip("Support (Whenever this character quests, you may add their {S} to another chosen character’s {S} this turn.)", async () => {
    const testEngine = new TestEngine({
      play: [naniCaringSister],
    });

    const cardUnderTest = testEngine.getCardModel(naniCaringSister);
    expect(cardUnderTest.hasSupport).toBe(true);
  });

  it.skip("I AM SO SORRY 2 {I} - Chosen character gets -1 {S} until the start of your next turn.", async () => {
    const testEngine = new TestEngine({
      inkwell: naniCaringSister.cost,
      play: [naniCaringSister],
      hand: [naniCaringSister],
    });

    await testEngine.playCard(naniCaringSister);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
