/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  dawsonPuzzlingSleuth,
  heiheiExpandedConsciousness,
  luckyRuntOfTheLitter,
} from "@lorcanito/lorcana-engine/cards/007";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Heihei - Expanded Consciousness", () => {
  it("Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Heihei.)", async () => {
    const testEngine = new TestEngine({
      play: [heiheiExpandedConsciousness],
    });

    const cardUnderTest = testEngine.getCardModel(heiheiExpandedConsciousness);
    expect(cardUnderTest.hasShift).toBe(true);
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
