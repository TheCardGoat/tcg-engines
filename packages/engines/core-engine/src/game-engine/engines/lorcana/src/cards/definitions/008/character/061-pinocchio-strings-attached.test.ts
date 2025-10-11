import { describe, expect, it } from "bun:test";
import { pinocchioStringsAttached } from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Pinocchio - Strings Attached", () => {
  it("Evasive (Only characters with Evasive can challenge this character.)", async () => {
    const testEngine = new TestEngine({
      play: [pinocchioStringsAttached],
    });

    const cardUnderTest = testEngine.getCardModel(pinocchioStringsAttached);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });

  it("GOT TO KEEP REAL QUIET Once during your turn, whenever you ready this character, you may draw a card.", async () => {
    const testEngine = new TestEngine({
      play: [pinocchioStringsAttached],
    });

    const cardUnderTest = testEngine.getCardModel(pinocchioStringsAttached);

    cardUnderTest.exert();

    cardUnderTest.readyCharacter();
    await testEngine.resolveOptionalAbility();

    expect(testEngine.getCardsByZone("hand").length).toEqual(1);
  });
});
