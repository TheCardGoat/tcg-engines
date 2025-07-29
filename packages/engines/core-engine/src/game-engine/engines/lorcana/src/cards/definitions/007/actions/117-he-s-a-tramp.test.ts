/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import { mickeyBraveLittleTailor } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { mauiHalfshark } from "@lorcanito/lorcana-engine/cards/006";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { hesATramp } from "~/game-engine/engines/lorcana/src/cards/definitions/007/actions";

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
