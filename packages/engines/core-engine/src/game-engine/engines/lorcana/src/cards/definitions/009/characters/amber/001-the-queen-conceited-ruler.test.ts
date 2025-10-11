import { describe, expect, it } from "bun:test";
import {
  charlotteLaBouffMardiGrasPrincess,
  deweyLovableShowoff,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008";
import { theQueenConceitedRuler } from "~/game-engine/engines/lorcana/src/cards/definitions/009";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("The Queen - Conceited Ruler", () => {
  it("Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)", async () => {
    const testEngine = new TestEngine({
      play: [theQueenConceitedRuler],
    });

    const cardUnderTest = testEngine.getCardModel(theQueenConceitedRuler);
    expect(cardUnderTest.hasSupport()).toBe(true);
  });

  it("ROYAL SUMMONS At the start of your turn, you may choose and discard a Princess or Queen character card to return a character card from your discard to your hand.", async () => {
    const testEngine = new TestEngine({
      play: [theQueenConceitedRuler],
      hand: [charlotteLaBouffMardiGrasPrincess],
      discard: [deweyLovableShowoff],
    });

    await testEngine.passTurn();
    await testEngine.passTurn();

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack(
      { targets: [charlotteLaBouffMardiGrasPrincess] },
      true,
    );

    expect(
      testEngine.getCardModel(charlotteLaBouffMardiGrasPrincess).zone,
    ).toBe("discard");

    await testEngine.resolveTopOfStack({ targets: [deweyLovableShowoff] });

    expect(testEngine.getCardModel(deweyLovableShowoff).zone).toBe("hand");
  });
});
