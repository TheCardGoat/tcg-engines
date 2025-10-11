import { describe, expect, it } from "bun:test";
import { calhounCourageousRescuer } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Calhoun - Courageous Rescuer", () => {
  it.skip("Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Calhoun.)", async () => {
    const testEngine = new TestEngine({
      play: [calhounCourageousRescuer],
    });

    const cardUnderTest = testEngine.getCardModel(calhounCourageousRescuer);
    expect(cardUnderTest.hasShift).toBe(true);
  });

  it.skip("BACK TO START POSITIONS! Whenever this character challenges another character, you may return a Racer character card from your discard to your hand.", async () => {
    const testEngine = new TestEngine({
      inkwell: calhounCourageousRescuer.cost,
      play: [calhounCourageousRescuer],
      hand: [calhounCourageousRescuer],
    });

    await testEngine.playCard(calhounCourageousRescuer);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
