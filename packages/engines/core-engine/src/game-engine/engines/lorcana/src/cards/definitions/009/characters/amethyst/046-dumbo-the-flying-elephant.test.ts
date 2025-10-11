import { describe, expect, it } from "bun:test";
import { deweyLovableShowoff } from "~/game-engine/engines/lorcana/src/cards/definitions/008";
import { dumboTheFlyingElephant } from "~/game-engine/engines/lorcana/src/cards/definitions/009/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Dumbo - The Flying Elephant", () => {
  it("Evasive (Only characters with Evasive can challenge this character.)", async () => {
    const testEngine = new TestEngine({
      play: [dumboTheFlyingElephant],
    });

    const cardUnderTest = testEngine.getCardModel(dumboTheFlyingElephant);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });

  it("AERIAL DUO When you play this character, chosen character gains Evasive until the start of your next turn.", async () => {
    const testEngine = new TestEngine({
      inkwell: dumboTheFlyingElephant.cost,
      hand: [dumboTheFlyingElephant],
      play: [deweyLovableShowoff],
    });

    const cardUnderTest = testEngine.getCardModel(dumboTheFlyingElephant);
    const target = testEngine.getCardModel(deweyLovableShowoff);

    testEngine.playCard(cardUnderTest);
    await testEngine.resolveTopOfStack({ targets: [target] });

    expect(target.hasEvasive).toBe(true);

    testEngine.passTurn();

    expect(target.hasEvasive).toBe(true);
  });
});
