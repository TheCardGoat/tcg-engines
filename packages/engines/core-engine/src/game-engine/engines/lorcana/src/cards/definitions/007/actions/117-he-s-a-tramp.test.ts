import { describe, expect, it } from "bun:test";
import { mickeyBraveLittleTailor } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { mauiHalfshark } from "~/game-engine/engines/lorcana/src/cards/definitions/006";
import { hesATramp } from "~/game-engine/engines/lorcana/src/cards/definitions/007/actions";
import { TestEngine } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("He's A Tramp", () => {
  it("Chosen character gets +1 {S} this turn for each character you have in play.", async () => {
    const charsInPlay = [mickeyBraveLittleTailor, mauiHalfshark];
    const testEngine = new TestEngine({
      inkwell: 10,
      play: charsInPlay,
      hand: [hesATramp],
    });

    await testEngine.playCard(hesATramp);
    await testEngine.resolveTopOfStack({ targets: [mickeyBraveLittleTailor] });

    expect(testEngine.getCardModel(mickeyBraveLittleTailor).strength).toBe(
      mickeyBraveLittleTailor.strength + charsInPlay.length,
    );
  });
});
