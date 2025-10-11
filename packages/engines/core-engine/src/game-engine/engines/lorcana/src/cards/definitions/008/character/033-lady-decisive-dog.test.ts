import { describe, expect, it } from "bun:test";
import { trampEnterprisingDog } from "~/game-engine/engines/lorcana/src/cards/definitions/007";
import {
  ladyDecisiveDog,
  trampObservantGuardian,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Lady - Decisive Dog", () => {
  it("TAKE THE LEAD While this character has 3 {S} or more, she gets +2 {L}. + PACK OF HER OWN Whenever you play a character, this character gets +1 {S} this turn.", async () => {
    const testEngine = new TestEngine({
      inkwell: 4,
      play: [ladyDecisiveDog],
      hand: [trampEnterprisingDog, trampObservantGuardian],
    });

    const cardUnderTest = testEngine.getCardModel(ladyDecisiveDog);

    expect(cardUnderTest.strength).toBe(0);
    expect(cardUnderTest.lore).toBe(1);

    await testEngine.playCard(trampObservantGuardian);
    await testEngine.resolveTopOfStack({ targets: [cardUnderTest] });

    expect(cardUnderTest.strength).toBe(1);
    expect(cardUnderTest.lore).toBe(1);

    await testEngine.playCard(trampEnterprisingDog);
    await testEngine.resolveTopOfStack({ targets: [cardUnderTest] });

    // Lady +1 {S} & Tramp +2 {S}
    expect(cardUnderTest.strength).toBe(4);
    expect(cardUnderTest.lore).toBe(3);
  });
});
