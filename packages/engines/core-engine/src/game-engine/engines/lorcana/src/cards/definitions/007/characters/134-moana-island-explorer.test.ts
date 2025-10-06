/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { moanaIslandExplorer } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Moana - Island Explorer", () => {
  it.skip("Evasive (Only characters with Evasive can challenge this character.)", async () => {
    const testEngine = new TestEngine({
      play: [moanaIslandExplorer],
    });

    const cardUnderTest = testEngine.getCardModel(moanaIslandExplorer);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });

  it.skip("ADVENTUROUS SPIRIT Whenever this character challenges another character, another chosen character of yours gets +3 {S} this turn.", async () => {
    const testEngine = new TestEngine({
      inkwell: moanaIslandExplorer.cost,
      play: [moanaIslandExplorer],
      hand: [moanaIslandExplorer],
    });

    await testEngine.playCard(moanaIslandExplorer);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
