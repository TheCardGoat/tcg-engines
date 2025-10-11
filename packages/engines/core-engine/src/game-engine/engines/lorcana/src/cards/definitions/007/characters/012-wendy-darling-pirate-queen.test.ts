import { describe, expect, it } from "bun:test";
import { wendyDarlingPirateQueen } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Wendy Darling - Pirate Queen", () => {
  it.skip("Evasive (Only characters with Evasive can challenge this character.)", async () => {
    const testEngine = new TestEngine({
      play: [wendyDarlingPirateQueen],
    });

    const cardUnderTest = testEngine.getCardModel(wendyDarlingPirateQueen);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });

  it.skip("TELL NO TALES Whenever one of your other characters is banished, you may remove all damage from chosen character.", async () => {
    const testEngine = new TestEngine({
      inkwell: wendyDarlingPirateQueen.cost,
      play: [wendyDarlingPirateQueen],
      hand: [wendyDarlingPirateQueen],
    });

    await testEngine.playCard(wendyDarlingPirateQueen);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
