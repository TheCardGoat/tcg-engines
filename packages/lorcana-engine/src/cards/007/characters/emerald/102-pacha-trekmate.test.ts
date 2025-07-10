/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { suddenChill } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
import { letTheStormRageOn } from "@lorcanito/lorcana-engine/cards/002/actions/actions";
import { brawl } from "@lorcanito/lorcana-engine/cards/004/actions/actions";
import { pachaTrekmate } from "@lorcanito/lorcana-engine/cards/007/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("FULL PACK While you have more cards in hand than each opponent, this character gets +2 {L}.", () => {
  it("should have +2 {L} if having more cards in hand", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: pachaTrekmate.cost,
        play: [pachaTrekmate],
        hand: [letTheStormRageOn, suddenChill],
      },
      {
        inkwell: pachaTrekmate.cost,
        play: [],
        hand: [brawl],
      },
    );

    const cardUnderTest = testEngine.getCardModel(pachaTrekmate);

    expect(cardUnderTest.lore).toBe(3);
  });
  it("should not have +2 {L} if not having more cards in hand", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: pachaTrekmate.cost,
        play: [pachaTrekmate],
        hand: [letTheStormRageOn],
      },
      {
        inkwell: pachaTrekmate.cost,
        play: [],
        hand: [brawl],
      },
    );

    const cardUnderTest = testEngine.getCardModel(pachaTrekmate);

    expect(cardUnderTest.lore).toBe(1);
  });
});
