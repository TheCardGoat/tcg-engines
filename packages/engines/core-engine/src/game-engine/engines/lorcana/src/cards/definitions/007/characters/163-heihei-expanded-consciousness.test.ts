import { describe, expect, it } from "bun:test";
import {
  dawsonPuzzlingSleuth,
  heiheiExpandedConsciousness,
  luckyRuntOfTheLitter,
} from "~/game-engine/engines/lorcana/src/cards/definitions/007";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Heihei - Expanded Consciousness", () => {
  it("Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Heihei.)", async () => {
    const testEngine = new TestEngine({
      play: [heiheiExpandedConsciousness],
    });

    const cardUnderTest = testEngine.getCardModel(heiheiExpandedConsciousness);
    expect(cardUnderTest.hasShift()).toBe(true);
  });

  it("Resist +1 (Damage dealt to this character is reduced by 1.)", async () => {
    const testEngine = new TestEngine({
      play: [heiheiExpandedConsciousness],
    });

    const cardUnderTest = testEngine.getCardModel(heiheiExpandedConsciousness);
    expect(cardUnderTest.hasResist).toBe(true);
  });

  it("CLEAR YOUR MIND When you play this character, put all cards from your hand into your inkwell facedown and exerted.", async () => {
    const testEngine = new TestEngine({
      inkwell: heiheiExpandedConsciousness.cost,
      hand: [
        heiheiExpandedConsciousness,
        luckyRuntOfTheLitter,
        dawsonPuzzlingSleuth,
      ],
    });

    await testEngine.playCard(heiheiExpandedConsciousness);

    expect(testEngine.getCardModel(heiheiExpandedConsciousness).zone).toBe(
      "play",
    );
    expect(testEngine.getCardModel(luckyRuntOfTheLitter).zone).toBe("inkwell");
    expect(testEngine.getCardModel(dawsonPuzzlingSleuth).zone).toBe("inkwell");
  });
});
