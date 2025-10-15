import { describe, expect, it } from "bun:test";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";
import {
  fireTheCannons,
  nalaUndauntedLioness,
} from "./173-nala-undaunted-lioness";

describe("Nala - Undaunted Lioness", () => {
  it("DETERMINED DIVERSION While this character has no damage, she gets +1 {L} and gains Resist +1. (Damage dealt to them is reduced by 1.)", async () => {
    const testEngine = new TestEngine({
      play: [nalaUndauntedLioness],
    });

    const cardUnderTest = testEngine.getCardModel(nalaUndauntedLioness);

    expect(cardUnderTest.damage).toBe(0);
    expect(cardUnderTest.hasResist).toBe(true);
    expect(cardUnderTest.lore).toBe(nalaUndauntedLioness.lore + 1);
  });

  it("DETERMINED DIVERSION While this character has no damage, she gets +1 {L} and gains Resist +1. (Damage dealt to them is reduced by 1.)", async () => {
    const testEngine = new TestEngine({
      inkwell: nalaUndauntedLioness.cost,
      play: [nalaUndauntedLioness],
      hand: [fireTheCannons],
    });

    const cardUnderTest = testEngine.getCardModel(nalaUndauntedLioness);

    expect(cardUnderTest.lore).toEqual(3);
    expect(cardUnderTest.hasResist).toBe(true);

    await testEngine.playCard(fireTheCannons, { targets: [cardUnderTest] });

    expect(cardUnderTest.lore).toEqual(2);
    expect(cardUnderTest.damage).toEqual(1);
  });
});
